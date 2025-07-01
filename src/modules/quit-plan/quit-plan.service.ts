import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuitPlanDto } from './dto/create-quit-plan.dto';
import { CreateQuitPlanRecordDto } from '../plan-record/dto/create-plan-record.dto';
import { QuitPlanRepository } from './quit-plan.repository';
import { PlanRecordService } from '../plan-record/plan-record.service';
import { AIService } from '@libs/ai/ai.service';
import { QUIT_PLAN_MESSAGES } from '@common/constants/messages';
import { SmokingHabitsService } from '@modules/smoking-habits/smoking-habits.service';
import { QuitPlanResponseDto } from './dto/quit-plan-response.dto';
import { QuitPlanPhaseResponseDto } from './dto/quit-plan-phase-response.dto';
import { QuitPlanRecordResponseDto } from '../plan-record/dto/quit-plan-record-response.dto';
import { plainToInstance } from 'class-transformer';
import { QuitPlanRecord } from '../plan-record/entities/quit-plan-record.entity';


@Injectable()
export class QuitPlanService {
  private readonly logger = new Logger(QuitPlanService.name);

  constructor(
    private readonly quitPlanRepository: QuitPlanRepository,
    private readonly planRecordService: PlanRecordService,
    private readonly aiService: AIService,
    private readonly smokingHabitsService: SmokingHabitsService,
  ) {}

  async createQuitPlan(
    userId: string,
    data: CreateQuitPlanDto,
  ): Promise<QuitPlanResponseDto> {
    try {
      const existingActivePlan =
        await this.quitPlanRepository.findActiveQuitPlanByUserId(userId);
      if (existingActivePlan) {
        throw new BadRequestException(QUIT_PLAN_MESSAGES.ACTIVE_PLAN_EXISTS);
      }

      const smokingHabits =
        await this.smokingHabitsService.findByUserId(userId);
      if (!smokingHabits) {
        throw new BadRequestException(
          QUIT_PLAN_MESSAGES.SMOKING_HABITS_REQUIRED,
        );
      }

      const smokingHabitsData = {
        cigarettes_per_day: smokingHabits.cigarettes_per_day || 0,
        smoking_years: smokingHabits.smoking_years || 0,
        triggers: smokingHabits.triggers,
        health_issues: smokingHabits.health_issues,
        cigarettes_per_pack: smokingHabits.cigarettes_per_pack || 20,
        price_per_pack: smokingHabits.price_per_pack || 0,
      };

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(0, 0, 0, 0);

      const aiPhases = await this.aiService.generateQuitPlanPhases(
        data.plan_type,
        smokingHabitsData,
        startDate,
      );

      if (!aiPhases || aiPhases.length === 0) {
        throw new BadRequestException(
          QUIT_PLAN_MESSAGES.FAILED_TO_GENERATE_PHASES,
        );
      }

      const totalDays = aiPhases.reduce(
        (acc, phase) => acc + (phase.duration_days || 0),
        0,
      );

      const expectedEndDate = new Date(startDate);
      expectedEndDate.setDate(expectedEndDate.getDate() + totalDays);

      const quitPlan = await this.quitPlanRepository.create({
        user_id: userId,
        start_date: startDate,
        expected_end_date: expectedEndDate,
        total_phases: aiPhases.length,
        totalDays: totalDays,
        status: 'ACTIVE',
        reason: data.reason || 'No reason provided',
        plan_type: data.plan_type ? data.plan_type.toUpperCase() : 'STANDARD',
      });

      const createdPhases = await Promise.all(
        aiPhases.map((phase, index) =>
          this.quitPlanRepository.createPhase({
            plan_id: quitPlan.id,
            user_id: userId,
            phase_number: phase.phase_number || index + 1,
            limit_cigarettes_per_day: phase.limit_cigarettes_per_day,
            start_date: phase.start_date,
            expected_end_date: phase.expected_end_date,
            status:
              (phase.phase_number || index + 1) === 1 ? 'ACTIVE' : 'PENDING',
          }),
        ),
      );

      return plainToInstance(
        QuitPlanResponseDto,
        {
          ...quitPlan,
          phases: createdPhases,
          ai_generated: true,
        },
        { excludeExtraneousValues: true },
      );
    } catch (error) {
      this.logger.error('Error creating quit plan:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(QUIT_PLAN_MESSAGES.FAILED_TO_CREATE_PLAN);
    }
  }

  async createQuitPlanRecord(
    userId: string,
    data: CreateQuitPlanRecordDto,
  ): Promise<QuitPlanRecordResponseDto> {
    try {
      const record = await this.planRecordService.createRecord(userId, data);
      return plainToInstance(QuitPlanRecordResponseDto, record, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error creating quit plan record:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(QUIT_PLAN_MESSAGES.FAILED_TO_CREATE_RECORD);
    }
  }

  async getQuitPlanById(
    userId: string,
    planId: string,
  ): Promise<QuitPlanResponseDto | null> {
    try {
      const quitPlan = await this.quitPlanRepository.findById(planId);

      if (!quitPlan) {
        return null;
      }

      const phases = await this.quitPlanRepository.findQuitPlanPhases(
        planId,
        userId,
      );
      const currentPhase = quitPlan.getCurrentPhase(phases);

      let records: QuitPlanRecord[] = [];
      if (currentPhase) {
        records = await this.planRecordService.getRecordsByPlanAndPhase(
          userId,
          planId,
          currentPhase.id,
        );
      }

      const allRecords = await this.planRecordService.getAllRecordsByPlan(
        userId,
        planId,
      );

      const statistics = quitPlan.calculateStatistics(allRecords);
      const progress = quitPlan.calculateProgress(phases, records);

      const enhancedPhases = await Promise.all(
        phases.map(async (phase) => {
          const phaseRecords =
            await this.planRecordService.getRecordsByPlanAndPhase(
              userId,
              planId,
              phase.id,
            );
          const phaseStats = phase.getPhaseStatistics(phaseRecords);
          const calculatedStatus = phase.getCalculatedStatus(phaseRecords);

          return plainToInstance(
            QuitPlanPhaseResponseDto,
            {
              ...phase,
              status: calculatedStatus,
              duration: phase.getDuration(),
              remainingDays: phase.getRemainingDays(),
              statistics: phaseStats,
            },
            { excludeExtraneousValues: true },
          );
        }),
      );

      return plainToInstance(
        QuitPlanResponseDto,
        {
          ...quitPlan,
          phases: enhancedPhases,
          currentPhase: currentPhase
            ? plainToInstance(
                QuitPlanPhaseResponseDto,
                {
                  ...currentPhase,
                  isPending: currentPhase.isProgress(),
                  isCompleted: currentPhase.isCompleted(),
                  isFailed: currentPhase.isFailed(),
                  duration: currentPhase.getDuration(),
                  remainingDays: currentPhase.getRemainingDays(),
                  statistics: currentPhase.getPhaseStatistics(records),
                },
                { excludeExtraneousValues: true },
              )
            : null,
          progress,
          statistics,
        },
        { excludeExtraneousValues: true },
      );
    } catch (error) {
      this.logger.error('Error getting quit plan by id:', error);
      throw new BadRequestException(QUIT_PLAN_MESSAGES.FAILED_TO_RETRIEVE_PLAN);
    }
  }

  async deleteQuitPlan(
    userId: string,
    planId: string,
  ): Promise<QuitPlanResponseDto> {
    try {
      const quitPlan = await this.quitPlanRepository.findById(planId);

      if (!quitPlan) {
        throw new NotFoundException(QUIT_PLAN_MESSAGES.PLAN_NOT_FOUND);
      }

      const deletedPlan = await this.quitPlanRepository.softDelete(planId);
      return plainToInstance(QuitPlanResponseDto, deletedPlan, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error deleting quit plan:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(QUIT_PLAN_MESSAGES.FAILED_TO_DELETE_PLAN);
    }
  }

  async getAllQuitPlans(userId: string): Promise<QuitPlanResponseDto[]> {
    try {
      const quitPlans = await this.quitPlanRepository.findAllByUserId(userId);
      return quitPlans.map((plan) =>
        plainToInstance(QuitPlanResponseDto, plan, {
          excludeExtraneousValues: true,
        }),
      );
    } catch (error) {
      this.logger.error('Error getting all quit plans:', error);
      throw new BadRequestException(
        QUIT_PLAN_MESSAGES.FAILED_TO_RETRIEVE_PLANS,
      );
    }
  }
}

import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuitPlanRecordDto } from './dto/create-plan-record.dto';
import { QuitPlanRecordRepository } from './plan-record.repository';
import { QuitPlanRecord } from './entities/quit-plan-record.entity';
import { PrismaService } from '@libs/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { QuitPlanRepository } from '../quit-plan/quit-plan.repository';
import { SmokingHabitsService } from '../smoking-habits/smoking-habits.service';
import { DateTime } from 'luxon';

@Injectable()
export class PlanRecordService {
  private readonly logger = new Logger(PlanRecordService.name);

  constructor(
    private readonly quitPlanRecordRepository: QuitPlanRecordRepository,
    private readonly quitPlanRepository: QuitPlanRepository,
    private readonly smokingHabitsService: SmokingHabitsService,
    private readonly prisma: PrismaService,
  ) {}

  async createRecord(userId: string, data: CreateQuitPlanRecordDto) {
    try {
      // Find active quit plan
      const activePlan =
        await this.quitPlanRepository.findActiveQuitPlanByUserId(userId);
      if (!activePlan) {
        throw new BadRequestException('No active quit plan found');
      }

      // Find active phase
      const activePhase = await this.quitPlanRepository.findActivePhaseByPlanId(
        activePlan.id,
        userId,
      );
      if (!activePhase) {
        throw new BadRequestException('No active phase found in the quit plan');
      }

      const smokingHabits =
        await this.smokingHabitsService.findByUserId(userId);
      if (!smokingHabits) {
        throw new NotFoundException('Smoking habits profile not found');
      }

      // Use Luxon for proper Vietnam timezone handling
      const vietnamNow = DateTime.now().setZone('Asia/Ho_Chi_Minh');
      const vietnamToday = vietnamNow.startOf('day');
      
      // Get record date in Vietnam timezone
      let recordDate: DateTime;
      if (typeof data.record_date === 'string') {
        recordDate = DateTime.fromISO(data.record_date).setZone('Asia/Ho_Chi_Minh');
      } else {
        recordDate = DateTime.fromJSDate(data.record_date).setZone('Asia/Ho_Chi_Minh');
      }
      
      const recordDateStartOfDay = recordDate.startOf('day');

      console.log('Record date (Vietnam):', recordDateStartOfDay.toISO());
      console.log('Current date (Vietnam):', vietnamToday.toISO());
      console.log('Record date string:', recordDateStartOfDay.toFormat('yyyy-MM-dd'));
      console.log('Current date string:', vietnamToday.toFormat('yyyy-MM-dd'));

      // Compare dates using Luxon
      if (recordDateStartOfDay > vietnamToday) {
        throw new BadRequestException('Cannot record data for future dates');
      }
      if (recordDateStartOfDay < vietnamToday) {
        throw new BadRequestException('Cannot record data for past dates');
      }

      // Check if there's already a record for the specific date
      // Create date range using UTC dates that represent Vietnam dates
      const queryDateString = recordDateStartOfDay.toFormat('yyyy-MM-dd');
      const [queryYear, queryMonth, queryDay] = queryDateString.split('-').map(Number);
      const startOfDay = new Date(Date.UTC(queryYear, queryMonth - 1, queryDay));
      const endOfDay = new Date(Date.UTC(queryYear, queryMonth - 1, queryDay, 23, 59, 59, 999));
      
      const existingDateRecord =
        await this.quitPlanRecordRepository.findTodayRecord(
          userId,
          activePlan.id,
          activePhase.id,
          startOfDay,
          endOfDay,
        );
      const cigarettesSmoked = Math.max(0, data.cigarette_smoke || 0);
      const originalCigarettes = smokingHabits.cigarettes_per_day || 0;

      const costPerCigarette =
        smokingHabits.cigarettes_per_pack > 0
          ? Number(smokingHabits.price_per_pack) /
            smokingHabits.cigarettes_per_pack
          : 0;

      const moneySaved = QuitPlanRecord.calculateMoneySaved(
        cigarettesSmoked,
        originalCigarettes,
        Number(smokingHabits.price_per_pack),
        smokingHabits.cigarettes_per_pack,
      );

      const isPass = QuitPlanRecord.calculateIsPass(
        cigarettesSmoked,
        activePhase.limit_cigarettes_per_day,
      );

      // Create a date that represents the Vietnam date in UTC
      const vietnamDateString = recordDateStartOfDay.toFormat('yyyy-MM-dd');
      const [year, month, day] = vietnamDateString.split('-').map(Number);
      const utcDate = new Date(Date.UTC(year, month - 1, day));

      const recordData = {
        ...data,
        record_date: utcDate, // Use UTC date that represents Vietnam date
        user_id: userId,
        plan_id: activePlan.id,
        phase_id: activePhase.id,
        created_by: userId,
        money_saved: new Prisma.Decimal(moneySaved),
        cigarette_smoke: cigarettesSmoked,
        is_pass: isPass,
      };

      let result;
      if (existingDateRecord) {
        // Update existing record
        const updatedRecord = await this.quitPlanRecordRepository.update(
          existingDateRecord.id,
          {
            cigarette_smoke: recordData.cigarette_smoke,
            money_saved: recordData.money_saved,
            craving_level: recordData.craving_level,
            health_status: recordData.health_status,
            is_pass: recordData.is_pass,
            updated_by: userId,
          },
        );

        result = {
          ...updatedRecord,
          money_saved: updatedRecord.getMoneySavedAmount(),
          craving_level_text: updatedRecord.getCravingLevelText(),
          health_status_text: updatedRecord.getHealthStatusText(),
          updated: true,
        };
      } else {
        // Create new record
        const newRecord =
          await this.quitPlanRecordRepository.create(recordData);
        result = {
          ...newRecord,
          money_saved: newRecord.getMoneySavedAmount(),
          craving_level_text: newRecord.getCravingLevelText(),
          health_status_text: newRecord.getHealthStatusText(),
        };
      }

      return result;
    } catch (error) {
      this.logger.error('Error creating plan record:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create plan record');
    }
  }

  async getRecords(userId: string, planId: string, phaseId: string) {
    try {
      const records = await this.quitPlanRecordRepository.findByPlanAndPhase(
        planId,
        phaseId,
        userId,
      );

      return records.map((record) => ({
        ...record,
        money_saved: record.getMoneySavedAmount(),
        craving_level_text: record.getCravingLevelText(),
        health_status_text: record.getHealthStatusText(),
        isToday: record.isToday(),
        isValid: record.isValid(),
        isPassing: record.isPassing(),
        isFailing: record.isFailing(),
      }));
    } catch (error) {
      this.logger.error('Error getting plan records:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve plan records');
    }
  }

  async getAllRecords(userId: string, planId: string) {
    try {
      const records = await this.quitPlanRecordRepository.findAllByPlan(
        planId,
        userId,
      );

      return records.map((record) => ({
        ...record,
        money_saved: record.getMoneySavedAmount(),
        craving_level_text: record.getCravingLevelText(),
        health_status_text: record.getHealthStatusText(),
        isToday: record.isToday(),
        isValid: record.isValid(),
        isPassing: record.isPassing(),
        isFailing: record.isFailing(),
      }));
    } catch (error) {
      this.logger.error('Error getting all plan records:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve all plan records');
    }
  }

  async getRecordsByPlanAndPhase(
    userId: string,
    planId: string,
    phaseId: string,
  ) {
    try {
      const records = await this.quitPlanRecordRepository.findByPlanAndPhase(
        planId,
        phaseId,
        userId,
      );
      return records;
    } catch (error) {
      this.logger.error('Error getting plan records by plan and phase:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve plan records');
    }
  }

  async getAllRecordsByPlan(userId: string, planId: string) {
    try {
      const records = await this.quitPlanRecordRepository.findAllByPlan(
        planId,
        userId,
      );
      return records;
    } catch (error) {
      this.logger.error('Error getting all plan records:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve all plan records');
    }
  }
}

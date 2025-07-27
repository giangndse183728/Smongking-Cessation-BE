import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateSmokingHabitDto } from './dto/create-smoking-habit.dto';
import { SmokingHabitsRepository } from './smoking-habits.repository';
import { SmokingHabitResponseDto } from './dto/res-smoking-habits.dto';
import { plainToInstance } from 'class-transformer';
import { AIService } from '@libs/ai/ai.service';
import { SMOKING_HABITS_MESSAGES } from '@common/constants/messages';
import { PrismaService } from '@libs/prisma/prisma.service';

@Injectable()
export class SmokingHabitsService {
  constructor(
    private smokingHabitsRepository: SmokingHabitsRepository,
    private aiService: AIService,
    private prisma: PrismaService,
  ) {}

  async create(
    createSmokingHabitDto: CreateSmokingHabitDto,
    userId: string,
  ): Promise<SmokingHabitResponseDto> {
    const existingHabit = await this.smokingHabitsRepository.findByUserId(userId);
    if (existingHabit) {
      throw new BadRequestException(SMOKING_HABITS_MESSAGES.HABIT_ALREADY_EXISTS);
    }

    const hasActivePlan = await this.prisma.quit_plans.findFirst({
      where: {
        user_id: userId,
        status: 'ACTIVE',
        deleted_at: null,
      },
    });

    if (hasActivePlan) {
      throw new BadRequestException(SMOKING_HABITS_MESSAGES.CANNOT_CREATE_WITH_ACTIVE_PLAN);
    }

    const aiFeedback = await this.aiService.generateSmokingHabitsFeedback({
      cigarettes_per_day: createSmokingHabitDto.cigarettes_per_day,
      cigarettes_per_pack: createSmokingHabitDto.cigarettes_per_pack,
      price_per_pack: createSmokingHabitDto.price_per_pack,
      smoking_years: createSmokingHabitDto.smoking_years,
      triggers: createSmokingHabitDto.triggers,
      health_issues: createSmokingHabitDto.health_issues,
    });

    const result = await this.smokingHabitsRepository.create({
      ...createSmokingHabitDto,
      user_id: userId,
      ai_feedback: aiFeedback,
    });

    return plainToInstance(SmokingHabitResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<SmokingHabitResponseDto> {
    const smokingHabit = await this.smokingHabitsRepository.findById(id);

    if (!smokingHabit) {
      throw new NotFoundException(SMOKING_HABITS_MESSAGES.HABIT_NOT_FOUND);
    }

    return plainToInstance(SmokingHabitResponseDto, smokingHabit, {
      excludeExtraneousValues: true,
    });
  }

  async findByUserId(userId: string): Promise<SmokingHabitResponseDto> {
    const smokingHabit = await this.smokingHabitsRepository.findByUserId(userId);

    if (!smokingHabit) {
      throw new NotFoundException(SMOKING_HABITS_MESSAGES.USER_HABIT_NOT_FOUND);
    }

    return plainToInstance(SmokingHabitResponseDto, smokingHabit, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, userId: string, data: Partial<CreateSmokingHabitDto>): Promise<SmokingHabitResponseDto> {
    const hasActivePlan = await this.prisma.quit_plans.findFirst({
      where: {
        user_id: userId,
        status: 'ACTIVE',
        deleted_at: null,
      },
    });

    if (hasActivePlan) {
      throw new BadRequestException(SMOKING_HABITS_MESSAGES.CANNOT_UPDATE_WITH_ACTIVE_PLAN);
    }

    const existingHabit = await this.findOne(id);
    if (!existingHabit) {
      throw new NotFoundException(SMOKING_HABITS_MESSAGES.HABIT_NOT_FOUND);
    }

    const result = await this.smokingHabitsRepository.update(id, data);
    return plainToInstance(SmokingHabitResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async hasActiveQuitPlan(userId: string): Promise<boolean> {
    const activePlan = await this.prisma.quit_plans.findFirst({
      where: {
        user_id: userId,
        status: 'ACTIVE',
        deleted_at: null,
      },
    });
    return !!activePlan;
  }
}
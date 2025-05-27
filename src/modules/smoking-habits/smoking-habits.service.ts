import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSmokingHabitDto } from './dto/create-smoking-habit.dto';
import { SmokingHabitsRepository } from './smoking-habits.repository';
import { SmokingHabitResponseDto } from './dto/res-smoking-habits.dto';
import { plainToInstance } from 'class-transformer';
import { AIService } from '@libs/ai/ai.service';

@Injectable()
export class SmokingHabitsService {
  constructor(
    private smokingHabitsRepository: SmokingHabitsRepository,
    private aiService: AIService,
  ) {}

  async create(createSmokingHabitDto: CreateSmokingHabitDto, userId: string): Promise<SmokingHabitResponseDto> {
    const aiFeedback = await this.aiService.generateSmokingHabitsFeedback({
      cigarettes_per_day: createSmokingHabitDto.cigarettes_per_day,
      smoking_years: createSmokingHabitDto.smoking_years,
      triggers: createSmokingHabitDto.triggers,
      health_issues: createSmokingHabitDto.health_issues,
    });

    const result = await this.smokingHabitsRepository.create({
      ...createSmokingHabitDto,
      user_id: userId,
      ai_feedback: aiFeedback
    });
    
    return plainToInstance(SmokingHabitResponseDto, result, { excludeExtraneousValues: true });
  }

  async findOne(id: string): Promise<SmokingHabitResponseDto> {
    const smokingHabit = await this.smokingHabitsRepository.findById(id);

    if (!smokingHabit) {
      throw new NotFoundException(`Smoking habit with ID ${id} not found`);
    }

    return plainToInstance(SmokingHabitResponseDto, smokingHabit, { excludeExtraneousValues: true });
  }

  async findByUserId(userId: string): Promise<SmokingHabitResponseDto> {
    const smokingHabit = await this.smokingHabitsRepository.findByUserId(userId);

    if (!smokingHabit) {
      throw new NotFoundException(`Smoking habit for user ${userId} not found`);
    }

    return plainToInstance(SmokingHabitResponseDto, smokingHabit, { excludeExtraneousValues: true });
  }

  async remove(id: string): Promise<SmokingHabitResponseDto> {
    await this.findOne(id);
    const result = await this.smokingHabitsRepository.softDelete(id);
    return plainToInstance(SmokingHabitResponseDto, result, { excludeExtraneousValues: true });
  }

  async findAllByUserId(userId: string): Promise<SmokingHabitResponseDto[]> {
    const smokingHabits = await this.smokingHabitsRepository.findAllByUserId(userId);
    return plainToInstance(SmokingHabitResponseDto, smokingHabits, { excludeExtraneousValues: true });
  }
}
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { SmokingHabitEntity } from './entities/smoking-habit.entity';
import { CreateSmokingHabitType } from './schemas/create-smoking-habit.schema';
import { Prisma } from '@prisma/client';

@Injectable()
export class SmokingHabitsRepository {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateSmokingHabitType & { user_id: string; ai_feedback: string | null }): Promise<SmokingHabitEntity> {
    const dataForPrisma: Prisma.smoking_habitsUncheckedCreateInput = {
      user_id: input.user_id,
      cigarettes_per_pack: input.cigarettes_per_pack,
      price_per_pack: new Prisma.Decimal(input.price_per_pack),
      cigarettes_per_day: input.cigarettes_per_day,
      smoking_years: input.smoking_years,
      triggers: input.triggers,
      health_issues: input.health_issues,
      ai_feedback: input.ai_feedback,
      created_at: new Date(),
      created_by: null,
      updated_at: new Date(),
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
    };
  
    const result = await this.prisma.smoking_habits.create({
      data: dataForPrisma,
    });
  
    return new SmokingHabitEntity(result);
  }

  async findAll(): Promise<SmokingHabitEntity[]> {
    const results = await this.prisma.smoking_habits.findMany({
      where: {
        deleted_at: null,
      },
    });
    return results.map((result) => new SmokingHabitEntity(result));
  }

  async findById(id: string): Promise<SmokingHabitEntity | null> {
    const result = await this.prisma.smoking_habits.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });
    return result ? new SmokingHabitEntity(result) : null;
  }

  async findByUserId(userId: string): Promise<SmokingHabitEntity | null> {
    const result = await this.prisma.smoking_habits.findFirst({
      where: {
        user_id: userId,
        deleted_at: null,
      },
    });
    return result ? new SmokingHabitEntity(result) : null;
  }

  async findAllByUserId(userId: string): Promise<SmokingHabitEntity[]> {
    const results = await this.prisma.smoking_habits.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
      },
    });
    return results.map((result) => new SmokingHabitEntity(result));
  }

  async softDelete(id: string): Promise<SmokingHabitEntity> {
    const result = await this.prisma.smoking_habits.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
    return new SmokingHabitEntity(result);
  }

  async update(
    id: string,
    data: Partial<SmokingHabitEntity>,
  ): Promise<SmokingHabitEntity> {
    // Convert price_per_pack to Decimal if it exists in the update data
    const updateData = { ...data };
    if (updateData.price_per_pack !== undefined) {
      updateData.price_per_pack = new Prisma.Decimal(updateData.price_per_pack) as any;
    }

    const result = await this.prisma.smoking_habits.update({
      where: { id },
      data: {
        ...updateData,
        updated_at: new Date(),
      },
    });
    return new SmokingHabitEntity(result);
  }
}
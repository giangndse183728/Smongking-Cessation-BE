import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { SmokingHabitEntity } from './entities/smoking-habit.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class SmokingHabitsRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.smoking_habitsUncheckedCreateInput,
  ): Promise<SmokingHabitEntity> {
    const result = await this.prisma.smoking_habits.create({
      data,
    });
    return SmokingHabitEntity.toEntity(result);
  }

  async findAll(): Promise<SmokingHabitEntity[]> {
    const results = await this.prisma.smoking_habits.findMany({
      where: {
        deleted_at: null,
      },
    });
    return results.map((result) => SmokingHabitEntity.toEntity(result));
  }

  async findById(id: string): Promise<SmokingHabitEntity | null> {
    const result = await this.prisma.smoking_habits.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });
    return result ? SmokingHabitEntity.toEntity(result) : null;
  }

  async findByUserId(userId: string): Promise<SmokingHabitEntity | null> {
    const result = await this.prisma.smoking_habits.findFirst({
      where: {
        user_id: userId,
        deleted_at: null,
      },
    });
    return result ? SmokingHabitEntity.toEntity(result) : null;
  }

  async findAllByUserId(userId: string): Promise<SmokingHabitEntity[]> {
    const results = await this.prisma.smoking_habits.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
      },
    });
    return results.map((result) => SmokingHabitEntity.toEntity(result));
  }

  async softDelete(id: string): Promise<SmokingHabitEntity> {
    const result = await this.prisma.smoking_habits.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
    return SmokingHabitEntity.toEntity(result);
  }

  async update(
    id: string,
    data: Partial<SmokingHabitEntity>,
  ): Promise<SmokingHabitEntity> {
    const result = await this.prisma.smoking_habits.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
    return SmokingHabitEntity.toEntity(result);
  }
}

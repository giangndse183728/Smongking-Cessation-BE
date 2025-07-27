import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { QuitPlanRecord } from './entities/quit-plan-record.entity';
import { Prisma, quit_plan_records } from '@prisma/client';
@Injectable()
export class QuitPlanRecordRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<QuitPlanRecord>): Promise<QuitPlanRecord> {
    const dataForPrisma: Prisma.quit_plan_recordsCreateInput = {
      ...(data as Prisma.quit_plan_recordsCreateInput),
      created_at: new Date(),
      created_by: data.user_id,
    };
    const result = await this.prisma.quit_plan_records.create({
      data: dataForPrisma,
    });

    return new QuitPlanRecord(result);
  }

  async findTodayRecord(
    userId: string,
    planId: string,
    phaseId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<QuitPlanRecord | null> {
    const result = await this.prisma.quit_plan_records.findFirst({
      where: {
        user_id: userId,
        plan_id: planId,
        phase_id: phaseId,
        record_date: { gte: startDate, lte: endDate },
        deleted_at: null,
      },
    });
    return result ? new QuitPlanRecord(result) : null;
  }

  async findByPlanAndPhase(
    planId: string,
    phaseId: string,
    userId: string,
  ): Promise<QuitPlanRecord[]> {
    const results = await this.prisma.quit_plan_records.findMany({
      where: {
        plan_id: planId,
        phase_id: phaseId,
        user_id: userId,
        deleted_at: null,
      },
      orderBy: { record_date: 'desc' },
    });
    return results.map((result) => new QuitPlanRecord(result));
  }

  async findAllByPlan(
    planId: string,
    userId: string,
  ): Promise<QuitPlanRecord[]> {
    const results = await this.prisma.quit_plan_records.findMany({
      where: {
        plan_id: planId,
        user_id: userId,
        deleted_at: null,
      },
      orderBy: { record_date: 'desc' },
    });
    return results.map((result) => new QuitPlanRecord(result));
  }

  async update(
    id: string,
    data: Partial<QuitPlanRecord>,
  ): Promise<QuitPlanRecord> {
    const result = await this.prisma.quit_plan_records.update({
      where: { id, deleted_at: null, deleted_by: null },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    return new QuitPlanRecord(result);
  }

  async softDelete(id: string): Promise<QuitPlanRecord> {
    const result = await this.prisma.quit_plan_records.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return new QuitPlanRecord(result);
  }

  async getRecordsByUserId(userId: string): Promise<quit_plan_records[]> {
    return this.prisma.quit_plan_records.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
        deleted_by: null,
      },
      orderBy: {
        record_date: 'desc',
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { QuitPlan } from './entities/quit-plan.entity';
import { QuitPlanPhase } from './entities/quit-plan-phase.entity';
import { Prisma } from '@prisma/client';
import { CreateQuitPlanType } from './schemas/quit-plan.schema';

@Injectable()
export class QuitPlanRepository {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateQuitPlanType & { 
    user_id: string;
    start_date: Date;
    expected_end_date: Date;
    totalDays: number;
    total_phases: number;
    status: string;
  }): Promise<QuitPlan> {
    const dataForPrisma: Prisma.quit_plansUncheckedCreateInput = {
      user_id: input.user_id,
      reason: input.reason,
      plan_type: input.plan_type,
      start_date: input.start_date,
      expected_end_date: input.expected_end_date,
      totalDays: input.totalDays,
      total_phases: input.total_phases,
      status: input.status,
      created_at: new Date(),
      created_by: null,
      updated_at: new Date(),
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
    };
    const result = await this.prisma.quit_plans.create({ data: dataForPrisma });
    return new QuitPlan(result);
  }

  async createPhase(data: Prisma.quit_plan_phasesUncheckedCreateInput): Promise<QuitPlanPhase> {
    const dataForPrisma: Prisma.quit_plan_phasesUncheckedCreateInput = {
      ...data,
      created_at: new Date(),
      created_by: null,
      updated_at: new Date(),
      updated_by: null,
      deleted_at: null,
      deleted_by: null,
    };
    const result = await this.prisma.quit_plan_phases.create({ data: dataForPrisma });
    return new QuitPlanPhase(result);
  }

  async findAll(): Promise<QuitPlan[]> {
    const results = await this.prisma.quit_plans.findMany({
      where: { deleted_at: null },
    });
    return results.map(result => new QuitPlan(result));
  }

  async findById(id: string): Promise<QuitPlan | null> {
    const result = await this.prisma.quit_plans.findFirst({
      where: { id, deleted_at: null },
    });
    return result ? new QuitPlan(result) : null;
  }

  async findByUserId(userId: string): Promise<QuitPlan | null> {
    const result = await this.prisma.quit_plans.findFirst({
      where: { user_id: userId, deleted_at: null },
    });
    return result ? new QuitPlan(result) : null;
  }

  async findAllByUserId(userId: string): Promise<QuitPlan[]> {
    const results = await this.prisma.quit_plans.findMany({
      where: { user_id: userId, deleted_at: null },
    });
    return results.map(result => new QuitPlan(result));
  }

  async update(id: string, data: Partial<QuitPlan>): Promise<QuitPlan> {
    const result = await this.prisma.quit_plans.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
        updated_by: null,
      },
    });
    return new QuitPlan(result);
  }

  async softDelete(id: string): Promise<QuitPlan> {
    const result = await this.prisma.quit_plans.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: null,
      },
    });
    return new QuitPlan(result);
  }

  async findQuitPlanPhases(planId: string, userId: string): Promise<QuitPlanPhase[]> {
    const results = await this.prisma.quit_plan_phases.findMany({
      where: { plan_id: planId, user_id: userId, deleted_at: null },
      orderBy: { phase_number: 'asc' },
    });
    return results.map(result => new QuitPlanPhase(result));
  }

  async updateQuitPlanPhase(id: string, data: Partial<QuitPlanPhase>): Promise<QuitPlanPhase> {
    const result = await this.prisma.quit_plan_phases.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
        updated_by: null,
      },
    });
    return new QuitPlanPhase(result);
  }

  async findActiveQuitPlanByUserId(userId: string): Promise<QuitPlan | null> {
    const plan = await this.prisma.quit_plans.findFirst({
      where: {
        user_id: userId,
        status: 'ACTIVE',
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return plan ? new QuitPlan(plan) : null;
  }

  async findActivePhaseByPlanId(planId: string, userId: string): Promise<QuitPlanPhase | null> {
    const phase = await this.prisma.quit_plan_phases.findFirst({
      where: {
        plan_id: planId,
        user_id: userId,
        status: 'IN-PROGRESS',
        deleted_at: null,
      },
    });

    return phase ? new QuitPlanPhase(phase) : null;
  }
}

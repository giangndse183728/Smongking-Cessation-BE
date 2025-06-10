import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { MembershipPlan } from './entities/membership-plan.entity';

@Injectable()
export class MembershipPlanRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<MembershipPlan> {
    try {
      const plan = await this.prisma.membership_plans.create({
        data: {
          ...data,
          features: data.features || [],
          is_active: data.is_active ?? true,
        },
      });
      return new MembershipPlan(plan);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new InternalServerErrorException('A plan with this name already exists');
      }
      throw new InternalServerErrorException(`Failed to create membership plan: ${error.message}`);
    }
  }

  async findAll(): Promise<MembershipPlan[]> {
    try {
      const plans = await this.prisma.membership_plans.findMany({
        where: {
          deleted_at: null,
        },
      });
      return plans.map(plan => new MembershipPlan(plan));
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch membership plans: ${error.message}`);
    }
  }

  async findById(id: string): Promise<MembershipPlan | null> {
    try {
      const plan = await this.prisma.membership_plans.findFirst({
        where: {
          id,
          deleted_at: null,
        },
      });
      return plan ? new MembershipPlan(plan) : null;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch membership plan: ${error.message}`);
    }
  }

  async findByName(name: string): Promise<MembershipPlan | null> {
    try {
      const plan = await this.prisma.membership_plans.findFirst({
        where: {
          name,
          deleted_at: null,
        },
      });
      return plan ? new MembershipPlan(plan) : null;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch membership plan: ${error.message}`);
    }
  }

  async update(id: string, data: any): Promise<MembershipPlan> {
    try {
      const plan = await this.prisma.membership_plans.update({
        where: { id },
        data: {
          ...data,
          features: data.features || undefined,
        },
      });
      return new MembershipPlan(plan);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new InternalServerErrorException('A plan with this name already exists');
      }
      throw new InternalServerErrorException(`Failed to update membership plan: ${error.message}`);
    }
  }

  async softDelete(id: string): Promise<MembershipPlan> {
    try {
      const plan = await this.prisma.membership_plans.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      });
      return new MembershipPlan(plan);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete membership plan: ${error.message}`);
    }
  }
} 
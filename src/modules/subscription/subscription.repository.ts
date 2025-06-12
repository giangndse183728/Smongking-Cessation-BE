import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    user_id: string;
    plan_id: string;
    start_date: Date;
    end_date: Date;
    payment_status: string;
    order_code: string;
  }) {
    return this.prisma.user_subscriptions.create({
      data: {
        ...data,
        is_active: true,
      },
      include: {
        membership_plans: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user_subscriptions.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        membership_plans: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.user_subscriptions.findFirst({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      include: {
        membership_plans: true,
      },
    });
  }

  async findActiveByUserId(userId: string) {
    return this.prisma.user_subscriptions.findFirst({
      where: {
        user_id: userId,
        is_active: true,
        deleted_at: null,
      },
      include: {
        membership_plans: true,
      },
    });
  }

  async findByOrderCode(orderCode: string) {
    return this.prisma.user_subscriptions.findFirst({
      where: {  
        order_code: orderCode,
        payment_status: 'PENDING',
        created_at: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        membership_plans: true,
      },
    });
  }

  async update(id: string, data: Prisma.user_subscriptionsUpdateInput) {
    return this.prisma.user_subscriptions.update({
      where: { id },
      data,
      include: {
        membership_plans: true,
      },
    });
  }


} 
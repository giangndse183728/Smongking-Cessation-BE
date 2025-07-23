import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { SubscriptionRepository } from './subscription.repository';
import { plainToInstance } from 'class-transformer';
import { PayOsService } from '@libs/payment/payos.service';
import { PrismaService } from '@libs/prisma/prisma.service';
import { PaymentLinkResponse } from '@libs/payment/payment.types';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '@modules/users/users.service';
import { MembershipPlanService } from '@modules/membership-plan/membership-plan.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private payOsService: PayOsService,
    private prisma: PrismaService,
    private usersService: UsersService,
    private membershipPlanService: MembershipPlanService,
  ) {}


  async findOne(id: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return plainToInstance(SubscriptionResponseDto, subscription, {
      excludeExtraneousValues: true,
    });
  }

  async findByUserId(userId: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findByUserId(userId);
    if (!subscription) {
      throw new NotFoundException('User subscription not found');
    }

    return plainToInstance(SubscriptionResponseDto, subscription, {
      excludeExtraneousValues: true,
    });
  }

  async createPayment(userId: string, planId: string): Promise<PaymentLinkResponse> {
    try {
    
      const pendingSubscription = await this.prisma.user_subscriptions.findFirst({
        where: {
          user_id: userId,
          payment_status: 'PENDING',
          is_active: true,
          deleted_at: null,
        },
      });
      if (pendingSubscription) {
        
        const plan = await this.prisma.membership_plans.findUnique({
          where: { id: pendingSubscription.plan_id },
        });
        if (!plan) {
          throw new NotFoundException('Membership plan not found for pending subscription');
        }
        const paymentData = {
          orderCode: Number(pendingSubscription.order_code),
          amount: Math.round(Number(plan.price) * 100),
          description: `${plan.name}`,
          returnUrl: `${process.env.FRONTEND_URL}/payment/success`,
          cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`,
          callbackUrl: `${process.env.BACKEND_URL}/subscriptions/payment/callback`,
        };
        const paymentLink = await this.payOsService.createPaymentLink(paymentData);
        return paymentLink;
      }

      const existingSubscription = await this.subscriptionRepository.findActiveByUserId(userId);

      const latestPaidSubscription = await this.prisma.user_subscriptions.findFirst({
        where: {
          user_id: userId,
          payment_status: 'PAID',
          deleted_at: null,
        },
        orderBy: { end_date: 'desc' },
      });

      let startDate = new Date();
      if (latestPaidSubscription && latestPaidSubscription.end_date) {
        const now = new Date();
        const paidEnd = new Date(latestPaidSubscription.end_date);
        startDate = paidEnd > now ? paidEnd : now;
      } else if (existingSubscription && existingSubscription.end_date) {
        const now = new Date();
        const currentEnd = new Date(existingSubscription.end_date);
        startDate = currentEnd > now ? currentEnd : now;
      }

      const plan = await this.prisma.membership_plans.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        throw new NotFoundException('Membership plan not found');
      }

      if (!plan.is_active) {
        throw new BadRequestException('This membership plan is not active');
      }

      const orderCode = Number(Date.now().toString().slice(-9));
      const paymentData = {
        orderCode,
        amount: Math.round(Number(plan.price) * 100), 
        description: `${plan.name}`,
        returnUrl: `${process.env.FRONTEND_URL}/payment/success`,
        cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`,
        callbackUrl: `${process.env.BACKEND_URL}/subscriptions/payment/callback`, 
      };

      await this.subscriptionRepository.create({
        user_id: userId,
        plan_id: planId,
        start_date: startDate,
        end_date: new Date(startDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000),
        payment_status: 'PENDING',
        order_code: orderCode.toString(),
      });

      const paymentLink = await this.payOsService.createPaymentLink(paymentData);
      return paymentLink;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create payment. Please try again later.'
      );
    }
  }

  async handlePaymentCallback(orderCode: number, status: string, checksum: string) {
    try {
      const isValid = await this.payOsService.verifyPayment({
        orderCode,
        status,
        checksum,
      });

      if (!isValid) {
        throw new BadRequestException('Payment verification failed');
      }

      const subscription = await this.subscriptionRepository.findByOrderCode(orderCode.toString());

      if (!subscription) {
        throw new NotFoundException('Pending subscription not found');
      }

      await this.subscriptionRepository.update(subscription.id, {
        payment_status: 'PAID',
        is_active: true,
      });

      
      await this.prisma.users.update({
        where: { id: subscription.user_id },
        data: {
          isMember: true,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Payment callback error:', error);
      throw error;
    }
  }

  async getAllSubscriptionsByUser(userId: string) {
    const allSubscriptions = await this.prisma.user_subscriptions.findMany({
      where: {
        user_id: userId,
        is_active: true,
        deleted_at: null,
      },
      orderBy: { created_at: 'desc' },
    });

    const now = new Date();
    const current = allSubscriptions.find(sub =>
      sub.payment_status === 'PAID' &&
      sub.is_active === true &&
      new Date(sub.start_date) <= now &&
      new Date(sub.end_date) >= now
    );
    const queries = allSubscriptions.filter(sub => sub !== current);

    const upcoming = queries.filter(sub => new Date(sub.start_date) > now);
    const expired = queries.filter(sub => new Date(sub.end_date) < now && sub.payment_status === 'PAID');

    async function enrich(sub) {
      const membership_plan = await this.membershipPlanService.findOne(sub.plan_id);
      return { ...sub, membership_plan };
    }

    return {
      current: current ? await enrich.call(this, current) : null,
      upcoming: await Promise.all(upcoming.map(sub => enrich.call(this, sub))),
      expired: await Promise.all(expired.map(sub => enrich.call(this, sub))),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deactivateExpiredSubscriptions() {
    const now = new Date();

    const expiredSubscriptions = await this.prisma.user_subscriptions.findMany({
      where: {
        end_date: { lt: now },
        is_active: true,
        deleted_at: null,
      },
    });
    for (const sub of expiredSubscriptions) {
      await this.subscriptionRepository.update(sub.id, { is_active: false });
      await this.usersService.update(sub.user_id, { isMember: false });
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredPendingSubscriptions() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const expiredPendings = await this.prisma.user_subscriptions.findMany({
      where: {
        payment_status: 'PENDING',
        created_at: { lt: fiveMinutesAgo },
        deleted_at: null,
      },
    });
    for (const sub of expiredPendings) {
      await this.prisma.user_subscriptions.delete({ where: { id: sub.id } });
    }
  }
} 
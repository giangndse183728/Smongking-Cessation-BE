import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { SubscriptionRepository } from './subscription.repository';
import { plainToInstance } from 'class-transformer';
import { PayOsService } from '@libs/payment/payos.service';
import { PrismaService } from '@libs/prisma/prisma.service';
import { PaymentLinkResponse } from '@libs/payment/payment.types';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '@modules/users/users.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private payOsService: PayOsService,
    private prisma: PrismaService,
    private usersService: UsersService, // Inject UsersService
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
      const existingSubscription = await this.subscriptionRepository.findActiveByUserId(userId);

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

      let startDate = new Date();
      if (existingSubscription && existingSubscription.end_date) {
        const now = new Date();
        const currentEnd = new Date(existingSubscription.end_date);
        startDate = currentEnd > now ? currentEnd : now;
      }
      const endDate = new Date(startDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000);

      await this.subscriptionRepository.create({
        user_id: userId,
        plan_id: planId,
        start_date: startDate,
        end_date: endDate,
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
} 
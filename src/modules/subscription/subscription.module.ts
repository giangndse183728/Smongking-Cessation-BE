import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { PayOsService } from '@libs/payment/payos.service';
import { PrismaService } from '@libs/prisma/prisma.service';
import { PrismaModule } from '@libs/prisma/prisma.module';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersService } from '@modules/users/users.service';
import { MembershipPlanService } from '@modules/membership-plan/membership-plan.service';
import { MembershipPlanModule } from '@modules/membership-plan/membership-plan.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, MembershipPlanModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository, PayOsService, PrismaService, UsersService, MembershipPlanService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {} 
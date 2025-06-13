import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { PayOsService } from '@libs/payment/payos.service';
import { PrismaService } from '@libs/prisma/prisma.service';
import { PrismaModule } from '@libs/prisma/prisma.module';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository, PayOsService, PrismaService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {} 
import { Module } from '@nestjs/common';
import { MembershipPlanController } from './membership-plan.controller';
import { MembershipPlanService } from './membership-plan.service';
import { MembershipPlanRepository } from './membership-plan.repository';
import { PrismaModule } from '@libs/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { AccessTokenStrategy } from '@modules/auth/strategies/access-token.strategy';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule],
  controllers: [MembershipPlanController],
  providers: [
    MembershipPlanService, 
    MembershipPlanRepository,
    AccessTokenStrategy,
  ],
  exports: [MembershipPlanService, MembershipPlanRepository],
})
export class MembershipPlanModule {} 
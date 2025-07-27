import { Module } from '@nestjs/common';
import { MotivationService } from './motivation.service';
import { MotivationController } from './motivation.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisService } from '@libs/redis/redis.service';
import { AIService } from '../../libs/ai/ai.service';
import { AuthModule } from '@modules/auth/auth.module';
import { PrismaService } from '@libs/prisma/prisma.service';
import { SmokingHabitsRepository } from '@modules/smoking-habits/smoking-habits.repository';
import { QuitPlanRepository } from '@modules/quit-plan/quit-plan.repository';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  controllers: [MotivationController],
  providers: [
    MotivationService, 
    RedisService, 
    AIService, 
    PrismaService,
    SmokingHabitsRepository,
    QuitPlanRepository,
  ],
  exports: [MotivationService],
})
export class MotivationModule {}

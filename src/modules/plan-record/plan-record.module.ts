import { Module } from '@nestjs/common';
import { PlanRecordController } from './plan-record.controller';
import { PlanRecordService } from './plan-record.service';
import { QuitPlanRecordRepository } from './plan-record.repository';
import { QuitPlanRepository } from '../quit-plan/quit-plan.repository';
import { PrismaService } from '@libs/prisma/prisma.service';
import { SmokingHabitsModule } from '../smoking-habits/smoking-habits.module';
import { UserAchievementModule } from '@modules/user-achievement/user-achievement.module';
import { AchievementsModule } from '@modules/achievements/achievements.module';

@Module({
  imports: [SmokingHabitsModule, UserAchievementModule, AchievementsModule],
  controllers: [PlanRecordController],
  providers: [
    PlanRecordService,
    QuitPlanRecordRepository,
    QuitPlanRepository,
    PrismaService,
  ],
  exports: [PlanRecordService],
})
export class PlanRecordModule {}

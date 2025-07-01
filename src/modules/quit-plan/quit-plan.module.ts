import { Module } from '@nestjs/common';
import { QuitPlanController } from './quit-plan.controller';
import { QuitPlanService } from './quit-plan.service';
import { QuitPlanRepository } from './quit-plan.repository';
import { PrismaModule } from '@libs/prisma/prisma.module';
import { AIService } from '@libs/ai/ai.service';
import { AccessTokenStrategy } from '@modules/auth/strategies/access-token.strategy';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { PlanRecordModule } from '@modules/plan-record/plan-record.module';
import { QuitPlanRecordRepository } from '@modules/plan-record/plan-record.repository';
import { SmokingHabitsModule } from '@modules/smoking-habits/smoking-habits.module';
import { AchievementsModule } from '@modules/achievements/achievements.module';
import { UserAchievementModule } from '@modules/user-achievement/user-achievement.module';


@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PlanRecordModule,
    SmokingHabitsModule,
    AchievementsModule,
    UserAchievementModule,
  ],
  controllers: [QuitPlanController],
  providers: [
    QuitPlanService,
    QuitPlanRepository,
    QuitPlanRecordRepository,
    AIService,
    AccessTokenStrategy,
  ],
  exports: [QuitPlanService],
})
export class QuitPlanModule {}

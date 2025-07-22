import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { UserAchievementModule } from '@modules/user-achievement/user-achievement.module';
import { UsersModule } from '@modules/users/users.module';
import { LeaderboardsRepository } from './leaderboard.repository';
import { QuitPlanModule } from '@modules/quit-plan/quit-plan.module';
import { AchievementsModule } from '@modules/achievements/achievements.module';
import { PlanRecordModule } from '@modules/plan-record/plan-record.module';
import { PostsModule } from '@modules/posts/posts.module';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService, LeaderboardsRepository],
  imports: [
    UserAchievementModule,
    UsersModule,
    QuitPlanModule,
    UserAchievementModule,
    AchievementsModule,
    PlanRecordModule,
    PostsModule,
  ],
})
export class LeaderboardModule {}

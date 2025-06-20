import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { UserAchievementModule } from '@modules/user-achievement/user-achievement.module';
import { UsersModule } from '@modules/users/users.module';
import { LeaderboardsRepository } from './leaderboard.repository';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService, LeaderboardsRepository],
  imports: [UserAchievementModule, UsersModule],
})
export class LeaderboardModule {}

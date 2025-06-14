import { Module } from '@nestjs/common';
import { UserAchievementController } from './user-achievement.controller';
import { UserAchievementService } from './user-achievement.service';
import { UserAchievementsRepository } from './user-achievement.repository';

@Module({
  controllers: [UserAchievementController],
  exports: [UserAchievementService, UserAchievementsRepository],
  providers: [UserAchievementService, UserAchievementsRepository],
})
export class UserAchievementModule {}

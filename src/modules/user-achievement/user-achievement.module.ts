import { Module } from '@nestjs/common';
import { UserAchievementController } from './user-achievement.controller';
import { UserAchievementService } from './user-achievement.service';
import { UserAchievementsRepository } from './user-achievement.repository';
import { AchievementsModule } from '@modules/achievements/achievements.module';
import { PlanRecordModule } from '@modules/plan-record/plan-record.module';
import { UsersModule } from '@modules/users/users.module';
import { PostsModule } from '@modules/posts/posts.module';

@Module({
  controllers: [UserAchievementController],
  exports: [UserAchievementService, UserAchievementsRepository],
  providers: [UserAchievementService, UserAchievementsRepository],
  imports: [AchievementsModule, PlanRecordModule, UsersModule, PostsModule],
})
export class UserAchievementModule {}

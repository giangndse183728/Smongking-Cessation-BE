import { Module } from '@nestjs/common';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { AchievementRepository } from './achievement.repository';

@Module({
  controllers: [AchievementsController],
  providers: [AchievementsService, AchievementRepository],
  exports: [AchievementsService],
})
export class AchievementsModule {}

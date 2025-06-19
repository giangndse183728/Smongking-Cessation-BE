import { Injectable } from '@nestjs/common';
import { AddUserAchievementDto } from './dto/add-user-achievement.dto';
import { UserAchievementsRepository } from './user-achievement.repository';

@Injectable()
export class UserAchievementService {
  constructor(private userAchievementsRepository: UserAchievementsRepository) {}

  async addUserAchievement(data: AddUserAchievementDto, user_id: string) {
    const userAchievement =
      await this.userAchievementsRepository.addNewUserAchievement(
        data,
        user_id,
      );
    return userAchievement;
  }
  async getUserAchievement(user_achievement_id: string, user_id: string) {
    const userAchievement =
      await this.userAchievementsRepository.getUserAchievement(
        user_achievement_id,
        user_id,
      );
    return userAchievement;
  }

  async getUserAchievements(user_id: string) {
    const userAchievement =
      await this.userAchievementsRepository.getUserAchievements(user_id);
    return userAchievement;
  }
}

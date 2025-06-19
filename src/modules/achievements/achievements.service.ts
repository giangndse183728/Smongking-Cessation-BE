import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { AchievementRepository } from './achievement.repository';
import { achievements } from '@prisma/client';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { ACHIEVEMENTS_MESSAGES } from '@common/constants/messages';

@Injectable()
export class AchievementsService {
  constructor(private achievementRepository: AchievementRepository) {}

  async createAchievement(
    payload: CreateAchievementDto,
    user_id: string,
  ): Promise<achievements> {
    const achievement = await this.achievementRepository.createAchievement(
      payload,
      user_id,
    );
    return achievement;
  }

  async updateAchievement(
    achievement_id: string,
    payload: UpdateAchievementDto,
    user_id: string,
  ): Promise<achievements> {
    const existingAchievement =
      await this.achievementRepository.getAchievement(achievement_id);
    if (!existingAchievement) {
      throw new NotFoundException(ACHIEVEMENTS_MESSAGES.ACHIEVEMENT_NOT_FOUND);
    }
    const achievement = await this.achievementRepository.updateAchievement(
      achievement_id,
      payload,
      user_id,
    );
    return achievement;
  }

  async deleteAchievement(achievement_id: string, user_id: string) {
    const existingAchievement =
      await this.achievementRepository.getAchievement(achievement_id);
    if (!existingAchievement) {
      throw new NotFoundException(ACHIEVEMENTS_MESSAGES.ACHIEVEMENT_NOT_FOUND);
    }
    const achievement = await this.achievementRepository.deleteAchievement(
      achievement_id,
      user_id,
    );
    return achievement;
  }

  async getAchievement(achievement_id: string) {
    const existingAchievement =
      await this.achievementRepository.getAchievement(achievement_id);
    if (!existingAchievement) {
      throw new NotFoundException(ACHIEVEMENTS_MESSAGES.ACHIEVEMENT_NOT_FOUND);
    }
    return existingAchievement;
  }

  async getAchievements() {
    const achievements = await this.achievementRepository.getAchievements();
    return achievements;
  }
}

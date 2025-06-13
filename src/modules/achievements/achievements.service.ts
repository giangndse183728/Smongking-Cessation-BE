import { Injectable } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { AchievementRepository } from './achievement.repository';
import { achievements } from '@prisma/client';

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
}

import { PrismaService } from '@libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AddUserAchievementDto } from './dto/add-user-achievement.dto';
import { user_achievements } from '@prisma/client';

@Injectable()
export class UserAchievementsRepository {
  constructor(private prisma: PrismaService) {}
  async addNewUserAchievement(
    data: AddUserAchievementDto,
    user_id: string,
  ): Promise<user_achievements> {
    return await this.prisma.user_achievements.create({
      data: {
        user_id,
        achievement_id: data.achievement_id,
        created_at: new Date(),
        created_by: user_id,
        updated_at: new Date(),
        updated_by: user_id,
      },
    });
  }
  async getUserAchievements(user_id: string) {
    const userAchievements = await this.prisma.user_achievements.findMany({
      where: {
        user_id,
        deleted_at: null,
        deleted_by: null,
      },
      include: {
        achievements: {
          select: {
            achievement_type: true,
            threshold_value: true,
          },
        },
      },
    });

    return userAchievements.map(({ achievements, ...rest }) => ({
      ...rest,
      achievement_type: achievements.achievement_type,
      threshold_value: achievements.threshold_value,
    }));
  }

  async getUserAchievement(
    achievement_id: string,
    user_id: string,
  ): Promise<user_achievements | null> {
    return await this.prisma.user_achievements.findUnique({
      where: {
        id: achievement_id,
        user_id: user_id,
      },
    });
  }
}

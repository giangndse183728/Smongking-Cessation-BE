import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@Injectable()
export class AchievementRepository {
  constructor(private prisma: PrismaService) {}
  async createAchievement(payload: CreateAchievementDto, user_id: string) {
    const achievement = await this.prisma.achievements.create({
      data: { ...payload, created_by: user_id, updated_by: user_id },
    });
    return achievement;
  }

  async getAchievement(id: string) {
    return await this.prisma.achievements.findUnique({
      where: {
        id,
        deleted_at: null,
        deleted_by: null,
      },
    });
  }

  async updateAchievement(
    achievement_id: string,
    payload: UpdateAchievementDto,
    user_id: string,
  ) {
    const achievement = await this.prisma.achievements.update({
      data: { ...payload, updated_at: new Date(), updated_by: user_id },
      where: {
        id: achievement_id,
        deleted_at: null,
        deleted_by: null,
      },
    });
    return achievement;
  }

  async deleteAchievement(achievement_id: string, user_id: string) {
    const inUseAchievement = await this.prisma.user_achievements.findMany({
      where: {
        achievement_id,
        deleted_at: null,
        deleted_by: null,
      },
    });

    if (inUseAchievement.length > 0) {
      throw new BadRequestException('Achievement is in use.');
    }

    const achievement = await this.prisma.achievements.update({
      where: {
        id: achievement_id,
      },
      data: {
        deleted_at: new Date(),
        deleted_by: user_id,
      },
    });

    return achievement;
  }

  async getAchievements() {
    return await this.prisma.achievements.findMany({
      where: {
        deleted_at: null,
        deleted_by: null,
      },
    });
  }
}

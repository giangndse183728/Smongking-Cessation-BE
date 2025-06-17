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
        ...data,
        user_id,
        created_at: new Date(),
        created_by: user_id,
        updated_at: new Date(),
        updated_by: user_id,
      },
    });
  }
  async getUserAchievements(user_id: string): Promise<user_achievements[]> {
    return await this.prisma.user_achievements.findMany({
      where: {
        user_id,

        created_at: new Date(),
        created_by: user_id,
        updated_at: new Date(),
        updated_by: user_id,
      },
    });
  }
}

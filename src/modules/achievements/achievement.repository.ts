import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';

@Injectable()
export class AchievementRepository {
  constructor(private prisma: PrismaService) {}
  async createAchievement(payload: CreateAchievementDto, user_id: string) {
    const achievement = await this.prisma.achievements.create({
      data: { ...payload, created_by: user_id, updated_by: user_id },
    });
    return achievement;
  }
}

import { PrismaService } from '@libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaderboardsRepository {
  constructor(private prisma: PrismaService) {}
  async rankLeaderboard(
    data: { user_id: string; score: number; rank: number },
    type: string,
  ) {
    await this.prisma.leaderboard.upsert({
      where: {
        user_id_achievement_type: {
          user_id: data.user_id,
          achievement_type: type,
        },
      },
      update: {
        score: data.score,
        rank: data.rank,
        updated_at: new Date(),
      },
      create: {
        user_id: data.user_id,
        created_by: 'system',
        achievement_type: type,
        score: data.score,
        rank: data.rank,
      },
    });
  }

  async getLeaderboard() {
    const leaderboards = await this.prisma.leaderboard.findMany({
      where: {
        deleted_at: null,
        deleted_by: null,
      },
    });
    const grouped: Record<string, typeof leaderboards> = {};

    for (const item of leaderboards) {
      if (!grouped[item.achievement_type]) {
        grouped[item.achievement_type] = [];
      }
      grouped[item.achievement_type].push(item);
    }

    return grouped;
  }
}

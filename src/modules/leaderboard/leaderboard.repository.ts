import { PrismaService } from '@libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaderboardsRepository {
  constructor(private prisma: PrismaService) {}
  async rankLeaderboard(
    data: { user_id: string; score: number; rank: number; value: number },
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
        value: data.value,
      },
      create: {
        user_id: data.user_id,
        created_by: 'system',
        achievement_type: type,
        score: data.score,
        rank: data.rank,
        value: data.value,
      },
    });
  }

  async getLeaderboard() {
    const leaderboards = await this.prisma.leaderboard.findMany({
      where: {
        deleted_at: null,
        deleted_by: null,
      },
      include: {
        users: true,
      },
    });

    const result = leaderboards.map((item) => {
      const { users, ...rest } = item;
      const { last_name, first_name, avatar, username } = users;
      return {
        ...rest,
        last_name,
        first_name,
        avatar,
        username,
      };
    });
    const grouped: Record<string, typeof result> = {};

    for (const item of result) {
      if (!grouped[item.achievement_type]) {
        grouped[item.achievement_type] = [];
      }
      grouped[item.achievement_type].push(item);
    }

    return grouped;
  }
}

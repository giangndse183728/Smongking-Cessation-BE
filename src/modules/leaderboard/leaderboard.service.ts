import { UserAchievementService } from '@modules/user-achievement/user-achievement.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LeaderboardsRepository } from './leaderboard.repository';
import { achievement_type } from '@common/constants/enum';

@Injectable()
export class LeaderboardService {
  constructor(
    private userAchievementService: UserAchievementService,
    private leaderboardsRepository: LeaderboardsRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async calculateLeaderboard() {
    console.log('Cronjob: Checking leaderboard.');
    const ALLOWED_TYPES = [
      achievement_type.COMMUNITY_SUPPORT,
      achievement_type.RELAPSE_FREE_STREAK,
      achievement_type.MONEY_SAVED,
      'total_score',
    ];
    const achievements =
      await this.userAchievementService.getUserAchievements();

    const filteredAchievements = achievements.filter((a) =>
      ALLOWED_TYPES.includes(a.achievement_type),
    );
    const scoreMap = new Map<
      string,
      { user_id: string; type: string; score: number }
    >();
    for (const row of filteredAchievements) {
      const type = row.achievement_type;
      const key = `${row.user_id}-${type}`;
      const prev = scoreMap.get(key);
      if (prev) {
        prev.score += row.points_earned ?? 0;
      } else {
        scoreMap.set(key, {
          user_id: row.user_id,
          type,
          score: Number(row.points_earned),
        });
      }
    }
    const grouped = new Map<string, { user_id: string; score: number }[]>();
    for (const { user_id, type, score } of scoreMap.values()) {
      if (!grouped.has(type)) grouped.set(type, []);
      grouped.get(type)!.push({ user_id, score });
    }

    // bảng leaderboard:tổng điểm cao nhất
    const totalScores = new Map<string, number>();
    for (const { user_id, score } of scoreMap.values()) {
      const prev = totalScores.get(user_id) ?? 0;
      totalScores.set(user_id, prev + score);
    }
    const totalEntries = Array.from(totalScores.entries()).map(
      ([user_id, score]) => ({ user_id, score }),
    );
    const sortedTotal = totalEntries.sort((a, b) => b.score - a.score);

    for (let i = 0; i < sortedTotal.length; i++) {
      await this.leaderboardsRepository.rankLeaderboard(
        {
          ...sortedTotal[i],
          rank: i + 1,
        },
        'total_score',
      );
    }

    // các bảng theo achievement type
    for (const [type, entries] of grouped.entries()) {
      const sorted = entries.sort((a, b) => b.score - a.score);
      for (let i = 0; i < sorted.length; i++) {
        await this.leaderboardsRepository.rankLeaderboard(
          {
            ...sorted[i],
            rank: i + 1,
          },
          type,
        );
      }
    }
    console.log('Done checking leaderboard.');
  }

  async getLeaderBoards() {
    return this.leaderboardsRepository.getLeaderboard();
  }
}

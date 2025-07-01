import { UserAchievementService } from '@modules/user-achievement/user-achievement.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LeaderboardsRepository } from './leaderboard.repository';

@Injectable()
export class LeaderboardService {
  constructor(
    private userAchievementService: UserAchievementService,
    private leaderboardsRepository: LeaderboardsRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async calculateLeaderboard(user_id: string) {
    console.log('Cronjob: Checking leaderboard.');
    const achievements =
      await this.userAchievementService.getUserAchievements(user_id);

    const scoreMap = new Map<
      string,
      { user_id: string; type: string; score: number }
    >();
    for (const row of achievements) {
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

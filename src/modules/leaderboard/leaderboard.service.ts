import { UserAchievementService } from '@modules/user-achievement/user-achievement.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LeaderboardsRepository } from './leaderboard.repository';
import { achievement_type, POST_STATUS } from '@common/constants/enum';
import { QuitPlanRecordRepository } from '@modules/plan-record/plan-record.repository';
import { AchievementsService } from '@modules/achievements/achievements.service';
import { UsersService } from '@modules/users/users.service';
import { PostsService } from '@modules/posts/posts.service';

@Injectable()
export class LeaderboardService {
  constructor(
    private userAchievementService: UserAchievementService,
    private achievementsService: AchievementsService,
    private quitPlanRecordRepository: QuitPlanRecordRepository,
    private usersService: UsersService,
    private postsService: PostsService,
    private leaderboardsRepository: LeaderboardsRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async calculateLeaderboard() {
    console.log('Cronjob: Checking leaderboard.');

    const ALLOWED_TYPES = [
      achievement_type.COMMUNITY_SUPPORT,
      achievement_type.RELAPSE_FREE_STREAK,
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
    const users = await this.usersService.findAll();
    const valueMapByUser: Map<string, Map<string, number>> = new Map();

    for (const user of users) {
      const map = await this.countValueForLeaderboard(user.id);
      if (!valueMapByUser.has(user.id)) {
        valueMapByUser.set(user.id, new Map());
      }
      for (const [achievementType, totalValue] of map.entries()) {
        valueMapByUser.get(user.id)!.set(achievementType, totalValue);
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
          value: 0,
        },
        'total_score',
      );
    }

    // các bảng theo achievement type
    for (const [type, sorted] of grouped.entries()) {
      sorted.sort((a, b) => b.score - a.score);
      for (let i = 0; i < sorted.length; i++) {
        const { user_id } = sorted[i];
        const value = valueMapByUser.get(user_id)?.get(type) ?? 0;
        await this.leaderboardsRepository.rankLeaderboard(
          {
            ...sorted[i],
            rank: i + 1,
            value,
          },
          type,
        );
      }
    }

    console.log('Done checking leaderboard.');
  }

  async countValueForLeaderboard(userId: string): Promise<Map<string, number>> {
    const valueMap = new Map<string, number>();

    const records =
      await this.quitPlanRecordRepository.getRecordsByUserId(userId);

    // Relapse-free streak
    let streak = 0;
    let previousDate: Date | null = null;
    const sortedRecords = [...records].sort(
      (a, b) =>
        new Date(b.record_date).getTime() - new Date(a.record_date).getTime(),
    );

    for (const record of sortedRecords) {
      const currentDate = new Date(record.record_date);
      if (!record.is_pass) break;

      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      if (previousDate) {
        const diff = previousDate.getTime() - currentDate.getTime();
        if (diff !== ONE_DAY_MS) break;
      }

      streak++;
      previousDate = currentDate;
    }
    valueMap.set(achievement_type.RELAPSE_FREE_STREAK, streak);

    // Abstinence days
    const abstinenceDays = records.filter(
      (record) =>
        !record.cigarette_smoke || Number(record.cigarette_smoke) === 0,
    ).length;
    valueMap.set(achievement_type.ABSTINENCE_DAYS, abstinenceDays);

    // Community support
    const posts = await this.postsService.getOwnPosts(
      userId,
      POST_STATUS.APPROVED,
    );
    valueMap.set(achievement_type.COMMUNITY_SUPPORT, posts.length);

    return valueMap;
  }

  async getLeaderBoards() {
    return this.leaderboardsRepository.getLeaderboard();
  }
}

import { Injectable } from '@nestjs/common';
import { AddUserAchievementDto } from './dto/add-user-achievement.dto';
import { UserAchievementsRepository } from './user-achievement.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AchievementsService } from '@modules/achievements/achievements.service';
import { QuitPlanRecordRepository } from '@modules/plan-record/plan-record.repository';
import { quit_plan_records } from '@prisma/client';
import { UsersService } from '@modules/users/users.service';
import { PostsService } from '@modules/posts/posts.service';
import { POST_STATUS } from '@common/constants/enum';

@Injectable()
export class UserAchievementService {
  constructor(
    private userAchievementsRepository: UserAchievementsRepository,
    private achievementsService: AchievementsService,
    private quitPlanRecordRepository: QuitPlanRecordRepository,
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  async addUserAchievement(data: AddUserAchievementDto, user_id: string) {
    const userAchievement =
      await this.userAchievementsRepository.addNewUserAchievement(
        data,
        user_id,
      );
    return userAchievement;
  }
  async getUserAchievement(user_achievement_id: string, user_id: string) {
    const userAchievement =
      await this.userAchievementsRepository.getUserAchievement(
        user_achievement_id,
        user_id,
      );
    return userAchievement;
  }

  async getUserAchievements(user_id: string) {
    const userAchievement =
      await this.userAchievementsRepository.getUserAchievements(user_id);
    return userAchievement;
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkAndGrantAchievementsForAllUsers() {
    console.log('Cronjob: Checking achievements for all users');

    const users = await this.usersService.findAll();
    for (const user of users) {
      await this.checkAndGrantAchievementsForUser(user.id);
    }

    console.log('Done checking achievements for all users.');
  }
  async checkAndGrantAchievementsForUser(userId: string) {
    console.log('check and grand achievement');
    const [allAchievements, userAchievements, records] = await Promise.all([
      this.achievementsService.getAchievements(), // Lấy tất cả thành tích
      this.userAchievementsRepository.getUserAchievements(userId), // Thành tích đã có
      this.quitPlanRecordRepository.getRecordsByUserId(userId), // quit plan record
    ]);

    // Tạo set  kiểm tra achievement user đã đạt theo achivement type & threshold value
    const achievedKeySet = new Set(
      userAchievements.map(
        (ua) => `${ua.achievement_type}_${ua.threshold_value.toString()}`,
      ),
    );

    for (const achievement of allAchievements) {
      const { achievement_type, threshold_value } = achievement;
      const key = `${achievement_type}_${threshold_value.toString()}`;
      if (achievedKeySet.has(key)) continue; // user đã có thành tích này

      let isMet = false;

      switch (achievement_type) {
        case 'money_saved': {
          const totalSaved = records.reduce(
            (sum: number, r: quit_plan_records) => {
              const moneySaved = r.money_saved ? Number(r.money_saved) : 0;
              return sum + moneySaved;
            },
            0,
          );

          isMet = totalSaved >= Number(threshold_value);
          break;
        }

        case 'relapse_free_streak': {
          let streak = 0;

          for (const record of records) {
            if (
              !record.cigarette_smoke ||
              Number(record.cigarette_smoke) === 0
            ) {
              streak++;
            } else {
              break;
            }
          }

          isMet = streak >= Number(threshold_value);
          break;
        }

        case 'abstinence_days': {
          const abstinenceDays = records.filter(
            (record) =>
              !record.cigarette_smoke || Number(record.cigarette_smoke) === 0,
          ).length;

          isMet = abstinenceDays >= Number(threshold_value);
          break;
        }
        case 'community_support': {
          const posts = await this.postsService.getOwnPosts(
            userId,
            POST_STATUS.APPROVED,
          );
          isMet = posts.length >= Number(threshold_value);
          break;
        }
      }

      if (isMet) {
        await this.userAchievementsRepository.addNewUserAchievement(
          {
            achievement_id: achievement.id,
            points_earned: achievement.point as number,
          },
          userId,
        );
      }
    }
  }
}

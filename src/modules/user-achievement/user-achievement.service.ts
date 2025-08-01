import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddUserAchievementDto } from './dto/add-user-achievement.dto';
import { UserAchievementsRepository } from './user-achievement.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AchievementsService } from '@modules/achievements/achievements.service';
import { QuitPlanRecordRepository } from '@modules/plan-record/plan-record.repository';
import { quit_plan_records } from '@prisma/client';
import { UsersService } from '@modules/users/users.service';
import { PostsService } from '@modules/posts/posts.service';
import { POST_STATUS } from '@common/constants/enum';
import { AUTH_MESSAGES, POSTS_MESSAGES } from '@common/constants/messages';

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

  async getUserAchievements(user_id?: string) {
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
          let previousDate: Date | null = null;

          const sortedRecords = [...records].sort(
            (a, b) =>
              new Date(b.record_date).getTime() -
              new Date(a.record_date).getTime(),
          );

          for (const record of sortedRecords) {
            const currentDate = new Date(record.record_date);

            if (!record.is_pass) {
              break;
            }

            const ONE_DAY_MS = 24 * 60 * 60 * 1000;

            if (previousDate) {
              const diff = previousDate.getTime() - currentDate.getTime();
              if (diff !== ONE_DAY_MS) {
                break;
              }
            }

            streak++;
            previousDate = currentDate;
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

  async getAchievementProgressStatus(userId: string, id: string) {
    const existingUser = await this.usersService.findOne(userId);
    if (!existingUser) {
      throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
    }
    if (userId !== id) {
      throw new BadRequestException(POSTS_MESSAGES.USER_NOT_ALLOWED);
    }
    const [allAchievements, records] = await Promise.all([
      this.achievementsService.getAchievements(), // Lấy tất cả thành tích
      this.quitPlanRecordRepository.getRecordsByUserId(userId), // quit plan record
    ]);

    return Promise.all(
      allAchievements.map(async (achievement) => {
        const { achievement_type, threshold_value } = achievement;

        switch (achievement_type) {
          case 'money_saved': {
            const totalSaved = records.reduce(
              (sum: number, r: quit_plan_records) => {
                const moneySaved = r.money_saved ? Number(r.money_saved) : 0;
                return sum + moneySaved;
              },
              0,
            );

            return {
              ...achievement,
              progressValue: totalSaved,
              isMet: totalSaved >= Number(threshold_value),
            };
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

            return {
              ...achievement,
              progressValue: streak,
              isMet: streak >= Number(threshold_value),
            };
          }

          case 'abstinence_days': {
            const abstinenceDays = records.filter(
              (record) =>
                !record.cigarette_smoke || Number(record.cigarette_smoke) === 0,
            ).length;
            return {
              ...achievement,
              progressValue: abstinenceDays,
              isMet: abstinenceDays >= Number(threshold_value),
            };
          }
          case 'community_support': {
            const posts = await this.postsService.getOwnPosts(
              userId,
              POST_STATUS.APPROVED,
            );
            return {
              ...achievement,
              progressValue: posts.length,
              isMet: posts.length >= Number(threshold_value),
            };
          }
        }
      }),
    );
  }
}

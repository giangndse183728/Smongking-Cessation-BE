import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { QuitPlanRecord } from './entities/quit-plan-record.entity';
import { Prisma } from '@prisma/client';
import { AchievementsService } from '@modules/achievements/achievements.service';
import { achievement_type } from '@common/constants/enum';
import { UserAchievementService } from '@modules/user-achievement/user-achievement.service';

@Injectable()
export class QuitPlanRecordRepository {
  constructor(
    private prisma: PrismaService,
    private achievementsService: AchievementsService,
    private userAchievementsService: UserAchievementService,
  ) {}

  async create(data: Partial<QuitPlanRecord>): Promise<QuitPlanRecord> {
    const dataForPrisma: Prisma.quit_plan_recordsCreateInput = {
      ...(data as Prisma.quit_plan_recordsCreateInput),
      created_at: new Date(),
      created_by: data.user_id,
    };
    const result = await this.prisma.quit_plan_records.create({
      data: dataForPrisma,
    });
    // step tracking user achievement type: RELAPSE_FREE_STREAK
    const existingAchievements =
      await this.achievementsService.getAchievements();

    const relapseFreeAchievements = existingAchievements.filter(
      (item) => item.achievement_type === achievement_type.RELAPSE_FREE_STREAK,
    );

    if (relapseFreeAchievements.length > 0) {
      const recentRecords = await this.findAllByPlan(
        data.plan_id as string,
        data.user_id as string,
      );

      // Đếm streak liên tiếp
      let streakCount = 0;
      for (const record of recentRecords) {
        if (record.cigarette_smoke === 0) {
          streakCount++;
        } else {
          break;
        }
      }

      for (const achievement of relapseFreeAchievements) {
        if (streakCount >= Number(achievement.threshold_value)) {
          await this.userAchievementsService.addUserAchievement(
            {
              achievement_id: achievement.id,
              earned_date: new Date().toISOString(),
            },
            data.user_id as string,
          );
        }
      }
    }

    return new QuitPlanRecord(result);
  }

  async findTodayRecord(
    userId: string,
    planId: string,
    phaseId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<QuitPlanRecord | null> {
    const result = await this.prisma.quit_plan_records.findFirst({
      where: {
        user_id: userId,
        plan_id: planId,
        phase_id: phaseId,
        record_date: { gte: startDate, lte: endDate },
        deleted_at: null,
      },
    });
    return result ? new QuitPlanRecord(result) : null;
  }

  async findByPlanAndPhase(
    planId: string,
    phaseId: string,
    userId: string,
  ): Promise<QuitPlanRecord[]> {
    const results = await this.prisma.quit_plan_records.findMany({
      where: {
        plan_id: planId,
        phase_id: phaseId,
        user_id: userId,
        deleted_at: null,
      },
      orderBy: { record_date: 'desc' },
    });
    return results.map((result) => new QuitPlanRecord(result));
  }

  async findAllByPlan(
    planId: string,
    userId: string,
  ): Promise<QuitPlanRecord[]> {
    const results = await this.prisma.quit_plan_records.findMany({
      where: {
        plan_id: planId,
        user_id: userId,
        deleted_at: null,
      },
      orderBy: { record_date: 'desc' },
    });
    return results.map((result) => new QuitPlanRecord(result));
  }

  async update(
    id: string,
    data: Partial<QuitPlanRecord>,
  ): Promise<QuitPlanRecord> {
    const result = await this.prisma.quit_plan_records.update({
      where: { id, deleted_at: null, deleted_by: null },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
    const existingAchievements =
      await this.achievementsService.getAchievements();

    const relapseFreeAchievements = existingAchievements.filter(
      (item) => item.achievement_type === achievement_type.RELAPSE_FREE_STREAK,
    );
    if (relapseFreeAchievements.length > 0) {
      const recentRecords = await this.findAllByPlan(
        data.plan_id as string,
        data.updated_by as string,
      );
      // Đếm streak liên tiếp
      let streakCount = 0;
      for (const record of recentRecords) {
        if (record.cigarette_smoke === 0) {
          streakCount++;
        } else {
          break;
        }
      }
      for (const achievement of relapseFreeAchievements) {
        if (streakCount >= Number(achievement.threshold_value)) {
          await this.userAchievementsService.addUserAchievement(
            {
              achievement_id: achievement.id,
              earned_date: new Date().toISOString(),
            },
            data.updated_by as string,
          );
        }
      }
    }
    return new QuitPlanRecord(result);
  }

  async softDelete(id: string): Promise<QuitPlanRecord> {
    const result = await this.prisma.quit_plan_records.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return new QuitPlanRecord(result);
  }
}

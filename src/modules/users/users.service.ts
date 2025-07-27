import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.schema';
import { UserRole } from '@common/constants/enum';
import { Prisma, user_achievements } from '@prisma/client';
import { UpdateMeDto } from './dto/update-user.schema';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany({
      where: {
        deleted_at: null,
        deleted_by: null,
      },
    });
  }

  async findOne(id: string) {
    const activePlan = await this.prisma.quit_plans.findFirst({
      where: {
        user_id: id,
        status: 'ACTIVE',
        deleted_at: null,
      },
    });
    const user = await this.prisma.users.findFirst({
      where: {
        id,
        deleted_at: null,
        deleted_by: null,
      },
      omit: { password: true },
      include: {
        user_achievements: {
          include: {
            achievements: true,
          },
        },
        smoking_habits: true,
        quit_plans: {
          where: {
            status: 'ACTIVE',
            deleted_at: null,
            deleted_by: null,
          },
        },
        quit_plan_records: {
          where: {
            plan_id: activePlan?.id,
            deleted_at: null,
            deleted_by: null,
          },
        },
      },
    });

    if (!user) return null;

    // get ra streak day pass
    let streak = 0;
    let previousDate: Date | null = null;

    const sortedRecords = [...user.quit_plan_records].sort(
      (a, b) =>
        new Date(b.record_date).getTime() - new Date(a.record_date).getTime(),
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

    // get ra total score của user từ user achievement
    let point: number = 0;
    const customUserAchievements = user.user_achievements.map(
      (
        user_achievements: user_achievements & {
          achievements: { name: string; image_url: string };
        },
      ) => {
        point += user_achievements?.points_earned ?? 0;
        return {
          id: user_achievements.id,
          name: user_achievements.achievements.name,
          earned_date: user_achievements.earned_date,
          thumbnail: user_achievements.achievements.image_url,
          point: user_achievements.points_earned,
        };
      },
    );
    // get ra rank trên leaderboard
    const userRank = await this.prisma.leaderboard.findMany({
      where: {
        deleted_at: null,
        deleted_by: null,
        user_id: id,
      },
    });

    const { quit_plans, quit_plan_records, smoking_habits, ...rest } = user;
    const leaderboard = userRank.map((item) => ({
      rank: item.rank || 0,
      rank_type: item.achievement_type || '',
    }));
    return {
      ...rest,
      user_achievements: customUserAchievements,
      streak,
      point,
      leaderboard,
    };
  }

  async findByUsername(username: string) {
    return this.prisma.users.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserDto) {
    return this.prisma.users.create({
      data: {
        ...data,
        role: data.role || UserRole.USER,
      },
    });
  }

  async checkDuplicateFields(
    userId: string,
    updateDto: Record<string, any>,
    fieldsToCheck: string[],
  ): Promise<void> {
    const orConditions = fieldsToCheck.map((field) => ({
      [field]: updateDto[field] as unknown,
    }));

    const conflicts = await this.prisma.users.findMany({
      where: {
        AND: [{ id: { not: userId } }, { OR: orConditions }],
      },
    });

    const errors: Record<string, string> = {};
    for (const conflict of conflicts) {
      for (const field of fieldsToCheck) {
        if (conflict[field] === updateDto[field]) {
          errors[field] = `${field} already exists`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors,
      });
    }
  }

  async getUser(filter: Prisma.usersWhereUniqueInput) {
    return await this.prisma.users.findUnique({
      where: filter,
    });
  }

  async update(id: string, data: UpdateMeDto) {
    return await this.prisma.users.update({
      where: { id, deleted_at: null, deleted_by: null },
      data: {
        ...data,
        dob: data.dob ? new Date(data.dob) : null,
        updated_at: new Date(),
        updated_by: id,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.users.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}

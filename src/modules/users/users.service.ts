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
        quit_plans: true,
      },
    });

    if (!user) return null;

    const customUserAchievements = user.user_achievements.map(
      (
        user_achievements: user_achievements & {
          achievements: { name: string; image_url: string };
        },
      ) => ({
        id: user_achievements.id,
        name: user_achievements.achievements.name,
        earned_date: user_achievements.earned_date,
        thumbnail: user_achievements.achievements.image_url,
      }),
    );

    const { ...rest } = user;

    return {
      ...rest,
      user_achievements: customUserAchievements,
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

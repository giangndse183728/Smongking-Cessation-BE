import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { CoachEntity } from './entities/coach.entity';
import { CreateCoachProfileType } from './schemas/create-coach-profile.schema';

@Injectable()
export class CoachRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCoach(
    data: CreateCoachProfileType,
  ): Promise<CoachEntity> {
    const coach = await this.prisma.coaches.create({
      data: {
        users: { connect: { id: data.user_id } },
        specialization: data.specialization,
        experience_years: data.experience_years,
        bio: data.bio,
        working_hours: data.working_hours,
      },
      include: {
        users: true,
      },
    });
    return new CoachEntity(coach);
  }

  async findAllCoaches() {
    const coaches = await this.prisma.coaches.findMany({
      include: {
        users: true,
      },
      where: {
        is_active: true,
      },
    });
    return coaches;
  }

  async getCoachProfile(userId: string) {
    const coach = await this.prisma.coaches.findFirst({
      where: {
        user_id: userId,
        is_active: true,
      },
    });
    return coach;
  }

  async updateCoach(coachId: string, data: Partial<Omit<CreateCoachProfileType, 'user_id'>>): Promise<CoachEntity> {
    const coach = await this.prisma.coaches.update({
      where: { id: coachId },
      data: {
        specialization: data.specialization,
        experience_years: data.experience_years,
        bio: data.bio,
        working_hours: data.working_hours,
      },
      include: {
        users: true,
      },
    });
    return new CoachEntity(coach);
  }

  async findActiveCoachByUserId(userId: string) {
    return this.prisma.coaches.findFirst({ where: { user_id: userId, is_active: true } });
  }
}

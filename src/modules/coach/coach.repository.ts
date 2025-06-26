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
}

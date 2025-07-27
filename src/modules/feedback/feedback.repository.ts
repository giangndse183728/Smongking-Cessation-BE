import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { AddFeedbackDto } from './dto/add-feedback.dto';

@Injectable()
export class FeedbackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addOrUpdateFeedback(body: AddFeedbackDto, userId: string) {
    // Upsert feedback: if exists (user_id + coach_id), update; else create
    return await this.prisma.feedbacks.upsert({
      where: {
        user_id_ref_type_ref_id: {
          user_id: userId,
          ref_type: 'coach',
          ref_id: body.coach_id,
        },
      },
      update: {
        rating_star: body.rating_star,
        comment: body.comment,
        updated_by: userId,
      },
      create: {
        user_id: userId,
        ref_type: 'coach',
        ref_id: body.coach_id,
        rating_star: body.rating_star,
        comment: body.comment,
        created_by: userId,
        updated_by: userId,
      },
    });
  }

  async getCoachFeedback(coachId: string) {
    return await this.prisma.feedbacks.findMany({
      where: {
        ref_type: 'coach',
        ref_id: coachId,
        deleted_at: null,
        deleted_by: null,
      },
      include: {
        users: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  async getFeedbacksForCoaches(coachIds: string[]) {
    const result = await this.prisma.feedbacks.findMany({
      where: {
        ref_type: 'coach',
        ref_id: { in: coachIds },
        deleted_at: null,
        deleted_by: null,
      },
      include: {
        users: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    
    return result;
  }

  async deleteFeedback(feedbackId: string, adminId: string) {
    return await this.prisma.feedbacks.update({
      where: { id: feedbackId },
      data: {
        deleted_at: new Date(),
        deleted_by: adminId,
      },
    });
  }
} 
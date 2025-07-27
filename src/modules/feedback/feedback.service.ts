import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { AddFeedbackDto } from './dto/add-feedback.dto';
import { plainToInstance } from 'class-transformer';
import { FeedbackResponseDto } from './dto/feedback-response.dto';
import { Expose } from 'class-transformer';
import { ChatService } from '@modules/chat/chat.service';

// Patch: Add ref_id to FeedbackResponseDto for internal grouping
(FeedbackResponseDto as any).prototype.ref_id = undefined;
Expose()(FeedbackResponseDto.prototype, 'ref_id');

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly chatService: ChatService,
  ) {}

  async addOrUpdateFeedback(body: AddFeedbackDto, userId: string) {
    const chatLineCount = await this.chatService.getChatLineCountBetweenUserAndCoach(userId, body.coach_id);
    if (chatLineCount < 10) {
      throw new BadRequestException('You must have at least 10 chat messages with this coach before leaving feedback. Please continue the conversation.');
    }
    const feedback = await this.feedbackRepository.addOrUpdateFeedback(body, userId);
    return {
      message: 'Feedback added or updated successfully',
      data: plainToInstance(FeedbackResponseDto, feedback, { excludeExtraneousValues: true }),
    };
  }

  async getCoachFeedback(coachId: string) {
    const feedbacks = await this.feedbackRepository.getCoachFeedback(coachId);
    if (!feedbacks || feedbacks.length === 0) {
      throw new NotFoundException('No feedback found for this coach');
    }
    return {
      message: 'Feedback retrieved successfully',
      data: plainToInstance(FeedbackResponseDto, feedbacks, { excludeExtraneousValues: true }),
    };
  }

  async getFeedbacksForCoaches(coachIds: string[]): Promise<any[]> {
    return this.feedbackRepository.getFeedbacksForCoaches(coachIds);
  }

  async deleteFeedback(feedbackId: string, adminId: string) {
    return this.feedbackRepository.deleteFeedback(feedbackId, adminId);
  }
} 
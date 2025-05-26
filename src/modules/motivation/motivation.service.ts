import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MotivationResponseDto } from './dto/motivation-response.dto';
import { RedisService } from '@libs/redis/redis.service';
import { AIService } from '../../libs/ai/ai.service';
import { ChatResponseDto } from './dto/chat-message.dto';
import { MOTIVATION_MESSAGES } from '@common/constants/messages';

@Injectable()
export class MotivationService {
  private readonly logger = new Logger(MotivationService.name);
  private readonly redisKey = 'current_motivation';

  constructor(
    private readonly redisService: RedisService,
    private readonly aiService: AIService,
  ) {}

  @Cron('0 */2 * * *')
  async updateMotivationalMessage() {
    try {
      const message = await this.aiService.generateMotivationalMessage();
      await this.redisService.set(this.redisKey, message, 2 * 60 * 60);
      this.logger.log('Successfully updated motivational message');
    } catch (error) {
      this.logger.error(MOTIVATION_MESSAGES.FAILED_TO_UPDATE_MESSAGE, error.message);
    }
  }

  async getCurrentMotivationalMessage(): Promise<MotivationResponseDto> {
    try {
      let message = await this.redisService.get(this.redisKey);
      
      if (!message) {
        this.logger.log('No message in cache, generating new message');
        message = await this.aiService.generateMotivationalMessage();
        await this.redisService.set(this.redisKey, message, 2 * 60 * 60);
      }
      
      return { message };
    } catch (error) {
      this.logger.error(MOTIVATION_MESSAGES.FAILED_TO_RETRIEVE_MESSAGE, error);
      return { message: MOTIVATION_MESSAGES.FALLBACK_MESSAGE };
    }
  }

  async chatWithAI(userMessage: string): Promise<ChatResponseDto> {
    try {
      const response = await this.aiService.generateChatResponse(userMessage);
      return { message: response };
    } catch (error) {
      this.logger.error('Failed to generate chat response', error.message);
      return {
        message: MOTIVATION_MESSAGES.CHAT_RESPONSE_ERROR,
      };
    }
  }
}

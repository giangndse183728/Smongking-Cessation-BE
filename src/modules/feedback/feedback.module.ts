import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackRepository } from './feedback.repository';
import { AuthModule } from '@modules/auth/auth.module';
import { PrismaModule } from '@libs/prisma/prisma.module';
import { ChatModule } from '@modules/chat/chat.module';

@Module({
  imports: [AuthModule, PrismaModule, ChatModule],
  providers: [FeedbackService, FeedbackRepository],
  controllers: [FeedbackController],
  exports: [FeedbackService],
})
export class FeedbackModule {} 
import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackRepository } from './feedback.repository';
import { AuthModule } from '@modules/auth/auth.module';
import { PrismaModule } from '@libs/prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [FeedbackService, FeedbackRepository],
  controllers: [FeedbackController],
  exports: [FeedbackService],
})
export class FeedbackModule {} 
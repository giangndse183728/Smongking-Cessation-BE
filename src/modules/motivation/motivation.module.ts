import { Module } from '@nestjs/common';
import { MotivationService } from './motivation.service';
import { MotivationController } from './motivation.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisService } from '@libs/redis/redis.service';
import { AIService } from '../../libs/ai/ai.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [MotivationController],
  providers: [MotivationService, RedisService, AIService],
  exports: [MotivationService],
})
export class MotivationModule {} 
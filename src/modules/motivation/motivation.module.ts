import { Module } from '@nestjs/common';
import { MotivationService } from './motivation.service';
import { MotivationController } from './motivation.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisService } from '@libs/redis/redis.service';
import { AIService } from '../../libs/ai/ai.service';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  controllers: [MotivationController],
  providers: [MotivationService, RedisService, AIService],
  exports: [MotivationService],
})
export class MotivationModule {}

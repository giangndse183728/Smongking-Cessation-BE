import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { NotificationGateway } from './notification.gateway';
import { RedisService } from '@libs/redis/redis.service';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    NotificationGateway,
    RedisService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}

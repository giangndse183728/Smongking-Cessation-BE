import { Module } from '@nestjs/common';
import { NotificationSchedulesController } from './notification-schedules.controller';
import { NotificationSchedulesService } from './notification-schedules.service';
import { NotificationScheduleRepository } from './notification-schedules.repository';
import { RedisModule } from '@libs/redis/redis.module';
import { UsersModule } from '@modules/users/users.module';
import { PlanRecordModule } from '@modules/plan-record/plan-record.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { MotivationModule } from '@modules/motivation/motivation.module';

@Module({
  controllers: [NotificationSchedulesController],
  providers: [NotificationSchedulesService, NotificationScheduleRepository],
  imports: [
    RedisModule,
    UsersModule,
    PlanRecordModule,
    PlanRecordModule,
    NotificationsModule,
    MotivationModule,
  ],
})
export class NotificationSchedulesModule {}

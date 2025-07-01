import { Module } from '@nestjs/common';
import { NotificationSchedulesController } from './notification-schedules.controller';
import { NotificationSchedulesService } from './notification-schedules.service';
import { NotificationScheduleRepository } from './notification-schedules.repository';

@Module({
  controllers: [NotificationSchedulesController],
  providers: [NotificationSchedulesService, NotificationScheduleRepository],
})
export class NotificationSchedulesModule {}

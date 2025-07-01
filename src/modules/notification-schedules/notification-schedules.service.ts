import { Injectable } from '@nestjs/common';
import { addNotificationScheduleDto } from './schema/add-notification-schedule.schema';
import { NotificationScheduleRepository } from './notification-schedules.repository';

@Injectable()
export class NotificationSchedulesService {
  constructor(
    private readonly notificationScheduleRepository: NotificationScheduleRepository,
  ) {}
  async addNotificationSchedule(
    user_id: string,
    payload: addNotificationScheduleDto,
  ) {
    return await this.notificationScheduleRepository.addNotificationSchedule(
      user_id,
      payload,
    );
  }
}

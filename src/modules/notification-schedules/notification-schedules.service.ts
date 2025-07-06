import { Injectable } from '@nestjs/common';
import { NotificationScheduleRepository } from './notification-schedules.repository';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '@modules/users/users.service';
import { QuitPlanRecordRepository } from '@modules/plan-record/plan-record.repository';
import { addNotificationScheduleDto } from './dto/add-notification-schedule.dto';
import { NotificationSchedule } from './dto/notification-schedule-responses.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class NotificationSchedulesService {
  constructor(
    private readonly notificationScheduleRepository: NotificationScheduleRepository,
    private readonly usersService: UsersService,
    private readonly quitPlanRecordRepository: QuitPlanRecordRepository,
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

  // gửi noti reminder
  @Cron('* * * * *')
  async handleScheduledNotifications() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const scheduleReminders =
      await this.notificationScheduleRepository.getNotificationBySchedule();
    for (const schedule of scheduleReminders) {
      if (!schedule.preferred_time) {
        continue;
      }
      const hour = schedule.preferred_time.getUTCHours();
      const minute = schedule.preferred_time.getUTCMinutes();

      const user = await this.usersService.getUser({ id: schedule.user_id });
      const records = await this.quitPlanRecordRepository.getRecordsByUserId(
        user!.id,
      );

      let streak = 0;
      let previousDate: Date | null = null;

      const sortedRecords = [...records].sort(
        (a, b) =>
          new Date(b.record_date).getTime() - new Date(a.record_date).getTime(),
      );

      for (const record of sortedRecords) {
        const currentDate = new Date(record.record_date);

        if (!record.is_pass) {
          break;
        }
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        if (previousDate) {
          const diff = previousDate.getTime() - currentDate.getTime();
          if (diff !== ONE_DAY_MS) {
            break;
          }
        }

        streak++;
        previousDate = currentDate;
        if (hour === currentHour && minute === currentMinute) {
          const msg = `Great job! You've maintained your cigarette limit streak for ${streak} days in a row. Stay strong, and don’t forget to fill in today’s record!`;
          return msg;
        }
      }
    }
  }
  async getOwnNotificationSchedule(user_id: string) {
    const noti =
      await this.notificationScheduleRepository.getOwnNotificationSchedule(
        user_id,
      );
    return plainToInstance(NotificationSchedule, noti, {
      excludeExtraneousValues: true,
    });
  }
}

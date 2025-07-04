import { PrismaService } from '@libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { addNotificationScheduleDto } from './schema/add-notification-schedule.schema';
import { parseTimeStringToDate } from '@common/utils/datetime';

@Injectable()
export class NotificationScheduleRepository {
  constructor(private prisma: PrismaService) {}
  async addNotificationSchedule(
    user_id: string,
    body: addNotificationScheduleDto,
  ) {
    return await this.prisma.notification_schedules.create({
      data: {
        ...body,
        preferred_time: parseTimeStringToDate(body.preferred_time),
        user_id,
        created_by: user_id,
        updated_by: user_id,
      },
    });
  }
}

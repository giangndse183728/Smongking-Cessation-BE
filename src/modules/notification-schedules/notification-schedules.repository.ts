import { PrismaService } from '@libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { parseTimeStringToDate } from '@common/utils/datetime';
import { addNotificationScheduleDto } from './dto/add-notification-schedule.dto';

@Injectable()
export class NotificationScheduleRepository {
  constructor(private prisma: PrismaService) {}
  async addNotificationSchedule(
    user_id: string,
    body: addNotificationScheduleDto,
  ) {
    const existingSchedule = await this.prisma.notification_schedules.findFirst(
      {
        where: {
          user_id,
          deleted_at: null,
          deleted_by: null,
        },
      },
    );
    if (!existingSchedule) {
      return await this.prisma.notification_schedules.create({
        data: {
          ...body,
          preferred_time: parseTimeStringToDate(body.preferred_time),
          user_id,
          created_by: user_id,
          updated_by: user_id,
        },
      });
    } else {
      return await this.prisma.notification_schedules.update({
        where: {
          id: existingSchedule.id,
          user_id,
          deleted_at: null,
          deleted_by: null,
        },
        data: {
          ...body,
          preferred_time: parseTimeStringToDate(body.preferred_time),
        },
      });
    }
  }
  async getNotificationBySchedule() {
    return await this.prisma.notification_schedules.findMany({
      where: { deleted_at: null, deleted_by: null },
    });
  }
  async getOwnNotificationSchedule(user_id: string) {
    const noti = await this.prisma.notification_schedules.findFirst({
      where: { user_id, deleted_at: null, deleted_by: null },
    });
    return noti;
  }
}

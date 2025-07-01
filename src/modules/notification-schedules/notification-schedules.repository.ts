import { PrismaService } from '@libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { addNotificationScheduleDto } from './schema/add-notification-schedule.schema';

@Injectable()
export class NotificationScheduleRepository {
  constructor(private prisma: PrismaService) {}
  async addNotificationSchedule(
    user_id: string,
    body: addNotificationScheduleDto,
  ) {
    await this.prisma.notification_schedules.create({
      data: {
        ...body,
        user_id,
        created_by: user_id,
        updated_by: user_id,
      },
    });
  }
}

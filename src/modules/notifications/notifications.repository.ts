import { PrismaService } from '@libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { createNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsRepository {
  constructor(private prisma: PrismaService) {}
  async createNotification(
    payload: createNotificationDto,
    user_id: string,
    created_by: string,
  ) {
    const notification = await this.prisma.notifications.create({
      data: {
        ...payload,
        user_id,
        created_by: created_by,
        updated_by: created_by,
      },
    });
    return notification;
  }
  async getNotifications(user_id: string) {
    return await this.prisma.notifications.findMany({
      where: {
        user_id,
        deleted_at: null,
        deleted_by: null,
      },
    });
  }
}

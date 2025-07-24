import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { createNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private notificationsRepository: NotificationsRepository) {}
  async createNotification(
    payload: createNotificationDto,
    user_id: string,
    created_by: string,
  ) {
    return await this.notificationsRepository.createNotification(
      payload,
      user_id,
      created_by,
    );
  }
  async getNotifications(userId: string) {
    return this.notificationsRepository.getNotifications(userId);
  }
}

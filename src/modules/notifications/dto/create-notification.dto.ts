import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { createNotificationsSchema } from '../schema/create-notification.schema';

export class createNotificationDto extends createZodDto(
  createNotificationsSchema,
) {
  @ApiProperty({
    example: 'REMINDER',
    description: 'Type of notification',
  })
  type: string;
  @ApiProperty({
    example: 'Time to log your progress!',
    description: 'Notification Title',
  })
  title: string;
  @ApiProperty({
    example:
      "You've stayed within your cigarette limit for 3 consecutive days. Keep it up and don't forget to record today's data!",
    description: 'notification message',
  })
  content: string;
}

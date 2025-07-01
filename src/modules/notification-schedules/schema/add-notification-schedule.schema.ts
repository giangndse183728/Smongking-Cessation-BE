import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { addNotificationScheduleSchema } from '../dto/add-notification-schedule.dto';

export class addNotificationScheduleDto extends createZodDto(
  addNotificationScheduleSchema,
) {
  @ApiProperty({
    example: 'reminder',
    description: 'Type of notification schedule',
  })
  type: string;
  @ApiProperty({
    example: 'daily',
    description: 'Frequency of notification schedule',
  })
  frequency: string;
  @ApiProperty({
    example: '05:00',
    description: 'Time of notification schedule',
  })
  preferred_time: string;
}

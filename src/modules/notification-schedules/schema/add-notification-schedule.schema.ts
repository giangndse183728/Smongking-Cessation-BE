import { z } from 'zod';
import { NOTIFICATION_SCHEDULES_MESSAGES } from '@common/constants/messages';
import {
  notification_schedule_reference_type,
  notification_schedule_type,
} from '@common/constants/enum';

export const addNotificationScheduleSchema = z.object({
  type: z
    .string({
      invalid_type_error: NOTIFICATION_SCHEDULES_MESSAGES.TYPE_IS_INVALID,
      required_error: NOTIFICATION_SCHEDULES_MESSAGES.TYPE_IS_REQUIRED,
    })
    .refine(
      (value: string) =>
        Object.values(notification_schedule_type).includes(value),
      {
        message: NOTIFICATION_SCHEDULES_MESSAGES.TYPE_IS_INVALID,
      },
    ),
  frequency: z
    .string({
      required_error: NOTIFICATION_SCHEDULES_MESSAGES.FREQUENCY_IS_REQUIRED,
      invalid_type_error: NOTIFICATION_SCHEDULES_MESSAGES.FREQUENCY_IS_INVALID,
    })
    .refine(
      (value: string) =>
        Object.values(notification_schedule_reference_type).includes(value),
      {
        message: NOTIFICATION_SCHEDULES_MESSAGES.FREQUENCY_IS_INVALID,
      },
    ),
  preferred_time: z
    .string({
      required_error:
        NOTIFICATION_SCHEDULES_MESSAGES.PREFERRED_TIME_IS_REQUIRED,
    })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: NOTIFICATION_SCHEDULES_MESSAGES.PREFERRED_TIME_IS_INVALID,
    }),
});

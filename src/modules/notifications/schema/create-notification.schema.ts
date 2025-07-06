import { z } from 'zod';
import { NOTIFICATION_MESSAGES } from '@common/constants/messages';
import { notification_type } from '@common/constants/enum';

export const createNotificationsSchema = z.object({
  title: z.string({
    invalid_type_error: NOTIFICATION_MESSAGES.TITLE_IS_REQUIRED,
    required_error: NOTIFICATION_MESSAGES.TITLE_MUST_BE_STRING,
  }),
  content: z.string({
    required_error: NOTIFICATION_MESSAGES.CONTENT_IS_REQUIRED,
    invalid_type_error: NOTIFICATION_MESSAGES.CONTENT_MUST_BE_STRING,
  }),
  type: z
    .string({
      required_error: NOTIFICATION_MESSAGES.TYPE_IS_REQUIRED,
    })
    .refine(
      (value: string) => Object.values(notification_type).includes(value),
      {
        message: NOTIFICATION_MESSAGES.TYPE_IS_INVALID,
      },
    ),
});

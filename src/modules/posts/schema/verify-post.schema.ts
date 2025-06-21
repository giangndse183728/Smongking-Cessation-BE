import { POST_VERIFY_STATUS } from '@common/constants/enum';
import { POSTS_MESSAGES } from '@common/constants/messages';
import { z } from 'zod';

export const verifyPostSchema = z
  .object({
    status: z
      .string({
        required_error: POSTS_MESSAGES.STATUS_IS_REQUIRED,
        invalid_type_error: POSTS_MESSAGES.STATUS_IS_INVALID,
      })
      .refine((value) => Object.values(POST_VERIFY_STATUS).includes(value), {
        message: POSTS_MESSAGES.STATUS_IS_INVALID,
      }),
    reason: z
      .string({
        invalid_type_error: POSTS_MESSAGES.TITLE_MUST_BE_STRING,
      })
      .min(5, POSTS_MESSAGES.TITLE_MUST_BE_BETWEEN_5_50_CHARACTERS)
      .max(50, POSTS_MESSAGES.TITLE_MUST_BE_BETWEEN_5_50_CHARACTERS)
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.status === POST_VERIFY_STATUS.REJECTED &&
      (!data.reason || data.reason.trim() === '')
    ) {
      ctx.addIssue({
        path: ['reason'],
        code: z.ZodIssueCode.custom,
        message: POSTS_MESSAGES.REASON_IS_REQUIRED_WHEN_REJECTED,
      });
    }
  });

export type VerifyPostType = z.infer<typeof verifyPostSchema>;

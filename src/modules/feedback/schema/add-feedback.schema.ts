import { z } from 'zod';
import { FEEDBACK_MESSAGES } from '@common/constants/messages';

export const addFeedbackSchema = z.object({
  coach_id: z
    .string({
      required_error: FEEDBACK_MESSAGES.COACH_ID_IS_REQUIRED,
      invalid_type_error: FEEDBACK_MESSAGES.COACH_ID_IS_INVALID,
    })
    .uuid({ message: FEEDBACK_MESSAGES.COACH_ID_IS_INVALID }),
  rating_star: z
    .number({
      required_error: FEEDBACK_MESSAGES.RATING_STAR_IS_REQUIRED,
      invalid_type_error: FEEDBACK_MESSAGES.RATING_STAR_MUST_BE_BETWEEN_1_AND_5,
    })
    .int()
    .min(1, FEEDBACK_MESSAGES.RATING_STAR_MUST_BE_BETWEEN_1_AND_5)
    .max(5, FEEDBACK_MESSAGES.RATING_STAR_MUST_BE_BETWEEN_1_AND_5),
  comment: z.string({ invalid_type_error: FEEDBACK_MESSAGES.COMMENT_IS_STRING }),
}); 
import { z } from 'zod';
import { COMMENTS_MESSAGES } from '@common/constants/messages';

export const addCommentSchema = z.object({
  post_id: z
    .string({
      invalid_type_error: COMMENTS_MESSAGES.POST_ID_IS_INVALID,
      required_error: COMMENTS_MESSAGES.POST_ID_IS_REQUIRED,
    })
    .uuid({
      message: COMMENTS_MESSAGES.POST_ID_IS_INVALID,
    }),
  content: z.string({
    required_error: COMMENTS_MESSAGES.CONTENT_IS_REQUIRED,
    invalid_type_error: COMMENTS_MESSAGES.CONTENT_IS_INVALID,
  }),
});

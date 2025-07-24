import {
  ACHIEVEMENTS_MESSAGES,
  COMMENTS_MESSAGES,
  POSTS_MESSAGES,
} from '@common/constants/messages';
import { z } from 'zod';

export const getCommentSchema = z
  .object({
    id: z
      .string({
        required_error: COMMENTS_MESSAGES.COMMENT_ID_IS_REQUIRED,
        invalid_type_error: COMMENTS_MESSAGES.COMMENT_ID_IS_INVALID,
      })
      .uuid(COMMENTS_MESSAGES.COMMENT_ID_IS_INVALID),
  })
  .strict();

export type GetCommentType = z.infer<typeof getCommentSchema>;

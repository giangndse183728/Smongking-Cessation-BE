import { POSTS_MESSAGES } from '@common/constants/messages';
import { z } from 'zod';

export const getPostSchema = z
  .object({
    id: z
      .string({
        required_error: POSTS_MESSAGES.POST_ID_IS_REQUIRED,
        invalid_type_error: POSTS_MESSAGES.POST_ID_IS_INVALID,
      })
      .uuid(POSTS_MESSAGES.POST_ID_IS_INVALID),
  })
  .strict();

export type GetPostType = z.infer<typeof getPostSchema>;

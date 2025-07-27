import { POST_TYPE } from '@common/constants/enum';
import { POSTS_MESSAGES } from '@common/constants/messages';
import { z } from 'zod';

export const updatePostSchema = z
  .object({
    type: z
      .string({
        invalid_type_error: POSTS_MESSAGES.TYPE_IS_INVALID,
      })
      .refine(
        (value: string) => {
          return Object.values(POST_TYPE).includes(value);
        },
        {
          message: POSTS_MESSAGES.TYPE_IS_INVALID,
        },
      )
      .optional(),
    title: z
      .string({
        invalid_type_error: POSTS_MESSAGES.TITLE_MUST_BE_STRING,
      })
      .min(5, POSTS_MESSAGES.TITLE_MUST_BE_BETWEEN_5_50_CHARACTERS)
      .max(50, POSTS_MESSAGES.TITLE_MUST_BE_BETWEEN_5_50_CHARACTERS)
      .optional(),
    content: z
      .string({
        required_error: POSTS_MESSAGES.CONTENT_IS_REQUIRED,
        invalid_type_error: POSTS_MESSAGES.CONTENT_MUST_BE_STRING,
      })
      .optional(),
    thumbnail: z
      .string({
        invalid_type_error: POSTS_MESSAGES.THUMBNAIL_IS_INVALID_URL,
      })
      .url({ message: POSTS_MESSAGES.THUMBNAIL_IS_INVALID_URL })
      .optional(),
  })
  .strict();

export type UpdatePostType = z.infer<typeof updatePostSchema>;

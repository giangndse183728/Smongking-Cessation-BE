import { POST_TYPE } from '@common/constants/enum';
import { POSTS_MESSAGES } from '@common/constants/messages';
import { z } from 'zod';

export const createPostSchema = z
  .object({
    type: z
      .string({
        required_error: POSTS_MESSAGES.TYPE_IS_REQUIRED,
        invalid_type_error: POSTS_MESSAGES.TYPE_IS_INVALID,
      })
      .refine(
        (value: string) => {
          return Object.values(POST_TYPE).includes(value);
        },
        {
          message: POSTS_MESSAGES.TYPE_IS_INVALID,
        },
      ),
    title: z.string({
      required_error: POSTS_MESSAGES.TITLE_IS_REQUIRED,
      invalid_type_error: POSTS_MESSAGES.TITLE_MUST_BE_STRING,
    }),
    content: z.string({
      required_error: POSTS_MESSAGES.CONTENT_IS_REQUIRED,
      invalid_type_error: POSTS_MESSAGES.CONTENT_MUST_BE_STRING,
    }),
    thumbnail: z
      .string({
        required_error: POSTS_MESSAGES.THUMBNAIL_IS_REQUIRED,
        invalid_type_error: POSTS_MESSAGES.THUMBNAIL_IS_INVALID_URL,
      })
      .url({ message: POSTS_MESSAGES.THUMBNAIL_IS_INVALID_URL }),
  })
  .strict();

export type CreatePostType = z.infer<typeof createPostSchema>;

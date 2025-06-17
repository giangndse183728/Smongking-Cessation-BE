import {
  USER_ACHIEVEMENT_MESSAGE,
  POSTS_MESSAGES,
} from '@common/constants/messages';
import { z } from 'zod';

export const getUserAchievementSchema = z
  .object({
    id: z
      .string({
        required_error: USER_ACHIEVEMENT_MESSAGE.USER_ID_IS_REQUIRED,
        invalid_type_error: USER_ACHIEVEMENT_MESSAGE.USER_ID_IS_INVALID,
      })
      .uuid(POSTS_MESSAGES.POST_ID_IS_INVALID),
  })
  .strict();

export type GetUserAchievementType = z.infer<typeof getUserAchievementSchema>;

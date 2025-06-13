import {
  ACHIEVEMENTS_MESSAGES,
  POSTS_MESSAGES,
} from '@common/constants/messages';
import { z } from 'zod';

export const getAchievementSchema = z
  .object({
    id: z
      .string({
        required_error: ACHIEVEMENTS_MESSAGES.ACHIEVEMENT_ID_IS_REQUIRED,
        invalid_type_error: ACHIEVEMENTS_MESSAGES.ACHIEVEMENT_ID_IS_INVALID,
      })
      .uuid(POSTS_MESSAGES.POST_ID_IS_INVALID),
  })
  .strict();

export type GetAchievementType = z.infer<typeof getAchievementSchema>;

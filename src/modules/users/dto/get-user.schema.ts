import { USERS_MESSAGES } from '@common/constants/messages';
import { z } from 'zod';

export const getUserSchema = z
  .object({
    id: z
      .string({
        required_error: USERS_MESSAGES.USER_ID_IS_REQUIRED,
        invalid_type_error: USERS_MESSAGES.USER_ID_IS_INVALID,
      })
      .uuid(USERS_MESSAGES.USER_ID_IS_INVALID),
  })
  .strict();

export type getUserType = z.infer<typeof getUserSchema>;

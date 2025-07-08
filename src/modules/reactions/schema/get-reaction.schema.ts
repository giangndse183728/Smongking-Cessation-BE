import { REACTION_MESSAGES } from '@common/constants/messages';
import { z } from 'zod';

export const getReactionSchema = z
  .object({
    id: z
      .string({
        required_error: REACTION_MESSAGES.REACTION_ID_IS_REQUIRED,
        invalid_type_error: REACTION_MESSAGES.REACTION_ID_IS_INVALID,
      })
      .uuid(REACTION_MESSAGES.REACTION_ID_IS_INVALID),
  })
  .strict();

export type GetReactionType = z.infer<typeof getReactionSchema>;

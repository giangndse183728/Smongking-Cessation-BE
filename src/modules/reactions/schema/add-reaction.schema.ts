import { z } from 'zod';
import { REACTION_MESSAGES } from '@common/constants/messages';
import { reaction_type } from '@common/constants/enum';

export const addReactionSchema = z.object({
  ref_id: z
    .string({
      invalid_type_error: REACTION_MESSAGES.POST_ID_IS_INVALID,
      required_error: REACTION_MESSAGES.POST_ID_IS_REQUIRED,
    })
    .uuid(REACTION_MESSAGES.POST_ID_IS_INVALID),

  type: z
    .string({
      required_error: REACTION_MESSAGES.REACTION_TYPE_IS_REQUIRED,
    })
    .refine((value: string) => Object.values(reaction_type).includes(value), {
      message: REACTION_MESSAGES.REACTION_TYPE_IS_INVALID,
    }),
});

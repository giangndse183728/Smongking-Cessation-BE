import { signupSchema } from '@modules/auth/dto/signup.dto';
import { z } from 'zod';

export const googleUserSchema = signupSchema
  .omit({
    dob: true,
    phone_number: true,
  })
  .extend({
    avatar: z.string().url().optional(),
  });

export type GoogleUser = z.infer<typeof googleUserSchema>;

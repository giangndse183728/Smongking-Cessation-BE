import { z } from 'zod';

export const createCoachSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(6),
  phone_number: z
  .string()
  .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, {
    message: 'Invalid Vietnamese phone number format',
  }),
  code: z.string().length(6),
  specialization: z.string().optional(),
  experience_years: z.number().int().optional(),
  bio: z.string().optional(),
  working_hours: z.string().optional(),
});

export type BaseCreateCoachData = z.infer<typeof createCoachSchema>;
export type CreateCoachData = BaseCreateCoachData & { user_id: string };
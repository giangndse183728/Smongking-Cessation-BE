import { z } from 'zod';

export const createCoachProfileSchema = z.object({
  user_id: z.string(),
  specialization: z.string().optional(),
  experience_years: z.number().optional(),
  bio: z.string().optional(),
  working_hours: z.string().optional(),
});

export type CreateCoachProfileType = z.infer<typeof createCoachProfileSchema>;

export const updateCoachProfileSchema = z.object({
  specialization: z.string().optional(),
  experience_years: z.number().optional(),
  bio: z.string().optional(),
  working_hours: z.string().optional(),
});

export type UpdateCoachProfileType = z.infer<typeof updateCoachProfileSchema>; 
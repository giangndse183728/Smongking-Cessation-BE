import { z } from 'zod';

export const smokingHabitSchema = z
  .object({
    user_id: z.string(),
    cigarettes_per_pack: z.number().int().min(1),
    price_per_pack: z.number().min(0),
    cigarettes_per_day: z.number().int().min(0),
    smoking_years: z.number().int().min(0),
    triggers: z.array(z.string()),
    health_issues: z.string(),
    ai_feedback: z.string().nullable(),
  })
  .strict();

  export type SmokingHabitType = z.infer<typeof smokingHabitSchema> 
import { z } from 'zod';

export const createSmokingHabitSchema = z
  .object({
    cigarettes_per_pack: z.number().int().min(1),
    price_per_pack: z.number().min(0),
    cigarettes_per_day: z.number().int().min(0),
    smoking_years: z.number().int().min(0),
    triggers: z.array(z.string()),
    health_issues: z.string(),
  })
  .strict();

  export type CreateSmokingHabitType = z.infer<typeof createSmokingHabitSchema> 
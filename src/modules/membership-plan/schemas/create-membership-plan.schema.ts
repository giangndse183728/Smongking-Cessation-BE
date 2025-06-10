import { z } from 'zod';

export const createMembershipPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  features: z.array(z.string()),
  price: z.number().positive(),
  duration_days: z.number().int().positive(),
  is_active: z.boolean().optional().default(true),
});

export type CreateMembershipPlanType = z.infer<typeof createMembershipPlanSchema>; 
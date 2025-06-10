import { z } from 'zod';

export const updateMembershipPlanSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  price: z.number().positive().optional(),
  duration_days: z.number().int().positive().optional(),
  is_active: z.boolean().optional(),
});

export type UpdateMembershipPlanType = z.infer<typeof updateMembershipPlanSchema>; 
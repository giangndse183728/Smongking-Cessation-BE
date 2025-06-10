import { z } from 'zod';

export const createQuitPlanSchema = z.object({
  reason: z.string().min(1, { message: 'Reason is required' }),
  plan_type: z.string({
    required_error: 'Plan type is required',
    invalid_type_error: 'Plan type must be a string'
  }).refine(
    (val) => val && ['standard', 'aggressive', 'slow'].includes(val.toLowerCase()),
    { message: 'Plan type must be one of: standard, aggressive, slow' }
  ),
});

export type CreateQuitPlanType = z.infer<typeof createQuitPlanSchema> 


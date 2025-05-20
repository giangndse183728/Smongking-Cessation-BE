import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}).strict(); 

export type LoginDto = z.infer<typeof loginSchema>; 
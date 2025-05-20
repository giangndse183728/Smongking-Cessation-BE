import { z } from 'zod';
import { UserRole, Status } from '@common/constants/enum';

export const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  full_name: z.string().optional(),
  birth_date: z.date().optional(),
   phone_number: z
    .string()
    .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, {
      message: 'Invalid Vietnamese phone number format',
    }).optional(),
  last_login_at: z.date().optional(),
  profile_picture_url: z.string().url().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(Status).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>; 
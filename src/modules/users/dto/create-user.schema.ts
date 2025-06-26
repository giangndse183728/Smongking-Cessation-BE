import { z } from 'zod';
import { UserRole, Status } from '@common/constants/enum';

export const createUserSchema = z
  .object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    birth_date: z.date().optional(),
    phone_number: z
      .string()
      .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, {
        message: 'Invalid Vietnamese phone number format',
      }),
    profile_picture_url: z.string().url().optional(),
    role: z.nativeEnum(UserRole).optional(),
    status: z.nativeEnum(Status).optional(),
  })
  .strict();

export type CreateUserDto = z.infer<typeof createUserSchema>;

import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@common/constants/enum';

export const signupSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().optional(),
  birth_date: z.date().optional(),
  phone_number: z
    .string()
    .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, {
      message: 'Invalid Vietnamese phone number format',
    }),
  role: z.nativeEnum(UserRole).optional(),
}).strict();

export class SignupDto extends createZodDto(signupSchema) {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username',
  })
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
  })
  email: string;

  @ApiProperty({
    example: 'strongpassword123',
    description: 'Password',
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name',
    required: false,
  })
  full_name?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Birth date',
    required: false,
  })
  birth_date?: Date;

  @ApiProperty({
    example: '0901234567',
    description: 'Vietnamese phone number',
  })
  phone_number: string;

  @ApiProperty({
    example: 'USER',
    description: 'User role',
    enum: UserRole,
    required: false,
  })
  role?: UserRole;
} 
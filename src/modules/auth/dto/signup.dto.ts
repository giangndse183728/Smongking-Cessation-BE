import { z } from 'zod';
import { UserRole } from '@common/constants/enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupDtoSwagger {
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'strongpassword123' })
  password: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  full_name?: string;

  @ApiPropertyOptional({ example: '1990-01-01', type: 'string', format: 'date' })
  birth_date?: string;

  @ApiProperty({ example: '0901234567' })
  phone_number: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.USER })
  role?: UserRole;
}

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

export type SignupDto = z.infer<typeof signupSchema>; 
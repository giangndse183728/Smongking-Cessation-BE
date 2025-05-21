import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}).strict();

export class LoginDto extends createZodDto(loginSchema) {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  password: string;
}
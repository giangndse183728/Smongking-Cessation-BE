import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address for password reset',
  })
  email: string;
} 
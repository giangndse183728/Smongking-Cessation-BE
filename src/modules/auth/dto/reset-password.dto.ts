import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
});

export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {
  @ApiProperty({
    example: 'a_valid_reset_token',
    description: 'Password reset token',
  })
  token: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'New password',
  })
  password: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Confirm new password',
  })
  confirmPassword: string;
} 
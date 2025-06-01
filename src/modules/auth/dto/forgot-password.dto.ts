import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_MESSAGES } from '@common/constants/messages';

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      invalid_type_error: AUTH_MESSAGES.INVALID_EMAIL_FORMAT,
      required_error: AUTH_MESSAGES.EMAIL_IS_REQUIRED,
    })
    .email(AUTH_MESSAGES.INVALID_EMAIL_FORMAT),
});

export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address for password reset',
  })
  email: string;
}

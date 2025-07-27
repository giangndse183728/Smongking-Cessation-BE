import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_MESSAGES } from '@common/constants/messages';

export const resetPasswordSchema = z
  .object({
    token: z
      .string({
        required_error: AUTH_MESSAGES.RESET_TOKEN_IS_REQUIRED,
        invalid_type_error: AUTH_MESSAGES.RESET_TOKEN_IS_INVALID,
      })
      .length(64, AUTH_MESSAGES.RESET_TOKEN_IS_INVALID),
    password: z
      .string({
        required_error: AUTH_MESSAGES.PASSWORD_IS_REQUIRED,
        invalid_type_error: AUTH_MESSAGES.PASSWORD_MUST_BE_STRING,
      })
      .min(6, AUTH_MESSAGES.PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS),
    confirmPassword: z
      .string({
        required_error: AUTH_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED,
        invalid_type_error: AUTH_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRING,
      })
      .min(6, AUTH_MESSAGES.CONFIRM_PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH_PASSWORD,
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

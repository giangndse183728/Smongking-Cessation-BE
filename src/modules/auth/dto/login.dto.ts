import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_MESSAGES } from '@common/constants/messages';

export const loginSchema = z
  .object({
    email: z
      .string({
        required_error: AUTH_MESSAGES.EMAIL_IS_REQUIRED,
        invalid_type_error: AUTH_MESSAGES.INVALID_EMAIL_FORMAT,
      })
      .email(AUTH_MESSAGES.INVALID_EMAIL_FORMAT),
    password: z
      .string({
        required_error: AUTH_MESSAGES.PASSWORD_IS_REQUIRED,
        invalid_type_error:
          AUTH_MESSAGES.PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS,
      })
      .min(6, AUTH_MESSAGES.PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS),
  })
  .strict();

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

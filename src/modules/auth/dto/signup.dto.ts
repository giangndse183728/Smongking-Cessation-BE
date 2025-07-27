import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_MESSAGES } from '@common/constants/messages';

export const signupSchema = z
  .object({
    username: z
      .string({
        required_error: AUTH_MESSAGES.USERNAME_IS_REQUIRED,
        invalid_type_error: AUTH_MESSAGES.USERNAME_MUST_BE_STRING,
      })
      .min(3, AUTH_MESSAGES.USERNAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS)
      .max(50, AUTH_MESSAGES.USERNAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS),
    email: z
      .string({
        required_error: AUTH_MESSAGES.EMAIL_IS_REQUIRED,
        invalid_type_error: AUTH_MESSAGES.INVALID_EMAIL_FORMAT,
      })
      .email(AUTH_MESSAGES.INVALID_EMAIL_FORMAT),
    password: z
      .string({
        required_error: AUTH_MESSAGES.PASSWORD_IS_REQUIRED,
        invalid_type_error: AUTH_MESSAGES.PASSWORD_MUST_BE_STRING,
      })
      .min(6, AUTH_MESSAGES.PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS),
    first_name: z
      .string({
        required_error: AUTH_MESSAGES.FIRST_NAME_IS_REQUIRED,
        invalid_type_error: AUTH_MESSAGES.FIRST_NAME_MUST_BE_STRING,
      })
      .min(3, AUTH_MESSAGES.FIRST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS)
      .max(50, AUTH_MESSAGES.FIRST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS)
      .optional(),

    last_name: z
      .string({
        required_error: AUTH_MESSAGES.LAST_NAME_IS_REQUIRED,
        invalid_type_error: AUTH_MESSAGES.LAST_NAME_MUST_BE_STRING,
      })
      .min(3, AUTH_MESSAGES.LAST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS)
      .max(50, AUTH_MESSAGES.LAST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS)
      .optional(),

    dob: z
      .string({
        invalid_type_error: AUTH_MESSAGES.BIRTH_DATE_MUST_BE_VALID_FORMAT,
      })
      .refine((val: string) => !isNaN(Date.parse(val)), {
        message: AUTH_MESSAGES.BIRTH_DATE_MUST_BE_VALID_FORMAT,
      })
      .optional(),

    phone_number: z
      .string({
        required_error: AUTH_MESSAGES.PHONE_NUMBER_IS_REQUIRED,
        invalid_type_error: AUTH_MESSAGES.PHONE_NUMBER_MUST_BE_STRING,
      })
      .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, {
        message: AUTH_MESSAGES.INVALID_PHONE_NUMBER_FORMAT,
      }),
  })
  .strict();

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
    example: 'John',
    description: 'First name',
    required: false,
  })
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
    required: false,
  })
  last_name: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Birth date',
    required: false,
    type: String,
    format: 'string',
  })
  dob?: string;

  @ApiProperty({
    example: '0901234567',
    description: 'Vietnamese phone number',
  })
  phone_number: string;
}

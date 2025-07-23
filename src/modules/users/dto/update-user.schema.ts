import { z } from 'zod';
import { USERS_MESSAGES } from '@common/constants/messages';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMobilePhone, IsOptional, IsUrl } from 'class-validator';

export const updateMeSchema = z.object({
  email: z
    .string({
      invalid_type_error: USERS_MESSAGES.INVALID_EMAIL_FORMAT,
    })
    .email(USERS_MESSAGES.INVALID_EMAIL_FORMAT)
    .optional(),
  first_name: z
    .string({
      invalid_type_error: USERS_MESSAGES.FIRST_NAME_MUST_BE_STRING,
    })
    .min(3, USERS_MESSAGES.FIRST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS)
    .max(50, USERS_MESSAGES.FIRST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS)
    .optional(),

  last_name: z
    .string({
      invalid_type_error: USERS_MESSAGES.LAST_NAME_MUST_BE_STRING,
    })
    .min(3, USERS_MESSAGES.LAST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS)
    .max(50, USERS_MESSAGES.LAST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS)
    .optional(),

  dob: z
    .string({
      invalid_type_error: USERS_MESSAGES.BIRTH_DATE_MUST_BE_VALID_FORMAT,
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: USERS_MESSAGES.BIRTH_DATE_MUST_BE_VALID_FORMAT,
    })
    .optional(),

  phone_number: z
    .string({
      required_error: USERS_MESSAGES.PHONE_NUMBER_IS_REQUIRED,
      invalid_type_error: USERS_MESSAGES.PHONE_NUMBER_MUST_BE_STRING,
    })

    .regex(/^0(3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/, {
      message: USERS_MESSAGES.INVALID_PHONE_NUMBER_FORMAT,
    })
    .optional(),

  avatar: z
    .string({
      invalid_type_error: USERS_MESSAGES.AVATAR_IS_INVALID_URL,
    })
    .url({ message: USERS_MESSAGES.AVATAR_IS_INVALID_URL })
    .optional(),
});

// export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export class UpdateMeDto extends createZodDto(updateMeSchema) {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email address',
  })
  email?: string;

  @ApiPropertyOptional({
    example: 'Nguyen',
    description: 'First name, 3 to 50 characters',
    minLength: 3,
    maxLength: 50,
  })
  first_name?: string;

  @ApiPropertyOptional({
    example: 'An',
    description: 'Last name, 3 to 50 characters',
    minLength: 3,
    maxLength: 50,
  })
  last_name?: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Date of birth in valid date format',
    type: String,
    required: false,
    format: 'string',
  })
  dob?: string;

  @ApiPropertyOptional({
    example: '0936779022',
    description: 'Vietnamese phone number format',
    pattern: '/^0(3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/',
  })
  @IsMobilePhone(
    'vi-VN',
    {},
    { message: 'Số điện thoại Việt Nam không hợp lệ' },
  )
  phone_number?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'URL of the avatar image',
    format: 'uri',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Membership status',
    required: false,
  })
  isMember?: boolean;
}

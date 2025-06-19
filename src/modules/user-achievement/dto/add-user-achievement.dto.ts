import { USER_ACHIEVEMENT_MESSAGE } from '@common/constants/messages';
import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const addUserAchievementSchema = z
  .object({
    achievement_id: z
      .string({
        required_error: USER_ACHIEVEMENT_MESSAGE.ACHIEVEMENT_ID_IS_REQUIRED,
        invalid_type_error: USER_ACHIEVEMENT_MESSAGE.ACHIEVEMENT_ID_IS_INVALID,
      })
      .uuid(USER_ACHIEVEMENT_MESSAGE.ACHIEVEMENT_ID_IS_INVALID),

    earned_date: z
      .string({
        required_error: USER_ACHIEVEMENT_MESSAGE.EARNED_DATE_IS_REQUIRED,
        invalid_type_error: USER_ACHIEVEMENT_MESSAGE.EARNED_DATE_IS_INVALID,
      })
      .refine((value: string) => !isNaN(Date.parse(value)), {
        message: USER_ACHIEVEMENT_MESSAGE.EARNED_DATE_IS_INVALID,
      }),
  })
  .strict();

export type AddUserAchievementType = z.infer<typeof addUserAchievementSchema>;

export class AddUserAchievementDto extends createZodDto(
  addUserAchievementSchema,
) {
  @ApiProperty({
    description: 'Earned date',
    example: '2025-09-01',
  })
  earned_date: string;

  @ApiProperty({
    description: 'Achivement id',
    example: 'bff9cf4c-9613-4091-870e-0b1a21d01f70',
  })
  achievement_id: string;
}

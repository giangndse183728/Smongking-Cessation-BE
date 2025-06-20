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
    points_earned: z.number({
      required_error: USER_ACHIEVEMENT_MESSAGE.POINTS_EARNED_IS_REQUIRED,
      invalid_type_error: USER_ACHIEVEMENT_MESSAGE.POINTS_EARNED_MUST_BE_NUMBER,
    }),
  })

  .strict();

export type AddUserAchievementType = z.infer<typeof addUserAchievementSchema>;

export class AddUserAchievementDto extends createZodDto(
  addUserAchievementSchema,
) {
  @ApiProperty({
    description: 'Achivement id',
    example: 'bff9cf4c-9613-4091-870e-0b1a21d01f70',
  })
  achievement_id: string;
  @ApiProperty({
    description: 'Achivement point earned',
    example: 1,
  })
  points_earned: number;
}

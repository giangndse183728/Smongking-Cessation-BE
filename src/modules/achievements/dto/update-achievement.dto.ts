import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { ACHIEVEMENTS_MESSAGES } from '@common/constants/messages';
import { achievement_type } from '@common/constants/enum';

export const updateAchievementSchema = z.object({
  name: z
    .string({
      invalid_type_error: ACHIEVEMENTS_MESSAGES.ACHIEVEMENT_NAME_MUST_BE_STRING,
    })
    .optional(),
  description: z
    .string({
      invalid_type_error:
        ACHIEVEMENTS_MESSAGES.ACHIEVEMENT_DESCRIPTION_MUST_BE_STRING,
    })
    .optional(),
  image_url: z
    .string({
      invalid_type_error: ACHIEVEMENTS_MESSAGES.IMAGE_IS_INVALID_URL,
    })
    .url({ message: ACHIEVEMENTS_MESSAGES.IMAGE_IS_INVALID_URL })
    .optional(),
  achievement_type: z
    .string({
      invalid_type_error: ACHIEVEMENTS_MESSAGES.ACHIEVEMENT_TYPE_MUST_BE_STRING,
    })
    .refine(
      (value: string) => Object.values(achievement_type).includes(value),
      {
        message: ACHIEVEMENTS_MESSAGES.ACHIEVEMENT_TYPE_INVALID,
      },
    )
    .optional(),
  threshold_value: z
    .string({
      invalid_type_error: ACHIEVEMENTS_MESSAGES.THRESHOLD_MUST_BE_STRING,
    })
    .refine(
      (value: string) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0;
      },
      {
        message: ACHIEVEMENTS_MESSAGES.THRESHOLD_MUST_BE_POSITIVE,
      },
    )
    .optional(),
});

export class UpdateAchievementDto extends createZodDto(
  updateAchievementSchema,
) {
  @ApiProperty({
    example: 'No relapse for 7 days',
    description: 'Achievement name',
  })
  name?: string;
  @ApiProperty({
    example: 'You have kept a 7 day streak of no relapse.',
    description: 'Achievement description',
  })
  description?: string;
  @ApiProperty({
    example:
      'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
    description: 'Achievement thumbnail',
  })
  image_url: string;
  @ApiProperty({
    example: 'relapse_free_streak',
    description: 'Achievement type',
  })
  achievement_type?: string;
  @ApiProperty({
    example: '7',
    description: 'Achievement threshold value',
  })
  threshold_value?: string;
}

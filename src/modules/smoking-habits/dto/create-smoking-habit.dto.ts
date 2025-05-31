import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { createSmokingHabitSchema } from '../schemas/create-smoking-habit.schema';

export class CreateSmokingHabitDto extends createZodDto(
  createSmokingHabitSchema,
) {
  @ApiProperty({
    description: 'Number of cigarettes per pack',
    example: 20,
    minimum: 1,
  })
  cigarettes_per_pack: number;

  @ApiProperty({
    description: 'Price per pack',
    example: 5.99,
    minimum: 0,
  })
  price_per_pack: number;

  @ApiProperty({
    description: 'Number of cigarettes smoked per day',
    example: 10,
    minimum: 0,
  })
  cigarettes_per_day: number;

  @ApiProperty({
    description: 'Number of years smoking',
    example: 5,
    minimum: 0,
  })
  smoking_years: number;

  @ApiProperty({
    description: 'Triggers that make you want to smoke',
    example: ['Stress', 'After meals', 'Social situations'],
    type: [String],
  })
  triggers: string[];

  @ApiProperty({
    description: 'Health issues related to smoking',
    example: 'Shortness of breath, coughing',
  })
  health_issues: string;
}

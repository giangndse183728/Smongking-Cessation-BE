import { createZodDto } from "nestjs-zod";
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const createSmokingHabitSchema = z.object({
  cigarettes_per_pack: z.number().int().min(1),
  price_per_pack: z.number().min(0),
  cigarettes_per_day: z.number().int().min(0),
  smoking_years: z.number().int().min(0),
  triggers: z.array(z.string()),
  health_issues: z.string(),
  ai_feedback: z.string().optional(),
}).strict();

export class CreateSmokingHabitDto extends createZodDto(createSmokingHabitSchema) {

  @ApiProperty({
    description: 'Number of cigarettes per pack',
    example: 20,
    minimum: 1
  })
  cigarettes_per_pack: number;

  @ApiProperty({
    description: 'Price per pack',
    example: 5.99,
    minimum: 0
  })
  price_per_pack: number;

  @ApiProperty({
    description: 'Number of cigarettes smoked per day',
    example: 10,
    minimum: 0
  })
  cigarettes_per_day: number;

  @ApiProperty({
    description: 'Number of years smoking',
    example: 5,
    minimum: 0
  })
  smoking_years: number;

  @ApiProperty({
    description: 'Triggers that make you want to smoke',
    example: ['Stress', 'After meals', 'Social situations'],
    type: [String]
  })
  triggers: string[];

  @ApiProperty({
    description: 'Health issues related to smoking',
    example: 'Shortness of breath, coughing'
  })
  health_issues: string;

  @ApiProperty({
    description: 'AI-generated feedback about smoking habits',
    example: 'Consider reducing smoking during stressful situations',
    required: false
  })
  ai_feedback?: string;
} 
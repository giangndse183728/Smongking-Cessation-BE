import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { addFeedbackSchema } from '../schema/add-feedback.schema';

export class AddFeedbackDto extends createZodDto(addFeedbackSchema) {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Coach id to which the feedback is related',
  })
  coach_id: string;

  @ApiProperty({
    example: 5,
    description: 'Rating star (1-5)',
  })
  rating_star: number;

  @ApiProperty({
    example: 'Great coach, very helpful!',
    description: 'Feedback comment',
  })
  comment: string;
} 
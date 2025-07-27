import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FeedbackResponseDto } from '../../feedback/dto/feedback-response.dto';

@Exclude()
export class CoachUserResponseDto {
  @Expose()
  @ApiProperty({ description: 'User ID' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'User first name', nullable: true })
  @Transform(({ value }) => value === null ? undefined : value)
  first_name?: string;

  @Expose()
  @ApiProperty({ description: 'User last name', nullable: true })
  @Transform(({ value }) => value === null ? undefined : value)
  last_name?: string;

  @Expose()
  @ApiProperty({ description: 'Username' })
  username: string;

  @Expose()
  @ApiProperty({ description: 'Email address' })
  email: string;

  @Expose()
  @ApiProperty({ description: 'Avatar URL' })
  avatar: string;

  @Expose()
  @ApiProperty({ description: 'Phone number', nullable: true })
  @Transform(({ value }) => value === null ? undefined : value)
  phone_number?: string;

  @Expose()
  @ApiProperty({ description: 'User role' })
  role: string;

  @Expose()
  @ApiProperty({ description: 'Date of birth', nullable: true })
  @Type(() => Date)
  @Transform(({ value }) => value === null ? undefined : value)
  dob?: Date;
}

@Exclude()
export class CoachResponseDto {
  @Expose()
  @ApiProperty({ description: 'Coach ID' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'User ID' })
  user_id: string;

  @Expose()
  @ApiProperty({ description: 'Coach specialization', nullable: true })
  @Transform(({ value }) => value === null ? undefined : value)
  specialization?: string;

  @Expose()
  @ApiProperty({ description: 'Years of experience', nullable: true })
  @Transform(({ value }) => value === null ? undefined : value)
  experience_years?: number;

  @Expose()
  @ApiProperty({ description: 'Coach bio', nullable: true })
  @Transform(({ value }) => value === null ? undefined : value)
  bio?: string;

  @Expose()
  @ApiProperty({ description: 'Working hours', nullable: true })
  @Transform(({ value }) => value === null ? undefined : value)
  working_hours?: string;

  @Expose()
  @ApiProperty({ description: 'Whether coach is active', nullable: true })
  @Transform(({ value }) => value === null ? undefined : value)
  is_active?: boolean;

  @Expose()
  @ApiProperty({ description: 'User information', type: CoachUserResponseDto })
  @Type(() => CoachUserResponseDto)
  users?: CoachUserResponseDto;

  @Expose()
  @ApiProperty({
    description: 'All feedbacks for this coach',
    type: [FeedbackResponseDto],
    required: false,
  })
  @Type(() => FeedbackResponseDto)
  feedbacks?: FeedbackResponseDto[];

  @Expose()
  @ApiProperty({
    description: 'Average star for each rating 1-5',
    example: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    required: false,
  })
  averageStars?: { [key: string]: number };

  @Expose()
  @ApiProperty({
    description: 'Average rating',
    example: 0,
    required: false,
  })
  averageRating?: number;
} 
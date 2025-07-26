import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserInfoDto {
  @ApiProperty({ example: 'john_doe' })
  @Expose()
  username: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @Expose()
  avatar: string;
}

export class FeedbackResponseDto {
  @ApiProperty({ example: 4 })
  @Expose()
  rating_star: number;

  @ApiProperty({ example: 'Great coach, very helpful!' })
  @Expose()
  comment: string;

  @Expose()
  ref_id: string;

  @ApiProperty({ example: '2025-07-22T17:28:58.609Z' })
  @Expose()
  created_at: string;

  @ApiProperty({ example: '457d2421-d281-4e7b-9ffd-c83e299a53cb' })
  @Expose()
  created_by: string;

  @ApiProperty({ example: '2025-07-22T17:29:19.566Z' })
  @Expose()
  updated_at: string;

  @ApiProperty({ example: '457d2421-d281-4e7b-9ffd-c83e299a53cb' })
  @Expose()
  updated_by: string;

  @ApiProperty({ type: UserInfoDto })
  @Expose()
  users: UserInfoDto;
} 
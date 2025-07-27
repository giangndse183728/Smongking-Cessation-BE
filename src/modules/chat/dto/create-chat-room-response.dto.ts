import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateChatRoomResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  user_id: string;

  @ApiProperty()
  @Expose()
  coach_id: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  started_at: Date;
} 
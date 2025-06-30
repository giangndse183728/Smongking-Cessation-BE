import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class EndChatRoomResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  ended_at: Date;
} 
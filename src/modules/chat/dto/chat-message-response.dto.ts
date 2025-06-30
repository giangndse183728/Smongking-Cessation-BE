import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ChatMessageResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  sender_id: string;

  @ApiProperty()
  @Expose()
  sender_type: string;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  sent_at: Date;

  @ApiProperty()
  @Expose()
  is_read: boolean;
} 
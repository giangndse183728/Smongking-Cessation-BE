import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class UserDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  avatar: string;

  @ApiProperty()
  @Expose()
  email: string;
}

export class CoachChatRoomResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  started_at: Date;

  @ApiProperty()
  @Expose()
  ended_at: Date;

  @ApiProperty({ type: UserDto })
  @Expose({ name: 'users' })
  @Type(() => UserDto)
  user: UserDto;
} 
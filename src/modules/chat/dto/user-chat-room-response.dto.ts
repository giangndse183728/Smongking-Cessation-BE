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

class CoachDto {
  @ApiProperty({ type: UserDto })
  @Expose({ name: 'users' })
  @Type(() => UserDto)
  user: UserDto;
}

export class UserChatRoomResponseDto {
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

  @ApiProperty({ type: CoachDto })
  @Expose({ name: 'coaches' })
  @Type(() => CoachDto)
  coach: CoachDto;
} 
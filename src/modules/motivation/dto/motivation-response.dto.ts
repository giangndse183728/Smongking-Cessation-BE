import { ApiProperty } from '@nestjs/swagger';

export class MotivationResponseDto {
  @ApiProperty({
    description: 'The motivational message generated for the user',
    example: 'Every day without smoking is a victory! Keep going strong!',
  })
  message: string;
}

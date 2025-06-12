import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The ID of the membership plan to subscribe to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  plan_id: string;
} 
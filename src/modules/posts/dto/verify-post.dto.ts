import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { verifyPostSchema } from '../schema/verify-post.schema';

export class VerifyPostDto extends createZodDto(verifyPostSchema) {
  @ApiProperty({
    description: 'Post verify status',
    example: 'REJECTED',
  })
  status: string;

  @ApiProperty({
    description: 'Reason for verification',
    example: 'Post with irrevelant information.',
  })
  reason?: string;
}

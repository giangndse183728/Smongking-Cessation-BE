import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { getPostSchema } from '../schema/get-post.schema';

export class GetPostDto extends createZodDto(getPostSchema) {
  @ApiProperty({
    description: 'Post id',
    example: 'bff9cf4c-9613-4091-870e-0b1a21d01f70',
  })
  id: string;
}

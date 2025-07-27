import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { updatePostSchema } from '../schema/update-post.schema';

export class UpdatePostDto extends createZodDto(updatePostSchema) {
  @ApiProperty({
    description: 'Post type',
    example: 'SUCCESS_STORIES',
  })
  type?: string;

  @ApiProperty({
    description: 'Post tile',
    example: 'Be inspired from Gary stories',
  })
  title?: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is post content.',
  })
  content?: string;

  @ApiProperty({
    description: 'Post thumbnail',
    example:
      'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
  })
  thumbnail?: string;
}

import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { createPostSchema } from '@modules/posts/schema/create-post.schema';

export class CreatePostDto extends createZodDto(createPostSchema) {
  @ApiProperty({
    description: 'Post type',
    example: 'SUCCESS_STORIES',
  })
  type: string;

  @ApiProperty({
    description: 'Post tile',
    example: 'Be inspired from Gary stories',
  })
  title: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is post content.',
  })
  content: string;

  @ApiProperty({
    description: 'Post thumbnail',
    example:
      'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
  })
  thumbnail: string;
}

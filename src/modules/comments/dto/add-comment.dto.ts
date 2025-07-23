import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { addCommentSchema } from '../schema/add-comment.schema';

export class addCommentDto extends createZodDto(addCommentSchema) {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'post id to which the comment is related',
  })
  post_id: string;
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Parent comment id',
  })
  parent_comment_id?: string;
  @ApiProperty({
    example: 'great post, I really like it',
    description: 'Content of the comment',
  })
  content: string;
}

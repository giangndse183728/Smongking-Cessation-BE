import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { addCommentSchema } from './schema/add-comment.schema';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { addCommentDto } from './dto/add-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Add Comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment added successfully',
    example: {
      statusCode: 201,
      msg: 'Success!',
      data: {
        id: '872cda96-de17-483f-a162-09aff7e626d5',
        post_id: '007456f9-5d43-4346-a02b-ca83ca4c7f40',
        user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
        content: 'great post',
        created_at: '2025-07-08T05:24:49.476Z',
        created_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
        updated_at: '2025-07-08T05:24:49.476Z',
        updated_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
        deleted_at: null,
        deleted_by: null,
      },
      timestamp: '2025-07-08T05:24:49.562Z',
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      timestamp: '2025-07-08T05:26:32.023Z',
      path: '/api/v1/comments',
      message: 'Unauthorized',
      errors: [],
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
    example: {
      statusCode: 422,
      timestamp: '2025-07-08T08:48:29.636Z',
      path: '/api/v1/comments',
      message: [
        {
          path: 'content',
          message: 'Content must be a string.',
        },
      ],
      errors: [],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    example: {
      statusCode: 404,
      timestamp: '2025-07-08T08:51:53.981Z',
      path: '/api/v1/comments',
      message: 'Post not found.',
      errors: [],
    },
  })
  async addComment(
    @Body(new ZodValidationPipe(addCommentSchema)) body: addCommentDto,
    @GetCurrentUser('id') userId: string,
  ) {
    return await this.commentsService.addComment(body, userId);
  }
}

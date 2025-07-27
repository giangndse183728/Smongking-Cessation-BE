import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { addCommentSchema } from './schema/add-comment.schema';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { addCommentDto } from './dto/add-comment.dto';
import { getCommentSchema } from './schema/get-comment.schema';
import { RolesGuard } from '@common/guards/roles.guard';
import { UserRole } from '@common/constants/enum';
import { Roles } from '@common/decorators/roles.decorator';
import { users } from '@prisma/client';
import { HttpStatusCode } from 'axios';

@ApiTags('Comments')
@ApiBearerAuth('access-token')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Add/Reply Comment' })
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Parent comment id does not belong to Post',
    example: {
      statusCode: 400,
      timestamp: '2025-07-23T13:28:36.731Z',
      path: '/api/v1/comments',
      message: 'Parent comment id is invalid.',
      errors: [],
    },
  })
  async addComment(
    @Body(new ZodValidationPipe(addCommentSchema)) body: addCommentDto,
    @GetCurrentUser('id') userId: string,
  ) {
    return await this.commentsService.addComment(body, userId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Comment deleted by owner/admin' })
  @ApiResponse({
    status: HttpStatusCode.Forbidden,
    description: 'User not allowed to delete others comment',
    example: {
      statusCode: 403,
      timestamp: '2025-07-23T13:54:48.344Z',
      path: '/api/v1/comments/b1bb7ffa-0e95-4c34-811d-fc72eb869375',
      message: 'User not allowed.',
      errors: [],
    },
  })
  @ApiResponse({
    status: HttpStatusCode.Ok,
    description: 'Delete comment successfully',
    example: {
      statusCode: 200,
      msg: 'Success!',
      data: {
        id: '9592a122-4d16-44bc-914a-e8cd546716c6',
        post_id: '9ab50d02-dfb1-48e1-b425-c1ac582c542a',
        parent_comment_id: null,
        user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
        content: '3',
        created_at: '2025-07-23T08:17:37.494Z',
        created_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
        updated_at: '2025-07-23T13:56:17.306Z',
        updated_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
        deleted_at: '2025-07-23T13:56:17.304Z',
        deleted_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
      },
      timestamp: '2025-07-23T13:56:17.468Z',
    },
  })
  @ApiResponse({
    status: HttpStatusCode.NotFound,
    description: 'NotFound',
    example: {
      statusCode: 404,
      timestamp: '2025-07-23T14:03:35.681Z',
      path: '/api/v1/comments/9592a122-4d16-44bc-914a-e8cd546716c6',
      message: 'Comment not found.',
      errors: [],
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Comment id to delete',
    type: 'string',
    format: 'uuid',
    example: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
  })
  @Delete(':id')
  async deleteComment(
    @GetCurrentUser() user: users,
    @Param(new ZodValidationPipe(getCommentSchema)) params: { id: string },
  ) {
    return await this.commentsService.deleteComment(user, params.id);
  }
}

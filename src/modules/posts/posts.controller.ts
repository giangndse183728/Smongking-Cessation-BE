import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { ZodValidationPipe } from '@common/pipe/zod-validation.pipe';
import { createPostSchema } from './schema/create-post.schema';
import { CreatePostDto } from '@modules/posts/dto/create-post.dto';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { updatePostSchema } from './schema/update-post.schema';

@Controller('posts')
@ApiBearerAuth('access-token')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Created Successfully',
    schema: {
      example: {
        statusCode: 201,
        msg: 'Success!',
        data: {
          user_id: 'cc03e440-3bfb-44c5-8c8c-083408c31752',
          type: 'SUCCESS_STORIES',
          title: 'Gary story',
          content: 'HEHE',
          thumbnail:
            'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
          achievement_id: null,
          created_at: '2025-06-03T08:42:23.028Z',
        },
        timestamp: '2025-06-03T08:42:23.334Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed.',
    schema: {
      example: {
        statusCode: 422,
        timestamp: '2025-06-03T09:22:46.208Z',
        path: '/api/v1/posts',
        message: [
          {
            path: 'content',
            message: 'Content is required.',
          },
        ],
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-06-03T08:30:02.643Z',
        path: '/api/v1/posts',
        message: 'Unauthorized',
        errors: [],
      },
    },
  })
  @ApiBody({ type: CreatePostDto })
  async createPost(
    @GetCurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(createPostSchema)) body: CreatePostDto,
  ) {
    return this.postsService.createPost(body, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':post_id')
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update Successfully',
    schema: {
      example: {
        statusCode: 201,
        msg: 'Success!',
        data: {
          user_id: 'cc03e440-3bfb-44c5-8c8c-083408c31752',
          type: 'SUCCESS_STORIES',
          title: 'Gary story',
          content: 'HEHE',
          thumbnail:
            'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
          achievement_id: null,
          created_at: '2025-06-03T08:42:23.028Z',
        },
        timestamp: '2025-06-03T08:42:23.334Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed.',
    schema: {
      example: {
        statusCode: 422,
        timestamp: '2025-06-03T09:22:46.208Z',
        path: '/api/v1/posts',
        message: [
          {
            path: 'content',
            message: 'Content must be string.',
          },
        ],
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-06-03T08:30:02.643Z',
        path: '/api/v1/posts',
        message: 'Unauthorized',
        errors: [],
      },
    },
  })
  async updatePost(
    @GetCurrentUser('id') userId: string,
    @Param('post_id') post_id: string,
    @Body(new ZodValidationPipe(updatePostSchema)) body: UpdatePostDto,
  ) {
    return await this.postsService.updatePost(body, post_id, userId);
  }
}

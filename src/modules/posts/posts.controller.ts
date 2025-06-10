import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
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
import { getPostSchema } from './schema/get-post.schema';
import { POSTS_MESSAGES } from '@common/constants/messages';

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
  @Patch(':id')
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
    @GetCurrentUser('id')
    userId: string,
    @Param(new ZodValidationPipe(getPostSchema)) params: { id: string },
    @Body(new ZodValidationPipe(updatePostSchema)) body: UpdatePostDto,
  ) {
    const existingPost = await this.postsService.getPostDetail(params.id);
    if (!existingPost) {
      throw new NotFoundException(POSTS_MESSAGES.POST_NOT_FOUND);
    }
    return await this.postsService.updatePost(body, params.id, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: [
          {
            user_id: 'cc03e440-3bfb-44c5-8c8c-083408c31752',
            type: 'success_stories',
            title: 'Gary story',
            content: 'HEHE',
            thumbnail:
              'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
            achievement_id: null,
            created_at: '2025-06-03T08:32:47.122Z',
          },
        ],
        timestamp: '2025-06-06T06:27:08.303Z',
      },
    },
  })
  async getAllPosts() {
    return await this.postsService.getAllPosts();
  }

  @Get(':id')
  @UsePipes(new ZodValidationPipe(getPostSchema))
  @ApiOperation({ summary: 'Get post detail' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get post detail Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: {
          id: '07614c8b-b4cc-4a1c-8ebe-79b8a30636cc',
          user_id: 'cc03e440-3bfb-44c5-8c8c-083408c31752',
          type: 'success_stories',
          title: 'Gary story',
          content: 'HEHE',
          status: 'approved',
          reason: null,
          thumbnail:
            'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
          achievement_id: null,
          created_at: '2025-06-03T08:32:47.122Z',
          created_by: 'cc03e440-3bfb-44c5-8c8c-083408c31752',
          updated_at: '2025-06-03T08:32:47.122Z',
          updated_by: 'cc03e440-3bfb-44c5-8c8c-083408c31752',
          deleted_at: null,
          deleted_by: null,
        },
        timestamp: '2025-06-06T06:57:47.079Z',
      },
    },
  })
  async getPostDetail(@Param() params: { id: string }) {
    return await this.postsService.getPostDetail(params.id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete post successfully.',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: {
          id: '242de2f2-4b9a-46ff-a678-af0f847b543e',
          user_id: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          type: 'success_stories',
          title: 'Be inspired from Gary stories',
          content: 'This is post content.',
          status: 'PENDING',
          reason: null,
          thumbnail:
            'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
          achievement_id: null,
          created_at: '2025-06-06T08:36:08.117Z',
          created_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          updated_at: '2025-06-10T09:02:37.387Z',
          updated_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
          deleted_at: '2025-06-10T09:02:37.385Z',
          deleted_by: '1b61f583-f326-4abd-b135-b97ca33b84ff',
        },
        timestamp: '2025-06-10T09:02:37.596Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed.',
    schema: {
      example: {
        statusCode: 422,
        timestamp: '2025-06-10T09:20:22.733Z',
        path: '/api/v1/posts/242de2f2-4b9a-46ff-a678-af0f847b543',
        message: [
          {
            path: 'id',
            message: 'Post id is invalid.',
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
        timestamp: '2025-06-10T09:22:48.150Z',
        path: '/api/v1/posts/07614c8b-b4cc-4a1c-8ebe-79b8a30636cc',
        message: 'User not allowed.',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Post not found.',
    schema: {
      example: {
        statusCode: 404,
        timestamp: '2025-06-10T09:21:47.592Z',
        path: '/api/v1/posts/cc03e440-3bfb-44c5-8c8c-083408c31752',
        message: 'Post not found.',
        errors: [],
      },
    },
  })
  async deletePost(
    @GetCurrentUser('id')
    userId: string,
    @Param(new ZodValidationPipe(getPostSchema)) params: { id: string },
  ) {
    return await this.postsService.deletePost(params.id, userId);
  }
}

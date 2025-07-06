import {
  BadRequestException,
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
  ApiParam,
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
import { POST_STATUS, UserRole } from '@common/constants/enum';
import { Roles } from '@common/decorators/roles.decorator';
import { VerifyPostDto } from './dto/verify-post.dto';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { verifyPostSchema } from './schema/verify-post.schema';

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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
    schema: {
      example: {
        statusCode: 400,
        timestamp: '2025-06-20T00:29:09.057Z',
        path: '/api/v1/posts/6bcb2b76-a3dc-4481-aa2c-7254ba68ecc9',
        message: 'This post has not been approved yet and cannot be updated.',
        errors: [],
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the post to update',
    example: '4f1e2f17-1f8c-4b63-a74e-7bb176aaed84',
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
    if (existingPost.status !== POST_STATUS.APPROVED) {
      throw new BadRequestException(POSTS_MESSAGES.POST_NOT_APPROVED);
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
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the post to get detail',
    example: '4f1e2f17-1f8c-4b63-a74e-7bb176aaed84',
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
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the post to delete',
    example: '4f1e2f17-1f8c-4b63-a74e-7bb176aaed84',
  })
  async deletePost(
    @GetCurrentUser('id')
    userId: string,
    @Param(new ZodValidationPipe(getPostSchema)) params: { id: string },
  ) {
    return await this.postsService.deletePost(params.id, userId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('/:id/verify')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Admin approves/rejects post.',
  })
  @ApiBody({
    type: VerifyPostDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verify Successfully',
    schema: {
      example: {
        statusCode: 201,
        msg: 'Success!',
        data: {
          id: 'b19a20e6-a834-4aa8-ba3b-ff39ce23eef7',
          user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
          type: 'tools_and_tips',
          title: 'Medications Can Help You Quit',
          content: 'Medications Can Help You Quit',
          status: 'REJECTED',
          reason: 'no relevant content included.',
          thumbnail:
            'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/default_avt.png',
          achievement_id: null,
          created_at: '2025-06-19T06:36:40.593Z',
          created_by: '50289579-f828-466e-a266-f81adaeb77b9',
          updated_at: '2025-06-21T13:31:57.020Z',
          updated_by: '50289579-f828-466e-a266-f81adaeb77b9',
          deleted_at: null,
          deleted_by: null,
        },
        timestamp: '2025-06-21T13:31:57.117Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed.',
    schema: {
      example: {
        statusCode: 422,
        timestamp: '2025-06-21T13:36:32.051Z',
        path: '/api/v1/posts/497b793a-6546-48a7-b822-145c02e16020/verify',
        message: [
          {
            path: 'status',
            message: 'Status is invalid.',
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
        timestamp: '2025-06-21T13:12:10.877Z',
        path: '/api/v1/posts/09b314be-1a19-4c31-9b06-898bfb9cd2b5/verify',
        message: 'Unauthorized',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
    schema: {
      example: {
        statusCode: 400,
        timestamp: '2025-06-20T00:29:09.057Z',
        path: '/api/v1/posts/6bcb2b76-a3dc-4481-aa2c-7254ba68ecc9',
        message: 'This post has not been approved yet and cannot be updated.',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied.',
    schema: {
      example: {
        statusCode: 403,
        timestamp: '2025-06-21T13:28:17.614Z',
        path: '/api/v1/posts/b19a20e6-a834-4aa8-ba3b-ff39ce23eef7/verify',
        message: 'Access denied. Requiring a special role',
        errors: [],
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'post id to verify',
    type: 'string',
    format: 'uuid',
    example: '09b314be-1a19-4c31-9b06-898bfb9cd2b5',
  })
  verify(
    @Body(new ZodValidationPipe(verifyPostSchema))
    body: VerifyPostDto,
    @GetCurrentUser('id') userId: string,
    @Param(new ZodValidationPipe(getPostSchema)) params: { id: string },
  ) {
    return this.postsService.verifyPost(body, params.id, userId);
  }

  @Get('/:id/reactions')
  @ApiOperation({
    summary: 'Get post reactions.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get post reactions Successfully',
    schema: {
      example: {
        statusCode: 200,
        msg: 'Success!',
        data: [
          {
            id: 'a730cf57-45f2-4773-945e-7771bb874ced',
            ref_id: '007456f9-5d43-4346-a02b-ca83ca4c7f40',
            ref_type: 'POST',
            user_id: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
            type: 'LOVE',
            created_at: '2025-07-06T11:22:13.225Z',
            created_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
            updated_at: '2025-07-06T11:22:40.326Z',
            updated_by: 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e',
            deleted_at: null,
            deleted_by: null,
            users: {
              first_name: 'gmm',
              last_name: 'phm',
              avatar:
                'https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/avatar/e2bd5ed1c4629d9ff41c73b7955f16dfeec86e3c-de6zq18hjorrojh3mi38rk739pg',
            },
          },
        ],
        timestamp: '2025-07-06T12:29:58.148Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
    schema: {
      example: {
        statusCode: 404,
        timestamp: '2025-07-06T12:30:50.995Z',
        path: '/api/v1/posts/007456f9-5d43-4346-a02b-ca83ca4c7f41/reactions',
        message: 'Post not found.',
        errors: [],
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'post id',
    type: 'string',
    format: 'uuid',
    example: '007456f9-5d43-4346-a02b-ca83ca4c7f40',
  })
  getReactions(
    @Param(new ZodValidationPipe(getPostSchema)) params: { id: string },
  ) {
    return this.postsService.getPostReactions(params.id);
  }
}

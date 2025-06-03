import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { ZodValidationPipe } from 'nestjs-zod';
import { createPostSchema } from './schema/create-post.schema';
import { CreatePostDto } from '@modules/users/dto/create-post.dto';
import { GetCurrentUser } from '@common/decorators/user.decorator';

@Controller('posts')
@ApiBearerAuth('access-token')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async createPost(
    @GetCurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(createPostSchema))
    body: CreatePostDto,
  ) {
    return this.postsService.createPost(body, userId);
  }
}

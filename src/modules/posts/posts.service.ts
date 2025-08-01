import { CreatePostDto } from '@modules/posts/dto/create-post.dto';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsRepository } from './post.repository';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dto/res-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { POSTS_MESSAGES } from '@common/constants/messages';
import { VerifyPostDto } from './dto/verify-post.dto';
import { ReactionsService } from '@modules/reactions/reactions.service';
import { CommentsService } from '@modules/comments/comments.service';
import { users } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    @Inject(forwardRef(() => ReactionsService))
    private readonly reactionsService: ReactionsService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
  ) {}
  async createPost(
    createPostDto: CreatePostDto,
    user: users,
  ): Promise<CreatePostDto> {
    const result = await this.postsRepository.createPost(createPostDto, user);
    return plainToInstance(PostResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async updatePost(
    updatePostDto: UpdatePostDto,
    post_id: string,
    user_id: string,
  ) {
    const validAuthor = await this.postsRepository.getPost({
      id: post_id,
      user_id,
    });
    if (!validAuthor) {
      throw new UnauthorizedException(POSTS_MESSAGES.USER_NOT_ALLOWED);
    }
    const result = await this.postsRepository.updatePost(
      updatePostDto,
      post_id,
      user_id,
    );
    return plainToInstance(PostResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async getAllPosts() {
    const result = await this.postsRepository.getAllPosts();
    return result;
  }

  async getPostDetail(post_id: string) {
    const result = await this.postsRepository.getPost({ id: post_id });
    if (!result) {
      throw new NotFoundException(POSTS_MESSAGES.POST_NOT_FOUND);
    }
    const { users, ...rest } = result;
    return {
      ...rest,
      ...users,
    };
  }

  async deletePost(post_id: string, user_id: string) {
    const existingPost = await this.postsRepository.getPost({ id: post_id });
    if (!existingPost) {
      throw new NotFoundException(POSTS_MESSAGES.POST_NOT_FOUND);
    }
    if (existingPost.user_id !== user_id) {
      throw new UnauthorizedException(POSTS_MESSAGES.USER_NOT_ALLOWED);
    }

    const result = await this.postsRepository.deletePost(post_id, user_id);
    return result;
  }

  async getOwnPosts(user_id: string, status?: string) {
    const result = await this.postsRepository.getOwnPosts(user_id, status);
    return result;
  }

  async verifyPost(payload: VerifyPostDto, post_id: string, user_id: string) {
    const existingPost = await this.postsRepository.getPost({ id: post_id });
    if (!existingPost) {
      throw new NotFoundException(POSTS_MESSAGES.POST_NOT_FOUND);
    }
    const result = await this.postsRepository.verifyPost(
      payload,
      post_id,
      user_id,
    );
    return result;
  }
  async getPostReactions(post_id: string) {
    const existingPost = await this.postsRepository.getPost({ id: post_id });
    if (!existingPost) {
      throw new NotFoundException(POSTS_MESSAGES.POST_NOT_FOUND);
    }
    const result = await this.reactionsService.getReactions(post_id);
    return result;
  }
  async getPostComments(post_id: string) {
    const existingPost = await this.postsRepository.getPost({ id: post_id });
    if (!existingPost) {
      throw new NotFoundException(POSTS_MESSAGES.POST_NOT_FOUND);
    }
    const result = await this.commentsService.getPostComments(post_id);
    return result;
  }
}

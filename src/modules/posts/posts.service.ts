import { CreatePostDto } from '@modules/posts/dto/create-post.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PostsRepository } from './post.repository';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dto/res-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}
  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<CreatePostDto> {
    const result = await this.postsRepository.createPost(createPostDto, userId);
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
      throw new UnauthorizedException('User not allowed.');
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
}

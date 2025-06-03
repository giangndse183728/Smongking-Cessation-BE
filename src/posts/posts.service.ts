import { CreatePostDto } from '@modules/users/dto/create-post.dto';
import { Injectable } from '@nestjs/common';
import { PostsRepository } from './post.repository';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dto/res-posts.dto';

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
}

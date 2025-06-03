import { PrismaService } from '@libs/prisma/prisma.service';
import { CreatePostDto } from '@modules/users/dto/create-post.dto';
import { Injectable } from '@nestjs/common';
import { posts } from '@prisma/client';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}
  async createPost(data: CreatePostDto, user_id: string): Promise<posts> {
    return await this.prisma.posts.create({
      data: {
        ...data,
        user_id,
        created_at: new Date(),
        created_by: user_id,
        updated_at: new Date(),
        updated_by: user_id,
      },
    });
  }
}

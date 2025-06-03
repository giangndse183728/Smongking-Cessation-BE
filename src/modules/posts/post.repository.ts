import { PrismaService } from '@libs/prisma/prisma.service';
import { CreatePostDto } from '@modules/posts/dto/create-post.dto';
import { Injectable } from '@nestjs/common';
import { posts, Prisma } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';
import { POST_STATUS } from '@common/constants/enum';

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

  async getPost(filter: Prisma.postsWhereUniqueInput) {
    return await this.prisma.posts.findUnique({
      where: { ...filter, deleted_at: null, deleted_by: null },
    });
  }

  async updatePost(data: UpdatePostDto, post_id: string, user_id: string) {
    try {
      console.log(post_id, user_id);
      const updatedPost = await this.prisma.posts.update({
        where: {
          id: post_id,
          user_id,
          status: POST_STATUS.APPROVED,
          deleted_at: null,
          deleted_by: null,
        },
        data: {
          ...data,
          user_id,
          status: POST_STATUS.UPDATING,
          created_at: new Date(),
          created_by: user_id,
          updated_at: new Date(),
          updated_by: user_id,
        },
      });
      return updatedPost;
    } catch (error) {
      // Xử lý lỗi ở đây, ví dụ:
      console.error('Error updating post:', error);
      throw new Error('Failed to update post.');
    }
  }
}

import { PrismaService } from '@libs/prisma/prisma.service';
import { CreatePostDto } from '@modules/posts/dto/create-post.dto';
import { posts, Prisma } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';
import { POST_STATUS } from '@common/constants/enum';
import { Injectable } from '@nestjs/common';

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
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
  }

  async updatePost(data: UpdatePostDto, post_id: string, user_id: string) {
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
  }

  async getAllPosts() {
    const result = await this.prisma.posts.findMany({
      where: {
        deleted_at: null,
        deleted_by: null,
      },
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
    return result.map((item) => {
      const { users, ...rest } = item;
      return {
        ...rest,
        ...users,
      };
    });
  }

  async getPostDetail(id: string) {
    return await this.prisma.posts.findUnique({
      where: {
        id,
        deleted_at: null,
        deleted_by: null,
      },
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
  }
}

import { PrismaService } from '@libs/prisma/prisma.service';
import { CreatePostDto } from '@modules/posts/dto/create-post.dto';
import { posts, Prisma, UserRole, users } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';
import { POST_STATUS } from '@common/constants/enum';
import { Injectable } from '@nestjs/common';
import { VerifyPostDto } from './dto/verify-post.dto';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}
  async createPost(data: CreatePostDto, user: users): Promise<posts> {
    return await this.prisma.posts.create({
      data: {
        ...data,
        user_id: user.id,
        status:
          user.role !== UserRole.user
            ? POST_STATUS.APPROVED
            : POST_STATUS.PENDING,
        created_at: new Date(),
        created_by: user.id,
        updated_at: new Date(),
        updated_by: user.id,
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

  async deletePost(post_id: string, user_id: string): Promise<posts> {
    return await this.prisma.posts.update({
      data: {
        deleted_at: new Date(),
        deleted_by: user_id,
      },
      where: {
        id: post_id,
        user_id,
        deleted_at: null,
        deleted_by: null,
      },
    });
  }

  async getOwnPosts(user_id: string, status?: string) {
    return await this.prisma.posts.findMany({
      where: {
        deleted_at: null,
        deleted_by: null,
        user_id,
        ...(status ? { status } : {}),
      },
    });
  }

  async verifyPost(payload: VerifyPostDto, post_id: string, user_id: string) {
    return await this.prisma.posts.update({
      where: {
        id: post_id,
        deleted_at: null,
        deleted_by: null,
      },
      data: {
        ...payload,
        created_by: user_id,
        updated_by: user_id,
      },
    });
  }
}

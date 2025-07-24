import { PrismaService } from '@libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { addCommentDto } from './dto/add-comment.dto';
import { users } from '@prisma/client';

@Injectable()
export class CommentsRepository {
  constructor(private prisma: PrismaService) {}
  async addComment(body: addCommentDto, userId: string) {
    return await this.prisma.comments.create({
      data: {
        ...body,
        created_by: userId,
        updated_by: userId,

        user_id: userId,
      },
    });
  }
  async getPostComments(post_id: string) {
    return await this.prisma.comments.findMany({
      where: {
        post_id,
        deleted_at: null,
        deleted_by: null,
      },
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true,
            avatar: true,
          },
        },
      },
    });
  }
  async findComment(id: string) {
    return await this.prisma.comments.findUnique({
      where: { id, deleted_at: null, deleted_by: null },
    });
  }
  async deleteComment(user: users, commentId: string) {
    return await this.prisma.comments.update({
      where: {
        id: commentId,
        deleted_at: null,
        deleted_by: null,
      },
      data: {
        deleted_at: new Date(),
        deleted_by: user.id,
        updated_by: user.id,
      },
    });
  }
}

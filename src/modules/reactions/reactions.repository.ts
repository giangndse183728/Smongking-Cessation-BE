import { PrismaService } from '@libs/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { addReactionDto } from './dto/add-reaction.dto';

@Injectable()
export class ReactionRepository {
  constructor(private prisma: PrismaService) {}
  async addReaction(user_id: string, body: addReactionDto) {
    const existingReaction = await this.prisma.reactions.findFirst({
      where: {
        user_id,
        ref_id: body.ref_id,
        deleted_at: null,
        deleted_by: null,
      },
    });
    if (!existingReaction) {
      return await this.prisma.reactions.create({
        data: {
          ...body,
          ref_type: 'POST',
          user_id,
          created_by: user_id,
          updated_by: user_id,
        },
      });
    } else {
      return await this.prisma.reactions.update({
        where: {
          id: existingReaction.id,
          user_id,
          deleted_at: null,
          deleted_by: null,
        },
        data: { ...body, user_id, created_by: user_id, updated_by: user_id },
      });
    }
  }
  async getReactions(post_id: string) {
    return await this.prisma.reactions.findMany({
      where: {
        ref_id: post_id,
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
}

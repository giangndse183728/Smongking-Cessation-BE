import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { PostsService } from '@modules/posts/posts.service';
import { COMMENTS_MESSAGES, POSTS_MESSAGES } from '@common/constants/messages';
import { addCommentDto } from './dto/add-comment.dto';
import { users } from '@prisma/client';
import { UserRole } from '@common/constants/enum';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}
  async addComment(body: addCommentDto, userId: string) {
    const existingPost = await this.postsService.getPostDetail(body.post_id);
    if (!existingPost) {
      throw new NotFoundException(COMMENTS_MESSAGES.POST_NOT_FOUND);
    }
    if (body.parent_comment_id) {
      const existingParentComment = await this.commentsRepository.findComment(
        body.parent_comment_id,
      );
      if (!existingParentComment) {
        throw new NotFoundException(COMMENTS_MESSAGES.PARENT_COMMENT_NOT_FOUND);
      }
      if (existingParentComment.post_id !== body.post_id) {
        console.log(existingParentComment.post_id, body.post_id);
        throw new BadRequestException(
          COMMENTS_MESSAGES.PARENT_COMENT_ID_IS_INVALID,
        );
      }
    }
    return await this.commentsRepository.addComment(body, userId);
  }
  async getPostComments(post_id: string) {
    return await this.commentsRepository.getPostComments(post_id);
  }
  async deleteComment(user: users, commentId: string) {
    const existingComment =
      await this.commentsRepository.findComment(commentId);
    if (!existingComment) {
      throw new NotFoundException(COMMENTS_MESSAGES.COMMENT_NOT_FOUND);
    }
    if (
      user.role === UserRole.USER.toString() &&
      existingComment.user_id !== user.id
    ) {
      throw new ForbiddenException(POSTS_MESSAGES.USER_NOT_ALLOWED);
    }
    return await this.commentsRepository.deleteComment(user, commentId);
  }
}

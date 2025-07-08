import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { PostsService } from '@modules/posts/posts.service';
import { COMMENTS_MESSAGES } from '@common/constants/messages';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}
  async addComment(body: any, userId: string) {
    const existingPost = await this.postsService.getPostDetail(body.post_id);
    if (!existingPost) {
      throw new NotFoundException(COMMENTS_MESSAGES.POST_NOT_FOUND);
    }
    return await this.commentsRepository.addComment(body, userId);
  }
  async getPostComments(post_id: string) {
    return await this.commentsRepository.getPostComments(post_id);
  }
}

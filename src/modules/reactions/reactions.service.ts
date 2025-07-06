import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { addReactionDto } from './dto/add-reaction.dto';
import { ReactionRepository } from './reactions.repository';
import { PostsService } from '@modules/posts/posts.service';
import { REACTION_MESSAGES } from '@common/constants/messages';

@Injectable()
export class ReactionsService {
  constructor(
    private readonly reactionRepository: ReactionRepository,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}
  async addReaction(user_id: string, body: addReactionDto) {
    const existingPost = await this.postsService.getPostDetail(body.ref_id);
    if (!existingPost) {
      throw new NotFoundException(REACTION_MESSAGES.POST_NOT_FOUND);
    }
    return await this.reactionRepository.addReaction(user_id, body);
  }
  async getReactions(post_id: string) {
    return await this.reactionRepository.getReactions(post_id);
  }
}

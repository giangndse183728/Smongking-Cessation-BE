import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './post.repository';
import { ReactionsModule } from '@modules/reactions/reactions.module';
import { CommentsModule } from '@modules/comments/comments.module';

@Module({
  imports: [
    forwardRef(() => ReactionsModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService],
})
export class PostsModule {}

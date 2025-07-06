import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './post.repository';
import { ReactionsModule } from '@modules/reactions/reactions.module';

@Module({
  imports: [forwardRef(() => ReactionsModule)],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService],
})
export class PostsModule {}

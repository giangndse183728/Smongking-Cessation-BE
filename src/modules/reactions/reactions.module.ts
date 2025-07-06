import { Module } from '@nestjs/common';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { ReactionRepository } from './reactions.repository';
import { PostsModule } from '@modules/posts/posts.module';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService, ReactionRepository],
  imports: [PostsModule],
})
export class ReactionsModule {}

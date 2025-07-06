import { Module, forwardRef } from '@nestjs/common';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { ReactionRepository } from './reactions.repository';
import { PostsModule } from '@modules/posts/posts.module';

@Module({
  imports: [forwardRef(() => PostsModule)],
  controllers: [ReactionsController],
  providers: [ReactionsService, ReactionRepository],
  exports: [ReactionsService],
})
export class ReactionsModule {}

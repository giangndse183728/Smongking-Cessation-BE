import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { PostsModule } from '@modules/posts/posts.module';

@Module({
  providers: [CommentsService, CommentsRepository],
  controllers: [CommentsController],
  imports: [forwardRef(() => PostsModule)],
  exports: [CommentsService],
})
export class CommentsModule {}

import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './post.repository';
import { UserAchievementModule } from '@modules/user-achievement/user-achievement.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  imports: [UserAchievementModule],
})
export class PostsModule {}

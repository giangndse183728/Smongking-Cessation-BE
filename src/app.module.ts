import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from '@libs/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MotivationModule } from '@modules/motivation/motivation.module';
import { SmokingHabitsModule } from '@modules/smoking-habits/smoking-habits.module';
import { MediaModule } from './modules/media/media.module';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    MotivationModule,
    SmokingHabitsModule,
    MediaModule,
    PostsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

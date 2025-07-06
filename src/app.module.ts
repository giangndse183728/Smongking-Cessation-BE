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
import { QuitPlanModule } from '@modules/quit-plan/quit-plan.module';
import { PlanRecordModule } from '@modules/plan-record/plan-record.module';
import { MembershipPlanModule } from '@modules/membership-plan/membership-plan.module';
import { SubscriptionModule } from '@modules/subscription/subscription.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { UserAchievementModule } from './modules/user-achievement/user-achievement.module';
import { LeaderboardModule } from '@modules/leaderboard/leaderboard.module';
import { CoachModule } from '@modules/coach/coach.module';
import { ChatModule } from '@modules/chat/chat.module';
import { NotificationSchedulesModule } from '@modules/notification-schedules/notification-schedules.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReactionsModule } from '@modules/reactions/reactions.module';

@Module({
  imports: [
    PrismaModule,
    QuitPlanModule,
    MembershipPlanModule,
    CoachModule,
    SubscriptionModule,
    PlanRecordModule,
    UsersModule,
    AuthModule,
    MotivationModule,
    SmokingHabitsModule,
    MediaModule,
    PostsModule,
    ChatModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AchievementsModule,
    UserAchievementModule,
    LeaderboardModule,
    NotificationSchedulesModule,
    NotificationsModule,
    ReactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

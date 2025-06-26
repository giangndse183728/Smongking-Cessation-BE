import { Module } from '@nestjs/common';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';
import { CoachRepository } from './coach.repository';
import { PrismaModule } from '@libs/prisma/prisma.module';
import { MailModule } from '@libs/mail/mail.module';
import { RedisModule } from '@libs/redis/redis.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [PrismaModule, MailModule, RedisModule, AuthModule],
  controllers: [CoachController],
  providers: [CoachService, CoachRepository],
  exports: [CoachService],
})
export class CoachModule {}

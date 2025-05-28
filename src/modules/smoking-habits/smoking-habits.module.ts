import { Module } from '@nestjs/common';
import { SmokingHabitsController } from './smoking-habits.controller';
import { SmokingHabitsService } from './smoking-habits.service';
import { SmokingHabitsRepository } from './smoking-habits.repository';
import { PrismaModule } from '@libs/prisma/prisma.module';
import { AccessTokenStrategy } from '@modules/auth/strategies/access-token.strategy';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AIService } from '@libs/ai/ai.service';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule],
  controllers: [SmokingHabitsController],
  providers: [
    SmokingHabitsService,
    SmokingHabitsRepository,
    AccessTokenStrategy,
    AIService,
  ],
  exports: [SmokingHabitsService],
})
export class SmokingHabitsModule {}

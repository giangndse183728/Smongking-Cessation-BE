import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { ChatController } from './chat.controller';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { PrismaModule } from '@libs/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { LiveKitModule } from '@libs/livekit/livekit.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LiveKitModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('ACCESS_TOKEN_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, ChatRepository, WsJwtGuard],
  exports: [ChatService],
})
export class ChatModule {} 
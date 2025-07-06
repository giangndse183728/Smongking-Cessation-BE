import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '@libs/redis/redis.service';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/notification',
})
@Injectable()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private connectedUsers = new Map<string, Socket>();

  constructor(private readonly redisService: RedisService) {
    const redisClient = this.redisService.getRedisClient();

    void redisClient.psubscribe('notifications:*', (err) => {
      if (err) {
        this.logger.error('Redis psubscribe error:', err);
      } else {
        this.logger.log(`Subscribed to Redis notifications:*`);
      }
    });

    redisClient.on('pmessage', (pattern, channel, message) => {
      const userId = channel.split(':')[1];
      try {
        const data = JSON.parse(message) as string;
        this.logger.log(`Received notification for user ${userId}: ${message}`);
        this.sendToUser(userId, 'notification', data);
      } catch (error) {
        this.logger.error('Failed to parse Redis message', error);
      }
    });
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.set(userId, client);
      this.logger.log(`User ${userId} connected to /notification`);
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socket] of this.connectedUsers.entries()) {
      if (socket.id === client.id) {
        this.connectedUsers.delete(userId);
        this.logger.log(`User ${userId} disconnected from /notification`);
        break;
      }
    }
  }

  sendToUser(userId: string, event: string, data: any) {
    const socket = this.connectedUsers.get(userId);
    if (socket) {
      socket.emit(event, data);
    }
  }
}

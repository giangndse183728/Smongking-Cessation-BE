import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './schemas/send-message.schema';
import { JoinRoomDto } from './schemas/join-room.schema';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { GetUser } from '../../common/decorators/get-user-ws.decorator';

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: '/chat',
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, Socket>();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    try {
      const userId = client.data.user?.id;
      if (userId) {
        this.connectedUsers.set(userId, client);
        console.log(`User ${userId} connected to chat`);
      }
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user?.id;
    if (userId) {
      this.connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected from chat`);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
    @GetUser() user: any,
  ) {
    try {
      const chatRoom = await this.chatService.joinChatRoom(user.id, joinRoomDto);

      await client.join(joinRoomDto.chat_room_id);

      client.emit('roomJoined', {
        chatRoomId: chatRoom.id,
        message: 'Successfully joined chat room',
      });

      client.to(joinRoomDto.chat_room_id).emit('userJoined', {
        userId: user.id,
        message: 'User joined the chat',
      });

    } catch (error) {
      client.emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: Socket,
    @GetUser() user: any,
  ) {
    try {
      const chatLine = await this.chatService.sendMessage(user.id, sendMessageDto);
      
      this.server.to(sendMessageDto.chat_room_id).emit('newMessage', {
        id: chatLine.id,
        chat_room_id: chatLine.chat_room_id,
        sender_id: chatLine.sender_id,
        sender_type: chatLine.sender_type,
        message: chatLine.message,
        sent_at: chatLine.sent_at,
        is_read: chatLine.is_read,
      });

      client.emit('messageSent', {
        messageId: chatLine.id,
        message: 'Message sent successfully',
      });

    } catch (error) {
      client.emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
    @GetUser() user: any,
  ) {
    try {
      await client.leave(joinRoomDto.chat_room_id);
      
      // Notify other users in the room
      client.to(joinRoomDto.chat_room_id).emit('userLeft', {
        userId: user.id,
        message: 'User left the chat',
      });

      client.emit('roomLeft', {
        chatRoomId: joinRoomDto.chat_room_id,
        message: 'Successfully left chat room',
      });

    } catch (error) {
      client.emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { chat_room_id: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
    @GetUser() user: any,
  ) {
    try {
      client.to(data.chat_room_id).emit('userTyping', {
        userId: user.id,
        isTyping: data.isTyping,
      });
    } catch (error) {
      client.emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { chat_room_id: string },
    @ConnectedSocket() client: Socket,
    @GetUser() user: any,
  ) {
    try {
      await this.chatService.getChatMessages(data.chat_room_id, user.id, 1, 0);
      
      client.to(data.chat_room_id).emit('messagesRead', {
        userId: user.id,
        chatRoomId: data.chat_room_id,
      });

    } catch (error) {
      client.emit('error', {
        message: error.message,
      });
    }
  }

  sendToUser(userId: string, event: string, data: any) {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      userSocket.emit(event, data);
    }
  }

  sendToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
} 
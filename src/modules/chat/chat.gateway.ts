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

  private connectedUsers = new Map<string, Set<Socket>>();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    try {
      console.log('Client connected:', client.id);
      
      // Note: JWT verification will be handled by WsJwtGuard
      // We'll track user online status when they send their first message
      
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    // Find and remove the disconnected socket from all users
    for (const [userId, sockets] of this.connectedUsers.entries()) {
      // Check if this client socket is in the user's socket set
      const socketFound = Array.from(sockets).some(socket => socket.id === client.id);
      if (socketFound) {
        // Remove the specific socket from the set
        const socketsArray = Array.from(sockets);
        const targetSocket = socketsArray.find(socket => socket.id === client.id);
        if (targetSocket) {
          sockets.delete(targetSocket);
        }
        
        // If user has no more connections, mark them as offline
        if (sockets.size === 0) {
          this.connectedUsers.delete(userId);
          this.server.emit('user-offline', { userId });
        }
        break;
      }
    }
  }



  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
    @GetUser() user: any,
  ) {
    try {
      // Track user online (leveraging WsJwtGuard's user data)
      this.trackUserOnline(client, user.id);
      
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
      this.trackUserOnline(client, user.id);
      
      const chatLine = await this.chatService.sendMessage(user.id, sendMessageDto);
      
      this.server.to(sendMessageDto.chat_room_id).emit('newMessage', {
        id: chatLine.id,
        chat_room_id: sendMessageDto.chat_room_id,
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

  @SubscribeMessage('start-call')
  async handleStartCall(
    @GetUser() user: any,
    @MessageBody() data: { chatRoomId: string },
    @ConnectedSocket() client: Socket,
    callback?: (response: any) => void,
  ) {
    try {
      const { token, otherParticipantUserId } =
        await this.chatService.initiateVideoCall(user.id, user.username, data.chatRoomId);
      
      const targetUserSockets = this.connectedUsers.get(otherParticipantUserId);
      if (!targetUserSockets || targetUserSockets.size === 0) {
        const response = { event: 'error', data: { message: 'The other user is not online' } };
        if (callback) callback(response);
        return;
      }

      this.sendToUser(otherParticipantUserId, 'incoming-call', {
        roomId: data.chatRoomId,
        caller: user,
      });

      const response = { event: 'call-started', data: { token } };
      if (callback) callback(response);
      
    } catch (error) {
      const response = { event: 'error', data: { message: error.message } };
      if (callback) callback(response);
    }
  }

  @SubscribeMessage('accept-call')
  async handleAcceptCall(
    @GetUser() user: any,
    @MessageBody() data: { chatRoomId: string; caller: any },
    @ConnectedSocket() client: Socket,
    callback?: (response: any) => void,
  ) {
    try {
      const accepterToken = await this.chatService.getJoinCallToken(
        user.username,
        data.chatRoomId,
      );

      const callerToken = await this.chatService.getJoinCallToken(
        data.caller.username,
        data.chatRoomId,
      );

      const callStartMessage = {
        chat_room_id: data.chatRoomId,
        message: `📞 Video call started between ${data.caller.username} and ${user.username}`,
        sender_type: 'SYSTEM' as const,
      };

      const chatLine = await this.chatService.sendMessage(user.id, callStartMessage);
      
      this.server.to(data.chatRoomId).emit('newMessage', {
        id: chatLine.id,
        chat_room_id: data.chatRoomId,
        sender_id: chatLine.sender_id,
        sender_type: chatLine.sender_type,
        message: chatLine.message,
        sent_at: chatLine.sent_at,
        is_read: chatLine.is_read,
      });

      this.sendToUser(data.caller.id, 'call-accepted', {
        callee: user,
        token: callerToken,
      });

      const response = { event: 'call-accepted-token', data: { token: accepterToken } };
      
      if (callback) {
        callback(response);
      } else {
        client.emit('call-accepted-token', { token: accepterToken });
      }
      
    } catch (error) {
      const response = { event: 'error', data: { message: error.message } };
      if (callback) {
        callback(response);
      } else {
        client.emit('error', { message: error.message });
      }
    }
  }

  @SubscribeMessage('reject-call')
  async handleRejectCall(
    @GetUser() user: any,
    @MessageBody() data: { callerId: string },
  ) {
    this.sendToUser(data.callerId, 'call-rejected', {
      callee: user,
    });
  }

  @SubscribeMessage('end-call')
  async handleEndCall(@MessageBody() data: { chatRoomId: string }) {
    this.server.to(data.chatRoomId).emit('call-ended');
  }

  @SubscribeMessage('check-user-online')
  async handleCheckUserOnline(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const isOnline = this.connectedUsers.has(data.userId);
    client.emit('user-online-status', { 
      userId: data.userId, 
      isOnline 
    });
  }

  
  @SubscribeMessage('get-online-users')
  async handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const onlineUserIds = Array.from(this.connectedUsers.keys());
    client.emit('online-users-list', { onlineUsers: onlineUserIds });
  }

  @SubscribeMessage('get-online-count')
  async handleGetOnlineCount(@ConnectedSocket() client: Socket) {
    const onlineCount = this.connectedUsers.size;
    client.emit('online-users-count', { count: onlineCount });
  }

  sendToUser(userId: string, event: string, data: any) {
    const userSockets = this.connectedUsers.get(userId);
    if (userSockets) {
      // Send to all connected sockets for this user
      userSockets.forEach(socket => {
        socket.emit(event, data);
      });
    }
  }

  sendToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  private trackUserOnline(client: Socket, userId: string) {
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set([client]));
      this.server.emit('user-online', { userId });
    } else {
      const userSockets = this.connectedUsers.get(userId);
      if (userSockets) {
        userSockets.add(client);
      }
    }
  }


}
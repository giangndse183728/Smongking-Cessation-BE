import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { GetCurrentUser } from '@common/decorators/user.decorator';

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  @ApiOperation({ summary: 'Create a new chat room with a coach' })
  @ApiResponse({ status: 201, description: 'Chat room created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createChatRoom(
    @GetCurrentUser('id') userId: string,
    @Body() body: { coach_id: string },
  ) {
    const chatRoom = await this.chatService.createOrGetChatRoom(userId, body.coach_id);
    return {
      success: true,
      message: 'Chat room created successfully',
      data: {
        chat_room_id: chatRoom.id,
        user_id: chatRoom.user_id,
        coach_id: chatRoom.coach_id,
        status: chatRoom.status,
        started_at: chatRoom.started_at,
      },
    };
  }

  @Get('rooms')
  @ApiOperation({ summary: 'Get all chat rooms for the current user' })
  @ApiResponse({ status: 200, description: 'Chat rooms retrieved successfully' })
  async getUserChatRooms(@GetCurrentUser('id') userId: string) {
    const chatRooms = await this.chatService.getUserChatRooms(userId);
    return {
      success: true,
      message: 'Chat rooms retrieved successfully',
      data: chatRooms.map(room => ({
        id: room.id,
        user_id: room.user_id,
        coach_id: room.coach_id,
        status: room.status,
        started_at: room.started_at,
        ended_at: room.ended_at,
      })),
    };
  }

  @Get('rooms/:chatRoomId/messages')
  @ApiOperation({ summary: 'Get chat messages for a specific room' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Chat room not found' })
  async getChatMessages(
    @GetCurrentUser('id') userId: string,
    @Param('chatRoomId') chatRoomId: string,
  ) {
    const messages = await this.chatService.getChatMessages(chatRoomId, userId);
    return {
      success: true,
      message: 'Messages retrieved successfully',
      data: messages.map(msg => ({
        id: msg.id,
        sender_id: msg.sender_id,
        sender_type: msg.sender_type,
        message: msg.message,
        sent_at: msg.sent_at,
        is_read: msg.is_read,
      })),
    };
  }

  @Post('rooms/:chatRoomId/end')
  @ApiOperation({ summary: 'End a chat room' })
  @ApiResponse({ status: 200, description: 'Chat room ended successfully' })
  @ApiResponse({ status: 404, description: 'Chat room not found' })
  async endChatRoom(
    @GetCurrentUser('id') userId: string,
    @Param('chatRoomId') chatRoomId: string,
  ) {
    const chatRoom = await this.chatService.endChatRoom(chatRoomId, userId);
    return {
      success: true,
      message: 'Chat room ended successfully',
      data: {
        id: chatRoom.id,
        status: chatRoom.status,
        ended_at: chatRoom.ended_at,
      },
    };
  }
} 
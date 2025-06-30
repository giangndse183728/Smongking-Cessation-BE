import { Controller, Post, Get, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { GetCurrentUser } from '@common/decorators/user.decorator';
import { CoachChatRoomResponseDto } from './dto/coach-chat-room-response.dto';
import { CreateChatRoomResponseDto } from './dto/create-chat-room-response.dto';
import { UserChatRoomResponseDto } from './dto/user-chat-room-response.dto';
import { ChatMessageResponseDto } from './dto/chat-message-response.dto';
import { EndChatRoomResponseDto } from './dto/end-chat-room-response.dto';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@common/constants/enum';

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @Post('rooms')
  @ApiOperation({ summary: 'Create a new chat room with a coach' })
  @ApiResponse({
    status: 201,
    description: 'Chat room created successfully',
    type: CreateChatRoomResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createChatRoom(
    @GetCurrentUser('id') userId: string,
    @Body() body: { coach_id: string },
  ): Promise<CreateChatRoomResponseDto> {
    return this.chatService.createOrGetChatRoom(userId, body.coach_id);
  }

  @Get('rooms')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Get all chat rooms for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Chat rooms retrieved successfully',
    type: [UserChatRoomResponseDto],
  })
  async getUserChatRooms(
    @GetCurrentUser('id') userId: string,
  ): Promise<UserChatRoomResponseDto[]> {
    return this.chatService.getUserChatRooms(userId);
  }

  @Get('rooms/coach')
  @Roles(UserRole.COACH)
  @ApiOperation({ summary: 'Get all chat rooms for the current coach' })
  @ApiResponse({
    status: 200,
    description: 'Chat rooms retrieved successfully',
    type: [CoachChatRoomResponseDto],
  })
  async getCoachChatRooms(
    @GetCurrentUser('id') userId: string,
  ): Promise<CoachChatRoomResponseDto[]> {
    return this.chatService.getCoachChatRoomsForUser(userId);
  }

  @Get('rooms/:chatRoomId/messages')
  @ApiOperation({ summary: 'Get chat messages for a specific room' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    type: [ChatMessageResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Chat room not found' })
  async getChatMessages(
    @GetCurrentUser('id') userId: string,
    @Param('chatRoomId') chatRoomId: string,
  ): Promise<ChatMessageResponseDto[]> {
    return this.chatService.getChatMessages(chatRoomId, userId);
  }

  @Post('rooms/:chatRoomId/end')
  @ApiOperation({ summary: 'End a chat room' })
  @ApiResponse({
    status: 200,
    description: 'Chat room ended successfully',
    type: EndChatRoomResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Chat room not found' })
  async endChatRoom(
    @GetCurrentUser('id') userId: string,
    @Param('chatRoomId') chatRoomId: string,
  ): Promise<EndChatRoomResponseDto> {
    return this.chatService.endChatRoom(chatRoomId, userId);
  }
} 
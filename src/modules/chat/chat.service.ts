import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { ChatRoomEntity } from './entities/chat-room.entity';
import { ChatLineEntity } from './entities/chat-line.entity';
import { SendMessageDto } from './schemas/send-message.schema';
import { JoinRoomDto } from './schemas/join-room.schema';
import { WsException } from '@nestjs/websockets';
import { users } from '@prisma/client';
import { PrismaService } from '@libs/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { CoachChatRoomResponseDto } from './dto/coach-chat-room-response.dto';
import { CreateChatRoomResponseDto } from './dto/create-chat-room-response.dto';
import { UserChatRoomResponseDto } from './dto/user-chat-room-response.dto';
import { ChatMessageResponseDto } from './dto/chat-message-response.dto';
import { EndChatRoomResponseDto } from './dto/end-chat-room-response.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly prisma: PrismaService,
  ) {}

  async joinChatRoom(userId: string, joinRoomDto: JoinRoomDto): Promise<ChatRoomEntity> {
    const chatRoom = await this.chatRepository.findChatRoomById(joinRoomDto.chat_room_id);
    
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    if (!chatRoom.isActive()) {
      throw new BadRequestException('Chat room is not active');
    }

    if (chatRoom.user_id !== userId && chatRoom.coach_id !== userId) {
      throw new BadRequestException('You are not authorized to join this chat room');
    }

    return chatRoom;
  }

  async sendMessage(userId: string, sendMessageDto: SendMessageDto): Promise<ChatLineEntity> {
    const chatRoom = await this.chatRepository.findChatRoomById(sendMessageDto.chat_room_id);
    
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    if (!chatRoom.isActive()) {
      throw new BadRequestException('Chat room is not active');
    }

    if (chatRoom.user_id !== userId && chatRoom.coach_id !== userId) {
      throw new BadRequestException('You are not authorized to send messages in this chat room');
    }

    const senderType = chatRoom.user_id === userId ? 'user' : 'coach';

    const chatLine = await this.chatRepository.createChatMessage({
      chat_room_id: sendMessageDto.chat_room_id,
      sender_id: userId,
      sender_type: senderType,
      message: sendMessageDto.message,
    });

    return chatLine;
  }

  async getChatMessages(
    chatRoomId: string,
    userId: string,
    limit = 50,
    offset = 0,
  ): Promise<ChatMessageResponseDto[]> {
    const chatRoom = await this.chatRepository.findChatRoomById(chatRoomId);

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    if (chatRoom.user_id !== userId && chatRoom.coach_id !== userId) {
      throw new BadRequestException(
        'You are not authorized to view messages in this chat room',
      );
    }

    const messages = await this.chatRepository.getChatMessages(
      chatRoomId,
      limit,
      offset,
    );

    await this.chatRepository.markMessagesAsRead(chatRoomId, userId);

    return plainToInstance(ChatMessageResponseDto, messages, {
      excludeExtraneousValues: true,
    });
  }

  async createOrGetChatRoom(
    userId: string,
    coachId: string,
  ): Promise<CreateChatRoomResponseDto> {
    let chatRoom = await this.chatRepository.findChatRoomByUserAndCoach(
      userId,
      coachId,
    );

    if (!chatRoom) {
      chatRoom = await this.chatRepository.createChatRoom(userId, coachId);
    }

    return plainToInstance(CreateChatRoomResponseDto, chatRoom, {
      excludeExtraneousValues: true,
    });
  }

  async endChatRoom(
    chatRoomId: string,
    userId: string,
  ): Promise<EndChatRoomResponseDto> {
    const chatRoom = await this.chatRepository.findChatRoomById(chatRoomId);

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    if (chatRoom.user_id !== userId && chatRoom.coach_id !== userId) {
      throw new BadRequestException(
        'You are not authorized to end this chat room',
      );
    }

    if (chatRoom.isEnded()) {
      throw new BadRequestException('Chat room is already ended');
    }

    const endedChatRoom = await this.chatRepository.endChatRoom(chatRoomId);

    return plainToInstance(EndChatRoomResponseDto, endedChatRoom, {
      excludeExtraneousValues: true,
    });
  }

  async getUserChatRooms(userId: string): Promise<UserChatRoomResponseDto[]> {
    const chatRooms = await this.chatRepository.getUserChatRooms(userId);
    return plainToInstance(UserChatRoomResponseDto, chatRooms, {
      excludeExtraneousValues: true,
    });
  }

  async getCoachChatRooms(coachId: string): Promise<any[]> {
    return await this.chatRepository.getCoachChatRooms(coachId);
  }

  async getCoachChatRoomsForUser(
    userId: string,
  ): Promise<CoachChatRoomResponseDto[]> {
    const coach = await this.prisma.coaches.findFirst({
      where: { user_id: userId },
    });
    if (!coach) {
      throw new NotFoundException('Coach not found for the current user.');
    }
    const chatRooms = await this.getCoachChatRooms(coach.id);
    return plainToInstance(CoachChatRoomResponseDto, chatRooms, {
      excludeExtraneousValues: true,
    });
  }
} 
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { SendMessageDto } from './schemas/send-message.schema';
import { JoinRoomDto } from './schemas/join-room.schema';
import { WsException } from '@nestjs/websockets';
import { PrismaService } from '@libs/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { CoachChatRoomResponseDto } from './dto/coach-chat-room-response.dto';
import { CreateChatRoomResponseDto } from './dto/create-chat-room-response.dto';
import { UserChatRoomResponseDto } from './dto/user-chat-room-response.dto';
import { ChatMessageResponseDto } from './dto/chat-message-response.dto';
import { EndChatRoomResponseDto } from './dto/end-chat-room-response.dto';
import { LiveKitService } from '@libs/livekit/livekit.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly prisma: PrismaService,
    private readonly livekitService: LiveKitService,
  ) {}

  async joinChatRoom(userId: string, joinRoomDto: JoinRoomDto): Promise<CreateChatRoomResponseDto> {
    const chatRoom = await this.chatRepository.findChatRoomById(joinRoomDto.chat_room_id);
    
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    if (!(chatRoom.status === 'active' && !chatRoom.deleted_at)) {
      throw new BadRequestException('Chat room is not active');
    }

    const coach = await this.chatRepository.findCoachByUserId(userId);
    if (chatRoom.user_id !== userId && chatRoom.coach_id !== coach?.id) {
      throw new BadRequestException(
        'You are not authorized to view messages in this chat room',
      );
    }

    return plainToInstance(CreateChatRoomResponseDto, chatRoom, { excludeExtraneousValues: true });
  }

  async sendMessage(userId: string, sendMessageDto: SendMessageDto): Promise<ChatMessageResponseDto> {
    const chatRoom = await this.chatRepository.findChatRoomById(sendMessageDto.chat_room_id);
    
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    if (!(chatRoom.status === 'active' && !chatRoom.deleted_at)) {
      throw new BadRequestException('Chat room is not active');
    }

    const coach = await this.chatRepository.findCoachByUserId(userId);
    if (chatRoom.user_id !== userId && chatRoom.coach_id !== coach?.id) {
      throw new BadRequestException(
        'You are not authorized to view messages in this chat room',
      );
    }

    const senderType = chatRoom.user_id === userId ? 'user' : 'coach';

    const chatLine = await this.chatRepository.createChatMessage({
      chat_room_id: sendMessageDto.chat_room_id,
      sender_id: userId,
      sender_type: senderType,
      message: sendMessageDto.message,
    });

    return plainToInstance(ChatMessageResponseDto, chatLine, { excludeExtraneousValues: true });
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

    const coach = await this.chatRepository.findCoachByUserId(userId);
    if (chatRoom.user_id !== userId && chatRoom.coach_id !== coach?.id) {
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

  async prepareVideoCall(currentUserId: string, currentUsername: string, chatRoomId: string) {
    const chatRoom = await this.chatRepository.findChatRoomById(chatRoomId);
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    let otherParticipantUserId: string;

    if (chatRoom.user_id === currentUserId) {
      const coach = await this.prisma.coaches.findUnique({
        where: { id: chatRoom.coach_id },
      });
      if (!coach) {
        throw new NotFoundException('Coach participant not found');
      }
      otherParticipantUserId = coach.user_id;
    } else {
      const coachAsUser = await this.prisma.coaches.findFirst({
        where: { user_id: currentUserId },
      });
      if (coachAsUser?.id !== chatRoom.coach_id) {
        throw new Error('You are not the coach of this room.');
      }
      otherParticipantUserId = chatRoom.user_id;
    }

    const otherUser = await this.chatRepository.findUserById(otherParticipantUserId);
    if (!otherUser) {
      throw new NotFoundException('Other participant user not found');
    }

    const token = await this.livekitService.createToken(
      chatRoomId,
      currentUsername,
    );

    return { token, otherUser };
  }

  async initiateVideoCall(userId: string, username: string, chatRoomId: string) {
    const chatRoom = await this.chatRepository.findChatRoomById(chatRoomId);
    if (!chatRoom) {
      throw new WsException('Chat room not found');
    }

    const coach = await this.prisma.coaches.findFirst({
      where: { user_id: userId },
    });

    const isParticipant =
      coach?.id === chatRoom.coach_id || userId === chatRoom.user_id;
    if (!isParticipant) {
      throw new WsException('You are not a participant in this chat room.');
    }

    let otherParticipantUserId: string;
    
    if (userId === chatRoom.user_id) {
      const coachUser = await this.prisma.coaches.findUnique({
        where: { id: chatRoom.coach_id },
      });
      
      if (!coachUser) {
        throw new WsException('Coach not found for this chat room');
      }
      
      otherParticipantUserId = coachUser.user_id; 
    } else {
      otherParticipantUserId = chatRoom.user_id;
    }

    if (!otherParticipantUserId) {
      throw new WsException('Could not find the other participant in the room.');
    }

    const token = await this.livekitService.createToken(chatRoomId, username);

    return { token, otherParticipantUserId };
  }

  async getJoinCallToken( username: string, chatRoomId: string) {
    return this.livekitService.createToken(chatRoomId, username);
  }

  async getChatLineCountBetweenUserAndCoach(userId: string, coachId: string): Promise<number> {
    const chatRoom = await this.chatRepository.findChatRoomByUserAndCoach(userId, coachId);
    if (!chatRoom) return 0;

    const count = await this.prisma.chat_lines.count({
      where: {
        chat_room_id: chatRoom.id,
        deleted_at: null,
      },
    });
    return count;
  }
}

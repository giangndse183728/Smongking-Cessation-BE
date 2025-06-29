import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { ChatRoomEntity } from './entities/chat-room.entity';
import { ChatLineEntity } from './entities/chat-line.entity';
import { SendMessageDto } from './schemas/send-message.schema';
import { JoinRoomDto } from './schemas/join-room.schema';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

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

  async getChatMessages(chatRoomId: string, userId: string, limit: number = 50, offset: number = 0): Promise<ChatLineEntity[]> {
    const chatRoom = await this.chatRepository.findChatRoomById(chatRoomId);
    
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    if (chatRoom.user_id !== userId && chatRoom.coach_id !== userId) {
      throw new BadRequestException('You are not authorized to view messages in this chat room');
    }

    const messages = await this.chatRepository.getChatMessages(chatRoomId, limit, offset);
    
    await this.chatRepository.markMessagesAsRead(chatRoomId, userId);

    return messages;
  }

  async createOrGetChatRoom(userId: string, coachId: string): Promise<ChatRoomEntity> {
    let chatRoom = await this.chatRepository.findChatRoomByUserAndCoach(userId, coachId);
    
    if (!chatRoom) {
      chatRoom = await this.chatRepository.createChatRoom(userId, coachId);
    }

    return chatRoom;
  }

  async endChatRoom(chatRoomId: string, userId: string): Promise<ChatRoomEntity> {
    const chatRoom = await this.chatRepository.findChatRoomById(chatRoomId);
    
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    if (chatRoom.user_id !== userId && chatRoom.coach_id !== userId) {
      throw new BadRequestException('You are not authorized to end this chat room');
    }

    if (chatRoom.isEnded()) {
      throw new BadRequestException('Chat room is already ended');
    }

    return await this.chatRepository.endChatRoom(chatRoomId);
  }

  async getUserChatRooms(userId: string): Promise<ChatRoomEntity[]> {
    return await this.chatRepository.getUserChatRooms(userId);
  }

  async getCoachChatRooms(coachId: string): Promise<ChatRoomEntity[]> {
    return await this.chatRepository.getCoachChatRooms(coachId);
  }
} 
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { ChatRoomEntity } from './entities/chat-room.entity';
import { ChatLineEntity } from './entities/chat-line.entity';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findChatRoomById(chatRoomId: string): Promise<ChatRoomEntity | null> {
    const chatRoom = await this.prisma.chat_rooms.findFirst({
      where: { id: chatRoomId, deleted_at: null },
    });
    return chatRoom ? new ChatRoomEntity(chatRoom) : null;
  }

  async findChatRoomByUserAndCoach(userId: string, coachId: string): Promise<ChatRoomEntity | null> {
    const chatRoom = await this.prisma.chat_rooms.findFirst({
      where: { 
        user_id: userId, 
        coach_id: coachId, 
        deleted_at: null,
        status: 'active'
      },
    });
    return chatRoom ? new ChatRoomEntity(chatRoom) : null;
  }

  async createChatRoom(userId: string, coachId: string): Promise<ChatRoomEntity> {
    const chatRoom = await this.prisma.chat_rooms.create({
      data: {
        user_id: userId,
        coach_id: coachId,
        status: 'active',
        started_at: new Date(),
      },
    });
    return new ChatRoomEntity(chatRoom);
  }

  async getChatMessages(chatRoomId: string, limit: number = 50, offset: number = 0): Promise<ChatLineEntity[]> {
    const messages = await this.prisma.chat_lines.findMany({
      where: { 
        chat_room_id: chatRoomId, 
        deleted_at: null 
      },
      orderBy: { sent_at: 'desc' },
      take: limit,
      skip: offset,
    });
    return messages.map(msg => new ChatLineEntity(msg));
  }

  async createChatMessage(data: {
    chat_room_id: string;
    sender_id: string;
    sender_type: string;
    message: string;
  }): Promise<ChatLineEntity> {
    const chatLine = await this.prisma.chat_lines.create({
      data: {
        ...data,
        sent_at: new Date(),
        is_read: false,
      },
    });
    return new ChatLineEntity(chatLine);
  }

  async markMessagesAsRead(chatRoomId: string, userId: string): Promise<void> {
    await this.prisma.chat_lines.updateMany({
      where: {
        chat_room_id: chatRoomId,
        sender_id: { not: userId },
        is_read: false,
        deleted_at: null,
      },
      data: {
        is_read: true,
        updated_at: new Date(),
      },
    });
  }

  async endChatRoom(chatRoomId: string): Promise<ChatRoomEntity> {
    const chatRoom = await this.prisma.chat_rooms.update({
      where: { id: chatRoomId },
      data: {
        status: 'ended',
        ended_at: new Date(),
        updated_at: new Date(),
      },
    });
    return new ChatRoomEntity(chatRoom);
  }

  async getUserChatRooms(userId: string): Promise<any[]> {
    const chatRooms = await this.prisma.chat_rooms.findMany({
      where: { 
        user_id: userId, 
        deleted_at: null 
      },
      include: {
        coaches: {
          include: {
            users: {
              select: {
                id: true,
                username: true,
                avatar: true,
                email: true,
              }
            }
          }
        }
      },
      
      orderBy: { updated_at: 'desc' },
    });
    return chatRooms;
  }

  async getCoachChatRooms(coachId: string): Promise<any[]> {
    const chatRooms = await this.prisma.chat_rooms.findMany({
      where: { 
        coach_id: coachId, 
        deleted_at: null 
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
          }
        },
   
      },
      orderBy: { updated_at: 'desc' },
    });
    return chatRooms;
  }

  async findCoachByUserId(userId: string) {
    return this.prisma.coaches.findFirst({ where: { user_id: userId } });
  }

  async findUserById(userId: string) {
    return this.prisma.users.findUnique({ where: { id: userId } });
  }
} 
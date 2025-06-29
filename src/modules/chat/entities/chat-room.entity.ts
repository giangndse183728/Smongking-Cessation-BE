import { chat_rooms } from '@prisma/client';

export class ChatRoomEntity implements chat_rooms {
  id: string;
  user_id: string;
  coach_id: string;
  started_at: Date | null;
  ended_at: Date | null;
  status: string | null;
  created_at: Date | null;
  created_by: string | null;
  updated_at: Date | null;
  updated_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;

  constructor(partial: any) {
    Object.assign(this, partial);
  }

  isActive(): boolean {
    return this.status === 'active' && !this.deleted_at;
  }

  isEnded(): boolean {
    return this.ended_at !== null;
  }
} 
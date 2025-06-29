import { chat_lines } from '@prisma/client';

export class ChatLineEntity implements chat_lines {
  id: string;
  chat_room_id: string;
  sender_id: string;
  sender_type: string;
  message: string;
  sent_at: Date | null;
  is_read: boolean | null;
  created_at: Date | null;
  created_by: string | null;
  updated_at: Date | null;
  updated_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;

  constructor(partial: any) {
    Object.assign(this, partial);
  }

  isFromUser(): boolean {
    return this.sender_type === 'user';
  }

  isFromCoach(): boolean {
    return this.sender_type === 'coach';
  }

  isRead(): boolean {
    return this.is_read === true;
  }
} 
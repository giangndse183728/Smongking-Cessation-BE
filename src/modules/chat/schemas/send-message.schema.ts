import { z } from 'zod';

export const sendMessageSchema = z.object({
  chat_room_id: z.string().uuid(),
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
});

export type SendMessageDto = z.infer<typeof sendMessageSchema>; 
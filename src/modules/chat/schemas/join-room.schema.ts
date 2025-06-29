import { z } from 'zod';

export const joinRoomSchema = z.object({
  chat_room_id: z.string().uuid(),
});

export type JoinRoomDto = z.infer<typeof joinRoomSchema>; 
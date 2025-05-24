import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { MOTIVATION_MESSAGES } from '@common/constants/messages';

export const sendMessageSchema = z
  .object({
    message: z
      .string({
        required_error: MOTIVATION_MESSAGES.MESSAGE_IS_REQUIRED,
        invalid_type_error: MOTIVATION_MESSAGES.MESSAGE_MUST_BE_STRING,
      })
      .min(1, MOTIVATION_MESSAGES.MESSAGE_CANNOT_BE_EMPTY)
      .max(500, MOTIVATION_MESSAGES.MESSAGE_TOO_LONG),
  })
  .strict();

export class SendMessageDto extends createZodDto(sendMessageSchema) {
  @ApiProperty({
    description: 'The message to send to the AI',
    example: 'I feel like smoking today, what should I do?',
  })
  message: string;
}

export const chatResponseSchema = z
  .object({
    message: z.string(),
  })
  .strict();

export class ChatResponseDto extends createZodDto(chatResponseSchema) {
  @ApiProperty({
    description: 'The AI response message',
    example: 'Remember why you started this journey. Take deep breaths and stay strong!',
  })
  message: string;
} 
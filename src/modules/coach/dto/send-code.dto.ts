import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SendCodeSchema = z.object({
  email: z.string().email(),
  callbackUrl: z.string().url().optional(),
});

export class SendCodeDto extends createZodDto(SendCodeSchema) {} 
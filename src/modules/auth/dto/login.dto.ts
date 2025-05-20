import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDtoSwagger {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}).strict(); 

export type LoginDto = z.infer<typeof loginSchema>; 
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { createCoachSchema } from '../schemas/create-coach.schema';

export class CreateCoachDto extends createZodDto(createCoachSchema) {}

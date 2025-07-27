import { createZodDto } from 'nestjs-zod';
import { createCoachSchema } from '../schemas/create-coach.schema';

export class CreateCoachDto extends createZodDto(createCoachSchema) {}

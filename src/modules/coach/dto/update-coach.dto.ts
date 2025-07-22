import { createZodDto } from 'nestjs-zod';
import { updateCoachProfileSchema } from '../schemas/create-coach-profile.schema';

export class UpdateCoachDto extends createZodDto(updateCoachProfileSchema) {}
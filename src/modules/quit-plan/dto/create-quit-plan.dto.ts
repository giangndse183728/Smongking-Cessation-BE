import { createZodDto } from 'nestjs-zod';
import { createQuitPlanSchema } from '../schemas/quit-plan.schema';

export class CreateQuitPlanDto extends createZodDto(createQuitPlanSchema) {

}

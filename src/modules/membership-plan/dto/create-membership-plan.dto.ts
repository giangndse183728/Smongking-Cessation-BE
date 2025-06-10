import { createMembershipPlanSchema } from '../schemas/create-membership-plan.schema';
import { createZodDto } from 'nestjs-zod';

export class CreateMembershipPlanDto extends createZodDto(createMembershipPlanSchema) {} 
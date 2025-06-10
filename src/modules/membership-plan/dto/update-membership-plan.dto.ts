import { updateMembershipPlanSchema } from '../schemas/update-membership-plan.schema';
import { createZodDto } from 'nestjs-zod';

export class UpdateMembershipPlanDto extends createZodDto(updateMembershipPlanSchema) {} 
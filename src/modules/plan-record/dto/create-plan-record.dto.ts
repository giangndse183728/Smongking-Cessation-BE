import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createQuitPlanRecordSchema = z.object({
  cigarette_smoke: z.number().min(0).optional(),
  craving_level: z.number().min(0).max(10).optional(),
  health_status: z.string().optional(),
  record_date: z.date().default(() => new Date()),
});

export class CreateQuitPlanRecordDto extends createZodDto(
  createQuitPlanRecordSchema,
) {}

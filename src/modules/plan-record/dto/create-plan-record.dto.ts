import {
  QUIT_PLAN__RECORD_MESSAGES,
  USERS_MESSAGES,
} from '@common/constants/messages';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createQuitPlanRecordSchema = z.object({
  cigarette_smoke: z.number().min(0).optional(),
  craving_level: z.number().min(0).max(10).optional(),
  health_status: z.string().optional(),
  record_date: z
    .string({
      required_error: QUIT_PLAN__RECORD_MESSAGES.RECORD_DATE_IS_REQUIRED,
      invalid_type_error:
        QUIT_PLAN__RECORD_MESSAGES.RECORD_DATE_MUST_BE_VALID_FORMAT,
    })
    .refine((value: string) => !isNaN(Date.parse(value)), {
      message: QUIT_PLAN__RECORD_MESSAGES.RECORD_DATE_MUST_BE_VALID_FORMAT,
    }),
});

export class CreateQuitPlanRecordDto extends createZodDto(
  createQuitPlanRecordSchema,
) {}

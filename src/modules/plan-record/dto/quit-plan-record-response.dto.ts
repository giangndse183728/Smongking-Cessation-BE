import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QuitPlanRecordResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  user_id: string;

  @Expose()
  @ApiProperty()
  plan_id: string;

  @Expose()
  @ApiProperty()
  phase_id: string;

  @Expose()
  @ApiProperty()
  cigarette_smoke: number;

  @Expose()
  @ApiProperty()
  money_saved: number;

  @Expose()
  @ApiProperty()
  craving_level: number;

  @Expose()
  @ApiProperty()
  health_status: string;

  @Expose()
  @ApiProperty()
  record_date: Date;

  @Expose()
  @ApiProperty()
  created_at: Date;

  @Expose()
  @ApiProperty()
  updated_at: Date;

  @Expose()
  @ApiProperty()
  is_pass: boolean;

  @Expose()
  @ApiProperty()
  craving_level_text: string;

  @Expose()
  @ApiProperty()
  health_status_text: string;

  @Expose()
  @ApiProperty()
  isToday: boolean;

  @Expose()
  @ApiProperty()
  isValid: boolean;

  @Expose()
  @ApiProperty()
  isPassing: boolean;

  @Expose()
  @ApiProperty()
  isFailing: boolean;
} 
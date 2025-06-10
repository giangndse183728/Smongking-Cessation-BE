import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { QuitPlanPhaseResponseDto } from './quit-plan-phase-response.dto';
import { QuitPlanRecordResponseDto } from '../../plan-record/dto/quit-plan-record-response.dto';

export class QuitPlanResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  user_id: string;

  @Expose()
  @ApiProperty()
  reason: string;

  @Expose()
  @ApiProperty()
  plan_type: string;

  @Expose()
  @ApiProperty()
  start_date: Date;

  @Expose()
  @ApiProperty()
  expected_end_date: Date;

  @Expose()
  @ApiProperty()
  totalDays: number;

  @Expose()
  @ApiProperty()
  total_phases: number;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty()
  created_at: Date;

  @Expose()
  @ApiProperty()
  updated_at: Date;

  @Expose()
  @ApiProperty({ type: [QuitPlanPhaseResponseDto] })
  @Type(() => QuitPlanPhaseResponseDto)
  phases: QuitPlanPhaseResponseDto[];

  @Expose()
  @ApiProperty()
  ai_generated: boolean;
} 
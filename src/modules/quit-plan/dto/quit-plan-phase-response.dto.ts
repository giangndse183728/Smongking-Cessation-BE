import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QuitPlanPhaseResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  plan_id: string;

  @Expose()
  @ApiProperty()
  user_id: string;

  @Expose()
  @ApiProperty()
  phase_number: number;

  @Expose()
  @ApiProperty()
  limit_cigarettes_per_day: number;

  @Expose()
  @ApiProperty()
  start_date: Date;

  @Expose()
  @ApiProperty()
  expected_end_date: Date;

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
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  isPending: boolean;

  @Expose()
  @ApiProperty()
  isCompleted: boolean;

  @Expose()
  @ApiProperty()
  isFailed: boolean;

  @Expose()
  @ApiProperty()
  duration: number;

  @Expose()
  @ApiProperty()
  remainingDays: number;

  @Expose()
  @ApiProperty()
  isOverdue: boolean;

  @Expose()
  @ApiProperty()
  statistics: {
    totalCigarettesSmoked: number;
    totalMoneySaved: number;
    averageCravingLevel: number;
    successRate: number;
  };
} 
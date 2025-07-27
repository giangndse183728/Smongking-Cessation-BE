import { Expose, Transform } from 'class-transformer';

export class MembershipPlanResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  features: string[];

  @Expose()
  price: number;

  @Expose()
  duration_days: number;

  @Expose()
  is_active: boolean;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  created_at: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  updated_at: Date;
} 
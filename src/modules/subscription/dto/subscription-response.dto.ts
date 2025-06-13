import { Expose, Transform } from 'class-transformer';

export class SubscriptionResponseDto {
  @Expose()
  id: string;

  @Expose()
  user_id: string;

  @Expose()
  plan_id: string;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  start_date: Date;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  end_date: Date;

  @Expose()
  is_active: boolean;

  @Expose()
  payment_status: string;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  created_at: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  updated_at: Date;
} 
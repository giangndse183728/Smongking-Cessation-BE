import { Expose, Transform } from 'class-transformer';
import { MembershipPlan } from '@modules/membership-plan/entities/membership-plan.entity';

export class SubscriptionResponseDto {
  @Expose()
  id: string;

  @Expose()
  user_id: string;

  @Expose()
  membership_plan: MembershipPlan;

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
import { Expose, Exclude, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class SmokingHabitResponseDto {
  @Expose()
  cigarettes_per_pack: number;

  @Expose()
  price_per_pack: number;

  @Expose()
  cigarettes_per_day: number;

  @Expose()
  smoking_years: number;

  @Expose()
  triggers: string[];

  @Expose()
  health_issues: string;

  @Expose()
  ai_feedback: string | null;

  @Expose()
  created_at: string | null;

  @Expose()
  daily_cost: number;

  toJSON() {
    return {
      ...this,
      daily_cost: this.daily_cost,
    };
  }
}

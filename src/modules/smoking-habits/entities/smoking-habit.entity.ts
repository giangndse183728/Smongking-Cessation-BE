import { smoking_habits } from '@prisma/client';

export class SmokingHabitEntity {
  id: string;
  user_id: string;
  cigarettes_per_pack: number;
  price_per_pack: number;
  cigarettes_per_day: number;
  smoking_years: number;
  triggers: string[];
  health_issues: string;
  ai_feedback: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;

  constructor(partial: Partial<SmokingHabitEntity>) {
    Object.assign(this, partial);
  }

  get daily_cost(): number {
    return (
      (this.cigarettes_per_day / this.cigarettes_per_pack) * this.price_per_pack
    );
  }

  static toEntity(data: smoking_habits): SmokingHabitEntity {
    return new SmokingHabitEntity({
      ...data,
      price_per_pack: Number(data.price_per_pack),
      created_at: data.created_at?.toISOString() || '',
      updated_at: data.updated_at?.toISOString() || '',
      deleted_at: data.deleted_at?.toISOString() || null,
    });
  }
}

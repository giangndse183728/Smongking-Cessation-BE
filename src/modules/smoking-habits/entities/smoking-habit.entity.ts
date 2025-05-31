import { Decimal } from '@prisma/client/runtime/library';
import { SmokingHabitType } from '../schemas/smoking-habit.schema';

export class SmokingHabitEntity implements SmokingHabitType  {
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

  constructor(partial: any) {
    if (partial.price_per_pack instanceof Decimal) {
      partial.price_per_pack = partial.price_per_pack.toNumber();
    }
    Object.assign(this, partial);
  }

  get daily_cost(): number {
    return (
      (this.cigarettes_per_day / this.cigarettes_per_pack) * this.price_per_pack
    );
  }

  
}

import { Expose, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export class MembershipPlan {
  id: string;
  name: string;
  description: string | null;
  features: string[];
  price: number;
  duration_days: number;
  is_active: boolean | null;
  created_at: Date | null;
  created_by: string | null;
  updated_at: Date | null;
  updated_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;

  constructor(partial: any) {
    if (partial.price instanceof Decimal) {
      partial.price = partial.price.toNumber();
    }
    Object.assign(this, partial);
  }
} 
import { quit_plan_records } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class QuitPlanRecord implements quit_plan_records {
  id: string;
  user_id: string;
  plan_id: string;
  phase_id: string;
  cigarette_smoke: number | null;
  money_saved: Decimal;
  craving_level: number | null;
  health_status: string | null;
  is_pass: boolean;
  record_date: Date;
  created_at: Date | null;
  created_by: string | null;
  updated_at: Date | null;
  updated_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;

  constructor(partial: Partial<QuitPlanRecord>) {
    Object.assign(this, partial);
  }

  // Business logic methods
  static calculateMoneySaved(
    cigarettesSmoked: number,
    originalCigarettesPerDay: number,
    pricePerPack: number,
    cigarettesPerPack: number,
  ): number {
    if (cigarettesPerPack <= 0 || pricePerPack < 0) return 0;

    const cigarettesSaved = Math.max(
      0,
      originalCigarettesPerDay - cigarettesSmoked,
    );
    const costPerCigarette = pricePerPack / cigarettesPerPack;
    return Math.round(cigarettesSaved * costPerCigarette * 100) / 100;
  }

  static calculateIsPass(
    cigarettesSmoked: number,
    limitCigarettesPerDay: number | null,
  ): boolean {
    // If no limit is set, consider it as passing
    if (limitCigarettesPerDay === null || limitCigarettesPerDay === undefined) {
      return true;
    }

    // Pass if cigarettes smoked is within or equal to the limit
    return cigarettesSmoked <= limitCigarettesPerDay;
  }

  isToday(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recordDate = new Date(this.record_date);
    recordDate.setHours(0, 0, 0, 0);

    return recordDate.getTime() === today.getTime();
  }

  isFutureDate(): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const recordDate = new Date(this.record_date);
    recordDate.setHours(0, 0, 0, 0);

    return recordDate > currentDate;
  }

  getCravingLevelText(): string {
    if (!this.craving_level) return 'Not recorded';

    const levels = {
      1: 'Very Low',
      2: 'Low',
      3: 'Moderate',
      4: 'High',
      5: 'Very High',
    };

    return levels[this.craving_level as keyof typeof levels] || 'Unknown';
  }

  getHealthStatusText(): string {
    return this.health_status || 'Not recorded';
  }

  getCigarettesSmoked(): number {
    return Math.max(0, this.cigarette_smoke || 0);
  }

  getMoneySavedAmount(): number {
    return Math.max(0, Number(this.money_saved) || 0);
  }

  isValid(): boolean {
    return !this.deleted_at && this.record_date && !this.isFutureDate();
  }

  isPassing(): boolean {
    return this.is_pass === true;
  }

  isFailing(): boolean {
    return this.is_pass === false;
  }
}

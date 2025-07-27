import { quit_plans } from '@prisma/client';
import { QuitPlanPhase } from './quit-plan-phase.entity';
import { QuitPlanRecord } from '../../plan-record/entities/quit-plan-record.entity';

export class QuitPlan implements quit_plans {
  id: string;
  user_id: string;
  reason: string;
  plan_type: string | null;
  start_date: Date;
  expected_end_date: Date | null;
  totalDays: number;
  total_phases: number;
  status: string | null;
  created_at: Date | null;
  created_by: string | null;
  updated_at: Date | null;
  updated_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;

  constructor(partial: Partial<QuitPlan>) {
    Object.assign(this, partial);
  }

  calculateProgress(phases: QuitPlanPhase[], records: QuitPlanRecord[]) {
    const totalPhases = phases.length;
    const passPhases = phases.filter(
      (phase) => phase.status === 'COMPLETED' || phase.status === 'FAILED',
    ).length;
    const completedPhases = phases.filter(
      (phase) => phase.status === 'COMPLETED',
    ).length;
    const activeRecords = records.filter(record => !record.deleted_at);
    const totalRecords = activeRecords.length;

    return {
      totalPhases,
      completedPhases,
      passPhases,
      totalRecords,
      progressPercentage:
        totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0,
    };
  }

  calculateStatistics(allRecords: QuitPlanRecord[]) {
    const activeRecords = allRecords.filter(record => !record.deleted_at);
    
    const totalMoneySaved = activeRecords.reduce(
      (sum, record) => sum + Number(record.money_saved || 0),
      0,
    );
    const totalDaysRecorded = activeRecords.length;
    const averageCigarettesPerDay = totalDaysRecorded > 0
      ? Math.round(
          activeRecords.reduce(
            (sum, record) => sum + (record.cigarette_smoke || 0),
            0,
          ) / totalDaysRecorded,
        )
      : 0;

    return {
      totalMoneySaved,
      totalDaysRecorded,
      averageCigarettesPerDay,
    };
  }

  getCurrentPhase(phases: QuitPlanPhase[]): QuitPlanPhase | null {
    const currentDate = new Date();
    return phases.find(phase => phase.isCurrentPhase()) || null;
  }
}
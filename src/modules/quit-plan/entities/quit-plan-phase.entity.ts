import { quit_plan_phases } from '@prisma/client';
import { QuitPlanRecord } from '../../plan-record/entities/quit-plan-record.entity';
import { getCurrentDateInVietnam } from '@common/utils/timezone.utils';

export class QuitPlanPhase implements quit_plan_phases {
  id: string;
  plan_id: string;
  user_id: string;
  phase_number: number | null;
  limit_cigarettes_per_day: number | null;
  start_date: Date;
  expected_end_date: Date | null;
  status: string | null;
  created_at: Date | null;
  created_by: string | null;
  updated_at: Date | null;
  updated_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;

  constructor(partial: Partial<QuitPlanPhase>) {
    Object.assign(this, partial);
  }
  
  // Business logic methods
  isCurrentPhase(): boolean {
    if (this.deleted_at) return false;
    
    const currentDate = getCurrentDateInVietnam();
    const startDate = new Date(this.start_date);
    const endDate = this.expected_end_date ? new Date(this.expected_end_date) : null;
    
    return startDate <= currentDate && (!endDate || currentDate <= endDate) ;
  }

  isProgress(): boolean {
    return this.status === 'IN-PROGRESS' && !this.deleted_at;
  }

  isCompleted(): boolean {
    return this.status === 'COMPLETED';
  }

  isFailed(): boolean {
    return this.status === 'FAILED';
  }

  getCalculatedStatus(records: QuitPlanRecord[]): string {
    const today = getCurrentDateInVietnam();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(this.start_date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = this.expected_end_date ? new Date(this.expected_end_date) : null;
    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }

    // Check if phase has ended
    if (endDate && today > endDate) {
      // If phase has ended, check if it should be failed
      if (this.shouldBeFailed(records)) {
        return 'FAILED';
      } else {
        return 'COMPLETED';
      }
    }

    if (today < startDate) {
      return 'PENDING';
    }

    if (today >= startDate && (!endDate || today <= endDate)) {
      return 'IN-PROGRESS';
    }

    return this.status || 'PENDING';
  }

  getDuration(): number {
    if (!this.expected_end_date) return 0;
    
    const start = new Date(this.start_date);
    const end = new Date(this.expected_end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getRemainingDays(): number {
    if (!this.expected_end_date || this.isCompleted()) return 0;
    
    const currentDate = getCurrentDateInVietnam();
    const endDate = new Date(this.expected_end_date);
    
    if (currentDate > endDate) return 0;
    
    const diffTime = endDate.getTime() - currentDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getExpectedRecordDates(): Date[] {
    const dates: Date[] = [];
    const startDate = new Date(this.start_date);
    const today = getCurrentDateInVietnam();
    today.setHours(0, 0, 0, 0);
  
    const rawEndDate = this.expected_end_date ? new Date(this.expected_end_date) : getCurrentDateInVietnam();
    const endDate = rawEndDate > today ? today : rawEndDate;
  
    let currentDateIter = new Date(startDate);
    currentDateIter.setHours(0, 0, 0, 0);
  
    while (currentDateIter <= endDate) {
      dates.push(new Date(currentDateIter));
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }
  
    return dates;
  }

  // Calculate failure rate for this phase
  calculateFailureRate(records: QuitPlanRecord[]): number {
    const expectedDates = this.getExpectedRecordDates();
    const recordsByDate = new Map<string, QuitPlanRecord>();
    
    records.forEach(record => {
      if (!record.deleted_at) {
        const dateKey = new Date(record.record_date).toDateString();
        recordsByDate.set(dateKey, record);
      }
    });
    
    let failedDays = 0;
    
    expectedDates.forEach(date => {
      const dateKey = date.toDateString();
      const record = recordsByDate.get(dateKey);
      
      if (!record) {
        // No record for this day = failed
        failedDays++;
      } else {
        // Check if record passes the cigarette limit
        const cigarettesSmoked = record.getCigarettesSmoked();
        const isPass = QuitPlanRecord.calculateIsPass(cigarettesSmoked, this.limit_cigarettes_per_day);
        if (!isPass) {
          failedDays++;
        }
      }
    });
    
    const totalExpectedDays = expectedDates.length;
    return totalExpectedDays > 0 ? (failedDays / totalExpectedDays) * 100 : 0;
  }

  // Check if phase should be marked as failed (20% or more failure rate)
  shouldBeFailed(records: QuitPlanRecord[]): boolean {
    const failureRate = this.calculateFailureRate(records);
    return failureRate >= 20;
  }

  // Get phase statistics
  getPhaseStatistics(records: QuitPlanRecord[]) {
    const expectedDates = this.getExpectedRecordDates();
    const recordsByDate = new Map<string, QuitPlanRecord>();
    
    records.forEach(record => {
      if (!record.deleted_at) {
        const dateKey = new Date(record.record_date).toDateString();
        recordsByDate.set(dateKey, record);
      }
    });
    
    let recordedDays = 0;
    let passedDays = 0;
    let failedDays = 0;
    let missedDays = 0;
    
    expectedDates.forEach(date => {
      const dateKey = date.toDateString();
      const record = recordsByDate.get(dateKey);
      
      if (!record) {
        missedDays++;
        failedDays++;
      } else {
        recordedDays++;
        const cigarettesSmoked = record.getCigarettesSmoked();
        const isPass = QuitPlanRecord.calculateIsPass(cigarettesSmoked, this.limit_cigarettes_per_day);
        if (isPass) {
          passedDays++;
        } else {
          failedDays++;
        }
      }
    });
    
    const totalExpectedDays = expectedDates.length;
    const failureRate = totalExpectedDays > 0 ? (failedDays / totalExpectedDays) * 100 : 0;
    
    return {
      totalExpectedDays,
      recordedDays,
      missedDays,
      passedDays,
      failedDays,
      failureRate: Math.round(failureRate * 100) / 100,
      shouldBeFailed: failureRate >= 20
    };
  }
}
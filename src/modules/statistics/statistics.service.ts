import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/prisma/prisma.service';
import { POST_STATUS } from '@common/constants/enum';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {

    const totalUsers = await this.prisma.users.count({ where: { deleted_at: null } });
  
    const totalCoaches = await this.prisma.users.count({ where: { role: 'coach', deleted_at: null } });
  
    const totalMembers = await this.prisma.users.count({ where: { isMember: true, deleted_at: null } });
 
    const moneySavedAgg = await this.prisma.quit_plan_records.aggregate({
      _sum: { money_saved: true },
      where: { deleted_at: null },
    });
    const totalMoneySaved = Number(moneySavedAgg._sum.money_saved || 0);

    const records = await this.prisma.quit_plan_records.findMany({
      where: { deleted_at: null },
      select: {
        user_id: true,
        cigarette_smoke: true,
      },
    });
   
    const habits = await this.prisma.smoking_habits.findMany({
      where: { deleted_at: null },
      select: { user_id: true, cigarettes_per_day: true },
    });
    const habitMap = new Map(habits.map(h => [h.user_id, h.cigarettes_per_day || 0]));
    let totalCigarettesNotSmoked = 0;
    for (const rec of records) {
      const original = habitMap.get(rec.user_id) || 0;
      const smoked = rec.cigarette_smoke || 0;
      const notSmoked = Math.max(0, original - smoked);
      totalCigarettesNotSmoked += notSmoked;
    }

    const totalPostsByStatus: Record<string, number> = {};
    for (const status of Object.values(POST_STATUS)) {
      totalPostsByStatus[status] = await this.prisma.posts.count({
        where: {
          status,
          deleted_at: null,
        },
      });
    }

    // Total quit plans by status
    const quitPlanStatuses = ['ACTIVE', 'COMPLETED', 'FAILED'];
    const totalQuitPlansByStatus: Record<string, number> = {};
    for (const status of quitPlanStatuses) {
      totalQuitPlansByStatus[status] = await this.prisma.quit_plans.count({
        where: {
          status,
          deleted_at: null,
        },
      });
    }

    // Total records by is_pass
    const totalRecordsByIsPass: Record<string, number> = {
      PASS: await this.prisma.quit_plan_records.count({ where: { is_pass: true, deleted_at: null } }),
      FAIL: await this.prisma.quit_plan_records.count({ where: { is_pass: false, deleted_at: null } }),
    };

    // Revenue from user subscriptions to membership
    const activeSubs = await this.prisma.user_subscriptions.findMany({
      where: {
        is_active: true,
        deleted_at: null,
        payment_status: 'PAID',
      },
      include: {
        membership_plans: true,
      },
    });
    const revenueFromMemberships = activeSubs.reduce(
      (sum, sub) => sum + Number(sub.membership_plans?.price || 0),
      0,
    );

    // Get all records for the last 12 months
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0); // January 1st of current year
    const recordsForChart = await this.prisma.quit_plan_records.findMany({
      where: {
        deleted_at: null,
        record_date: { gte: startOfYear },
      },
      select: {
        user_id: true,
        cigarette_smoke: true,
        money_saved: true,
        record_date: true,
      },
    });
    // Get all users' original cigarettes_per_day
    const habitsForChart = await this.prisma.smoking_habits.findMany({
      where: { deleted_at: null },
      select: { user_id: true, cigarettes_per_day: true },
    });
    const habitMapForChart = new Map(habitsForChart.map(h => [h.user_id, h.cigarettes_per_day || 0]));

    // Helper to get YYYY-MM (define only once)
    function getMonthKey(date: Date) {
      return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    }
    // Prepare monthly sums
    const moneySavedByMonth: { month: string, total: number }[] = [];
    const cigarettesNotSmokedByMonth: { month: string, total: number }[] = [];
    const moneyMap = new Map<string, number>();
    const cigMap = new Map<string, number>();
    for (const rec of recordsForChart) {
      const month = getMonthKey(rec.record_date);
      // Money saved
      moneyMap.set(month, (moneyMap.get(month) || 0) + Number(rec.money_saved || 0));
      // Cigarettes not smoked
      const original = habitMapForChart.get(rec.user_id) || 0;
      const smoked = rec.cigarette_smoke || 0;
      const notSmoked = Math.max(0, original - smoked);
      cigMap.set(month, (cigMap.get(month) || 0) + notSmoked);
    }
    // Fill months from January to current month
    for (let i = 0; i <= now.getMonth(); i++) {
      const d = new Date(now.getFullYear(), i, 1);
      const month = getMonthKey(d);
      moneySavedByMonth.push({ month, total: +(moneyMap.get(month) || 0) });
      cigarettesNotSmokedByMonth.push({ month, total: +(cigMap.get(month) || 0) });
    }

    // Revenue from user subscriptions to membership by month (current year)
    const subsForChart = await this.prisma.user_subscriptions.findMany({
      where: {
        is_active: true,
        deleted_at: null,
        payment_status: 'PAID',
        created_at: { gte: startOfYear },
      },
      include: {
        membership_plans: true,
      },
    });
    const revenueByMonthMap = new Map<string, number>();
    for (const sub of subsForChart) {
      if (!sub.created_at) continue;
      const month = getMonthKey(sub.created_at);
      revenueByMonthMap.set(month, (revenueByMonthMap.get(month) || 0) + Number(sub.membership_plans?.price || 0));
    }
    const revenueFromMembershipsByMonth: { month: string, total: number }[] = [];
    for (let i = 0; i <= now.getMonth(); i++) {
      const d = new Date(now.getFullYear(), i, 1);
      const month = getMonthKey(d);
      revenueFromMembershipsByMonth.push({ month, total: +(revenueByMonthMap.get(month) || 0) });
    }

    return {
      totalUsers,
      totalCoaches,
      totalMembers,
      totalMoneySaved,
      totalCigarettesNotSmoked,
      totalPostsByStatus,
      totalQuitPlansByStatus,
      totalRecordsByIsPass,
      moneySavedByMonth,
      cigarettesNotSmokedByMonth,
      revenueFromMemberships,
      revenueFromMembershipsByMonth,
    };
  }
} 
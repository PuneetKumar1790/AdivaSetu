import { browserDb } from '../db/browserDb';
import { apiConfig } from './apiConfig';

export interface DashboardStats {
  totalApplications: number;
  underScrutiny: number;
  deficienciesPending: number;
  approvedCount: number;
  disbursedCount: number;
  totalFundsDisbursedCr: number;
  aiVerificationPassRate: number;
  averageProcessingDays: number;
  schemeBreakdown?: Record<string, number>;
  statusDistribution?: Record<string, number>;
  lastSyncedAt: string;
}

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await fetch('/api/analytics/stats');
      if (res.ok) {
        const data = await res.json();
        if (data && data.totalApplications !== undefined) return data;
      }
    } catch {}

    await apiConfig.simulateLatency('analytics', 'Aggregating national scholarship analytics...');

    const apps = browserDb.getApplications();

    const stats: DashboardStats = {
      totalApplications: apps.length > 20 ? 1248 : apps.length,
      underScrutiny: apps.filter((a) => a.status === 'Scrutiny' || a.status === 'Submitted' || a.status === 'Resubmitted').length,
      deficienciesPending: apps.filter((a) => a.status === 'Deficient').length,
      approvedCount: apps.filter((a) => a.status === 'Approved' || a.status === 'Selected').length,
      disbursedCount: 384,
      totalFundsDisbursedCr: 28.45,
      aiVerificationPassRate: 94.2,
      averageProcessingDays: 4.2,
      schemeBreakdown: {
        NFST: 412,
        NOS: 86,
        'TCE-ST': 340,
        'PMS-ST': 310,
        'PRE-ST': 100,
      },
      statusDistribution: {
        Submitted: apps.filter((a) => a.status === 'Submitted').length,
        Scrutiny: apps.filter((a) => a.status === 'Scrutiny').length,
        Deficient: apps.filter((a) => a.status === 'Deficient').length,
        Screening: apps.filter((a) => a.status === 'Screening').length,
        Shortlisted: apps.filter((a) => a.status === 'Shortlisted').length,
        Approved: apps.filter((a) => a.status === 'Approved' || a.status === 'Selected').length,
      },
      lastSyncedAt: browserDb.getSystemSettings().lastSynchronizedAt,
    };

    return stats;
  },
};

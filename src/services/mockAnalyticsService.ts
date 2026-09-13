import { STATE_ANALYTICS_DATA } from '../data/stateData';

export interface DashboardKPIs {
  totalApplications: number;
  underVerification: number;
  deficientApplications: number;
  eligible: number;
  shortlisted: number;
  selected: number;
  pendingReview: number;
  fundsSanctionedCr: number;
  aiVerificationRate: number; // e.g. 96.8%
  avgProcessingDaysAI: number;
  avgProcessingDaysManual: number;
}

export const mockAnalyticsService = {
  getKPIs(): DashboardKPIs {
    return {
      totalApplications: 12482,
      underVerification: 2381,
      deficientApplications: 643,
      eligible: 8921,
      shortlisted: 2140,
      selected: 1024,
      pendingReview: 386,
      fundsSanctionedCr: 1240.5,
      aiVerificationRate: 97.4,
      avgProcessingDaysAI: 2.8,
      avgProcessingDaysManual: 44.0,
    };
  },

  getStateStats() {
    return STATE_ANALYTICS_DATA;
  },

  getSchemeBreakdown() {
    return [
      { scheme: 'NFST', name: 'National Fellowship for ST', count: 4820, percent: 38.6 },
      { scheme: 'NOS', name: 'National Overseas Scholarship', count: 1240, percent: 9.9 },
      { scheme: 'TCE-ST', name: 'Top Class Education', count: 2150, percent: 17.2 },
      { scheme: 'PMS-ST', name: 'Post-Matric Scholarship', count: 3240, percent: 26.0 },
      { scheme: 'PRE-ST', name: 'Pre-Matric Scholarship', count: 1032, percent: 8.3 },
    ];
  },

  getDeficiencyCategories() {
    return [
      { category: 'Expired Income Certificate', count: 308, percent: 48 },
      { category: 'Caste Certificate Authority / Seal Clarification', count: 141, percent: 22 },
      { category: 'Illegible / Low Resolution Marksheet Scan', count: 115, percent: 18 },
      { category: 'Bank Account Name Mismatch with Aadhaar', count: 79, percent: 12 },
    ];
  },

  getSelectionFunnel() {
    return [
      { stage: 'Applications Received', count: 12482, color: '#0D3829' },
      { stage: 'Document AI Verified', count: 10214, color: '#16533D' },
      { stage: 'Eligibility Cleared', count: 8921, color: '#2D7D5E' },
      { stage: 'Officer Scrutinized', count: 4120, color: '#D97706' },
      { stage: 'Screening Committee Shortlist', count: 2140, color: '#F59E0B' },
      { stage: 'Fellowship Sanctioned', count: 1024, color: '#059669' },
    ];
  },
};

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { analyticsService, DashboardStats } from '../../services/api/analyticsService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { SyncIndicator } from '../../components/gov/SyncIndicator';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { ErrorRetryBanner } from '../../components/common/ErrorRetryBanner';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  ChevronRight,
  Radio,
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const { applications } = useApplication();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to aggregate national dashboard statistics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Priority queue: Scrutiny / Resubmitted / Deficient
  const priorityQueue = applications.filter(
    (a) => a.status === 'Scrutiny' || a.status === 'Resubmitted' || a.status === 'Deficient'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
              Ministry Operations Portal
            </span>
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>LIVE REGISTRY SYNC</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Ministry Operations Dashboard</h1>
          <p className="text-xs text-slate-500 font-hindi">
            Scholarship & Fellowship Administration • जनजाति कार्य मंत्रालय
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SyncIndicator showLiveStream={true} onManualSync={fetchStats} />
          <Link
            to="/admin/scrutiny"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-colors shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open AI Scrutiny Queue</span>
          </Link>
        </div>
      </div>

      {error && <ErrorRetryBanner error={error} onRetry={fetchStats} />}

      {/* Top Metrics Cards with Skeleton */}
      {loading || !stats ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {stats.totalApplications.toLocaleString('en-IN')}
              </div>
              <div className="text-xs font-semibold text-slate-500">Total Applications</div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {stats.underScrutiny.toLocaleString('en-IN')}
              </div>
              <div className="text-xs font-semibold text-slate-500">Under AI / Scrutiny</div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {stats.deficienciesPending.toLocaleString('en-IN')}
              </div>
              <div className="text-xs font-semibold text-slate-500">Deficient Applications</div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {stats.approvedCount.toLocaleString('en-IN')}
              </div>
              <div className="text-xs font-semibold text-slate-500">Sanctioned / Approved</div>
            </div>
          </div>
        </div>
      )}

      {/* Secondary KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">AI Verification Pass Rate</span>
            <div className="text-xl font-black text-slate-900 font-mono">94.2%</div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
            Model v2.4 Active
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Total Direct Benefit Transfer</span>
            <div className="text-xl font-black text-emerald-800 font-mono">₹28.45 Cr</div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md">
            PFMS Linked
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Pending Officer Scrutiny</span>
            <div className="text-xl font-black text-rose-700 font-mono">{priorityQueue.length}</div>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-md animate-pulse">
            Needs Action
          </span>
        </div>
      </div>

      {/* Immediate Scrutiny Action Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Immediate Officer Scrutiny Queue (तत्काल जांच सूची)
            </h3>
            <p className="text-xs text-slate-500">
              Applications requiring human officer validation or clarification responses under Rule 14(b).
            </p>
          </div>

          <Link
            to="/admin/scrutiny"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View All Queue ({priorityQueue.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {priorityQueue.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-black text-slate-900">{item.id}</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.2 rounded border border-amber-300">
                    {item.schemeCode}
                  </span>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                <div className="text-sm font-bold text-slate-800 truncate">
                  {item.applicantName} • <span className="font-normal text-slate-600">{item.state}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>AI Score: <strong className="text-emerald-800">{item.aiScore}%</strong></span>
                  <span>•</span>
                  <span>Submitted: {formatDate(item.submittedAt)}</span>
                  <span>•</span>
                  <span>Institution: {item.formData?.institution || item.formData?.university || 'Central Tribal University'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/admin/scrutiny/${item.id}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-colors cursor-pointer"
                >
                  Scrutinize Application
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

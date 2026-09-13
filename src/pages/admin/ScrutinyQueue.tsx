import React from 'react';
import { Link } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { Sparkles, ArrowRight, ShieldCheck, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react';

export const ScrutinyQueue: React.FC = () => {
  const { applications } = useApplication();

  // Queue consists of applications in Scrutiny or Resubmitted or Deficient state
  const queue = applications.filter(
    (a) => a.status === 'Scrutiny' || a.status === 'Resubmitted' || a.status === 'Deficient'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
            Human-in-the-Loop Triage
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Officer AI Scrutiny Queue (अधिकारी संवीक्षा कतार)
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            एआई विश्लेषित एवं पुनः प्रस्तुत आवेदनों की शासकीय संवीक्षा
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
          {queue.length} Applications Requiring Officer Action
        </div>
      </div>

      {/* Queue Cards */}
      <div className="space-y-4">
        {queue.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-emerald-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-black text-slate-900">{app.id}</span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-300">
                  {app.schemeCode}
                </span>
                <StatusBadge status={app.status} size="sm" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{app.applicantName}</h3>
                <p className="text-xs text-slate-600">
                  {app.formData.tribeCommunity} ST • {app.state} • {app.formData.institution || app.formData.university}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span>Submitted: <strong>{formatDate(app.submittedAt)}</strong></span>
                <span>•</span>
                <span>AI Confidence: <strong className="text-emerald-800">{app.aiScore}%</strong></span>
                <span>•</span>
                <span>Course: <strong>{app.formData.course}</strong></span>
              </div>

              {app.status === 'Resubmitted' && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Applicant uploaded replacement document (AI re-verified 98.2% Pass)</span>
                </div>
              )}

              {app.status === 'Deficient' && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-md w-fit">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Notice dispatched: Waiting for applicant replacement certificate</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to={`/admin/scrutiny/${app.id}`}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-all shadow-sm active:scale-95"
              >
                <span>Launch AI Scrutiny Panel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplication } from '../../context/ApplicationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrencyINR, formatDate } from '../../utils/formatters';
import {
  FileCheck,
  Clock,
  AlertTriangle,
  Award,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileText,
  UploadCloud,
  Check,
  Info,
} from 'lucide-react';

export const ApplicantDashboard: React.FC = () => {
  const { user } = useAuth();
  const { applications } = useApplication();
  const navigate = useNavigate();

  // Primary application (Aarav's NFST)
  const primaryApp =
    applications.find((a) => a.id === 'ADVS-NFST-2026-00482') || applications[0];

  const totalApps = 2;
  const underReview = 1;
  const actionRequired = primaryApp?.status === 'Deficient' ? 1 : 0;
  const selectedCount = applications.filter((a) => a.status === 'Selected' || a.status === 'Approved').length;

  const trackerSteps = [
    { key: 'Application', label: 'Application', done: true },
    { key: 'Eligibility', label: 'Eligibility', done: true },
    {
      key: 'Documents',
      label: 'Documents',
      active: primaryApp?.status === 'Deficient' || primaryApp?.status === 'Verification' || primaryApp?.status === 'Resubmitted',
      done: primaryApp?.status !== 'Draft' && primaryApp?.status !== 'Verification' && primaryApp?.status !== 'Deficient',
      alert: primaryApp?.status === 'Deficient',
    },
    {
      key: 'Scrutiny',
      label: 'Scrutiny',
      active: primaryApp?.status === 'Scrutiny',
      done: primaryApp?.status === 'Screening' || primaryApp?.status === 'Shortlisted' || primaryApp?.status === 'Selected' || primaryApp?.status === 'Approved',
    },
    {
      key: 'Selection',
      label: 'Selection',
      active: primaryApp?.status === 'Screening' || primaryApp?.status === 'Shortlisted',
      done: primaryApp?.status === 'Selected' || primaryApp?.status === 'Approved',
    },
    {
      key: 'Award',
      label: 'Award',
      active: primaryApp?.status === 'Selected' || primaryApp?.status === 'Approved',
      done: primaryApp?.status === 'Approved',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner (Requirement 8) */}
      <div className="bg-gradient-to-r from-[#0D3829] via-[#16533D] to-[#0A2E22] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>National Fellowship for Scheduled Tribes (NFST)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Aarav'}
          </h1>
          <p className="text-emerald-200 text-sm font-medium">
            Your scholarship journey, simplified.
          </p>
        </div>

        {/* Subtle decorative background watermark */}
        <div className="absolute right-4 -bottom-8 opacity-10 text-white select-none pointer-events-none text-9xl font-black">
          ST
        </div>
      </div>

      {/* Prominent Application Progress Tracker (Requirement 8) */}
      {primaryApp && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs text-slate-500 font-medium">Application Reference ID</span>
              <div className="text-base font-mono font-black text-slate-900 flex items-center gap-2">
                <span>{primaryApp.id}</span>
                <span className="text-xs font-normal text-slate-500">({primaryApp.schemeCode})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">Current Status:</span>
              <StatusBadge status={primaryApp.status} size="lg" />
            </div>
          </div>

          {/* Horizontal Progress Tracker */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-6 gap-2 text-center text-xs">
              {trackerSteps.map((st, i) => (
                <div key={st.key} className="flex flex-col items-center space-y-2 relative">
                  {/* Circle indicator */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all shadow-xs ${
                      st.alert
                        ? 'bg-amber-100 text-amber-900 border-2 border-amber-500 animate-pulse'
                        : st.done
                        ? 'bg-[#0D3829] text-white'
                        : st.active
                        ? 'bg-amber-500 text-slate-950 font-black ring-4 ring-amber-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {st.alert ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : st.done ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-semibold leading-tight ${
                      st.alert
                        ? 'text-amber-700'
                        : st.active
                        ? 'text-slate-900 font-bold'
                        : st.done
                        ? 'text-emerald-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Connecting Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-500 ${
                  primaryApp.status === 'Deficient' ? 'bg-amber-500' : 'bg-emerald-700'
                }`}
                style={{
                  width:
                    primaryApp.status === 'Deficient'
                      ? '42%'
                      : primaryApp.status === 'Resubmitted' || primaryApp.status === 'Scrutiny'
                      ? '60%'
                      : primaryApp.status === 'Screening' || primaryApp.status === 'Shortlisted'
                      ? '80%'
                      : primaryApp.status === 'Selected' || primaryApp.status === 'Approved'
                      ? '100%'
                      : '20%',
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Cards (Requirement 9) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalApps}</div>
            <div className="text-xs font-semibold text-slate-500">Applications</div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{underReview}</div>
            <div className="text-xs font-semibold text-slate-500">Under Review</div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{actionRequired}</div>
            <div className="text-xs font-semibold text-slate-500">Action Required</div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-700 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{selectedCount}</div>
            <div className="text-xs font-semibold text-slate-500">Selected</div>
          </div>
        </div>
      </div>

      {/* Continue Application / Action Required Alert Box (Requirement 9 & 20) */}
      {primaryApp && primaryApp.status === 'Deficient' && (
        <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shrink-0 mt-0.5 shadow-xs">
              <AlertTriangle className="w-6 h-6 text-amber-950" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Action Required
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-2 py-0.2 rounded-full">
                  Deficiency Detected
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                National Fellowship for Scheduled Tribes (NFST)
              </h3>
              <p className="text-xs text-slate-700 max-w-xl leading-relaxed">
                Your Income Certificate was flagged as expired by the automated scrutiny engine. Please upload a valid certificate for FY 2026-27 to continue official evaluation.
              </p>
            </div>
          </div>

          <Link
            to="/applicant/deficiencies"
            className="shrink-0 flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <span>Resolve Deficiency</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/applicant/eligibility"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all group"
        >
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl w-fit mb-3 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">AI Eligibility Assistant</h4>
          <p className="text-xs text-slate-500 mt-1">
            Check preliminary eligibility for upcoming fellowships in under 2 minutes.
          </p>
        </Link>

        <Link
          to="/applicant/documents"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all group"
        >
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl w-fit mb-3 group-hover:bg-[#0D3829] group-hover:text-white transition-colors">
            <UploadCloud className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Document Locker</h4>
          <p className="text-xs text-slate-500 mt-1">
            Manage your DigiLocker verified Caste & Income certificates.
          </p>
        </Link>

        <Link
          to="/applicant/applications"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all group"
        >
          <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl w-fit mb-3 group-hover:bg-slate-800 group-hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Track Applications</h4>
          <p className="text-xs text-slate-500 mt-1">
            View detailed timeline, digital audit trails, and officer remarks.
          </p>
        </Link>
      </div>
    </div>
  );
};

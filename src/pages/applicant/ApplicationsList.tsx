import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { FileCheck, Search, ChevronRight, Filter, AlertTriangle } from 'lucide-react';

export const ApplicantApplicationsList: React.FC = () => {
  const { applications } = useApplication();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Primary list for applicant (filtered for demo scholar Aarav Kumar)
  const userApps = applications.filter(
    (a) => a.applicantId === 'app-001' || a.id.includes('NFST') || a.id.includes('NOS')
  );

  const filtered = userApps.filter((a) => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSearch =
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.schemeName.toLowerCase().includes(search.toLowerCase()) ||
      a.schemeCode.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Records Registry
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">My Submitted Applications</h1>
          <p className="text-xs text-slate-500 font-hindi">
            मेरे द्वारा प्रस्तुत छात्रवृत्ति एवं अध्येतावृत्ति आवेदन
          </p>
        </div>

        <Link
          to="/applicant/application/new"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-xs transition-colors"
        >
          + New Scheme Application
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by application ID or scheme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
        >
          <option value="all">All Statuses</option>
          <option value="Deficient">Deficient</option>
          <option value="Resubmitted">Resubmitted</option>
          <option value="Scrutiny">Scrutiny</option>
          <option value="Screening">Screening</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Selected">Selected</option>
        </select>
      </div>

      {/* Applications Cards / Table */}
      <div className="space-y-3">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-black text-slate-900">{app.id}</span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.2 rounded border border-amber-300">
                  {app.schemeCode}
                </span>
                <StatusBadge status={app.status} size="sm" />
              </div>

              <h3 className="text-sm font-bold text-slate-800 truncate">{app.schemeName}</h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>Submitted: <strong>{formatDate(app.submittedAt)}</strong></span>
                <span>•</span>
                <span>Institution: <strong>{app.formData.institution || app.formData.university}</strong></span>
                <span>•</span>
                <span>AI Confidence: <strong className="text-emerald-800">{app.aiScore}%</strong></span>
              </div>

              {app.status === 'Deficient' && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 pt-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>1 document requires correction before scrutiny can resume</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {app.status === 'Deficient' ? (
                <Link
                  to="/applicant/deficiencies"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs transition-colors"
                >
                  Resolve Deficiency
                </Link>
              ) : (
                <Link
                  to={`/applicant/applications/${app.id}`}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-colors"
                >
                  <span>Track Progress</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

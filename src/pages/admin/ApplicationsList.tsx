import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { INDIAN_STATES } from '../../data/stateData';
import { Search, Filter, ChevronRight, Eye, Sparkles } from 'lucide-react';

export const AdminApplicationsList: React.FC = () => {
  const { applications } = useApplication();

  const [search, setSearch] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.state.toLowerCase().includes(search.toLowerCase());

    const matchesScheme = selectedScheme === 'all' || app.schemeCode === selectedScheme;
    const matchesState = selectedState === 'all' || app.state === selectedState;
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;

    return matchesSearch && matchesScheme && matchesState && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
            Registry Master
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Application Management (आवेदन प्रबंधन पंजी)
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            अखिल भारतीय अनुसूचित जनजाति छात्रवृत्ति एवं अध्येतावृत्ति आवेदन
          </p>
        </div>

        <div className="text-xs font-bold text-slate-600">
          Showing <strong>{filtered.length}</strong> of {applications.length} Records
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, applicant or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Scheme Filter */}
          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium"
          >
            <option value="all">All Schemes</option>
            <option value="NFST">NFST (National Fellowship)</option>
            <option value="NOS">NOS (National Overseas)</option>
            <option value="TCE-ST">TCE-ST (Top Class Education)</option>
            <option value="PMS-ST">PMS-ST (Post-Matric)</option>
          </select>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium"
          >
            <option value="all">All States & UTs</option>
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium"
          >
            <option value="all">All Workflow States</option>
            <option value="Deficient">Deficient</option>
            <option value="Resubmitted">Resubmitted</option>
            <option value="Scrutiny">Scrutiny</option>
            <option value="Screening">Screening</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
          </select>
        </div>
      </div>

      {/* Applications Table (Requirement 27) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#072319] text-white uppercase text-[10px] tracking-wider border-b border-emerald-950 font-bold">
              <tr>
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Applicant Name</th>
                <th className="py-3.5 px-4">Scheme</th>
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4">Eligibility</th>
                <th className="py-3.5 px-4">AI Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                    {app.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{app.applicantName}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{app.formData.tribeCommunity} (ST)</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-800">
                    {app.schemeCode}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {app.state}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(app.submittedAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                      {app.eligibilityStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-black text-emerald-800">
                      {app.aiScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      to={`/admin/scrutiny/${app.id}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Scrutinize</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

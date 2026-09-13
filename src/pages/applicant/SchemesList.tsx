import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_SCHEMES } from '../../data/schemesData';
import { Sparkles, ArrowRight, Search, FileText, Calendar, Building2, CheckCircle2 } from 'lucide-react';

export const SchemesList: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = INITIAL_SCHEMES.filter((s) => {
    let matchesCategory = true;
    if (selectedFilter === 'fellowships') matchesCategory = s.category === 'fellowship';
    if (selectedFilter === 'scholarships') matchesCategory = s.category === 'scholarship';
    if (selectedFilter === 'overseas') matchesCategory = s.category === 'overseas';
    if (selectedFilter === 'domestic') matchesCategory = s.category === 'domestic';

    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.targetGroup.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Official Directory
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Tribal Affairs Scheme Marketplace</h1>
          <p className="text-xs text-slate-500 font-hindi">
            जनजाति कार्य मंत्रालय द्वारा संचालित छात्रवृत्ति एवं अध्येतावृत्ति योजनाएं
          </p>
        </div>

        <Link
          to="/applicant/eligibility"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Launch AI Eligibility Checker</span>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scheme name, education level or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'fellowships', label: 'Fellowships' },
            { id: 'scholarships', label: 'Scholarships' },
            { id: 'overseas', label: 'Overseas (NOS)' },
            { id: 'domestic', label: 'Domestic' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                selectedFilter === f.id
                  ? 'bg-[#0D3829] text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-emerald-700 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-black bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-md">
                  {scheme.code}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {scheme.slotsAvailable.toLocaleString('en-IN')} Slots
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{scheme.name}</h3>
                <p className="text-xs text-amber-800 font-hindi mt-0.5">{scheme.hindiName}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{scheme.description}</p>

              {/* Eligibility Bullet summary (Requirement 10) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                  Key Eligibility Rules:
                </span>
                <ul className="space-y-1 text-slate-600">
                  {scheme.eligibilitySummary.slice(0, 3).map((rule, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500">Stipend / Support:</span>
                  <div className="font-bold text-slate-900 truncate">{scheme.stipendAmount}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">Deadline:</span>
                  <div className="font-bold text-amber-700">{scheme.deadline}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <Link
                to="/applicant/eligibility"
                className="flex items-center justify-center space-x-1 py-2 px-3 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Check Eligibility</span>
              </Link>
              <Link
                to="/applicant/application/new"
                className="flex items-center justify-center space-x-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-colors shadow-2xs"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

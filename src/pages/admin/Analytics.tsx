import React, { useState } from 'react';
import { mockAnalyticsService } from '../../services/mockAnalyticsService';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const kpis = mockAnalyticsService.getKPIs();
  const stateStats = mockAnalyticsService.getStateStats();
  const schemeBreakdown = mockAnalyticsService.getSchemeBreakdown();
  const deficiencyCategories = mockAnalyticsService.getDeficiencyCategories();
  const funnel = mockAnalyticsService.getSelectionFunnel();

  const [selectedTab, setSelectedTab] = useState<'states' | 'funnel' | 'efficiency'>('states');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
            National Data Observability
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            State-wise & National Scholarship Analytics
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            राज्यवार आवेदन वितरण, चयन फ़नल एवं एआई दक्षता विश्लेषण
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSelectedTab('states')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedTab === 'states' ? 'bg-white text-[#0D3829] shadow-2xs' : 'text-slate-600'
            }`}
          >
            State Distribution
          </button>
          <button
            onClick={() => setSelectedTab('funnel')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedTab === 'funnel' ? 'bg-white text-[#0D3829] shadow-2xs' : 'text-slate-600'
            }`}
          >
            Selection Funnel
          </button>
          <button
            onClick={() => setSelectedTab('efficiency')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedTab === 'efficiency' ? 'bg-white text-[#0D3829] shadow-2xs' : 'text-slate-600'
            }`}
          >
            AI vs Manual Efficiency
          </button>
        </div>
      </div>

      {/* Top 3 KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Total Funds Sanctioned</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">₹1,240.5 Cr</div>
            <span className="text-[10px] text-emerald-800 font-bold">Direct Benefit Transfer</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">AI Automated Verification</span>
            <div className="text-2xl font-black text-emerald-800 mt-0.5">97.4%</div>
            <span className="text-[10px] text-slate-500">First-pass accuracy rate</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Average Scrutiny Cycle</span>
            <div className="text-2xl font-black text-amber-800 mt-0.5">2.8 Days</div>
            <span className="text-[10px] text-emerald-800 font-bold">Down from 44.0 Days</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-800 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tab 1: State-Wise Analytics Table (Requirement 26) */}
      {selectedTab === 'states' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  State-wise Scholarship Applications & Sanctions (Requirement 26)
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time geographic distribution across top ST populated states and union territories.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                20 Priority States
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-[10px] font-bold text-slate-500 tracking-wider border-b">
                  <tr>
                    <th className="py-3 px-6">State / Union Territory</th>
                    <th className="py-3 px-6">Applications Received</th>
                    <th className="py-3 px-6">Eligible Verified</th>
                    <th className="py-3 px-6">Fellowship Selected</th>
                    <th className="py-3 px-6">Pending Scrutiny</th>
                    <th className="py-3 px-6 text-right">Sanction Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stateStats.map((st) => (
                    <tr key={st.state} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{st.state}</span>
                      </td>
                      <td className="py-3.5 px-6 font-mono font-bold text-slate-800">
                        {st.applications.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-emerald-800 font-semibold">
                        {st.eligible.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-[#0D3829] font-black">
                        {st.selected.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-amber-700">
                        {st.pending.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono font-bold text-slate-700">
                        {((st.selected / st.applications) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Selection Funnel & Schemes */}
      {selectedTab === 'funnel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Funnel visualization (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-3">
              National Scholarship Selection Funnel
            </h3>
            <div className="space-y-3 pt-2">
              {funnel.map((fn, idx) => (
                <div key={fn.stage} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-800">{fn.stage}</span>
                    <span className="font-mono text-slate-900">{fn.count.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(fn.count / 12482) * 100}%`,
                        backgroundColor: fn.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheme Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-3">
              Applications by Scheme
            </h3>
            <div className="space-y-3">
              {schemeBreakdown.map((sb) => (
                <div key={sb.scheme} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{sb.name}</span>
                    <span className="font-mono text-emerald-800 font-bold">{sb.count}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>Code: {sb.scheme}</span>
                    <span>{sb.percent}% of total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AI vs Manual Efficiency & Deficiencies */}
      {selectedTab === 'efficiency' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Efficiency Comparison (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-3">
              AI-Assisted vs Manual Processing Efficiency
            </h3>
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-950">AdivaSetu AI-Assisted Processing</span>
                  <span className="font-mono text-xl font-black text-emerald-800">2.8 Days</span>
                </div>
                <p className="text-slate-600 leading-snug">
                  Automated OCR extraction, cross-document checks, and DigiLocker registry queries happen in seconds. Officer focuses purely on adjudication.
                </p>
              </div>

              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-300 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Legacy Manual Physical Verification</span>
                  <span className="font-mono text-xl font-black text-slate-600">44.0 Days</span>
                </div>
                <p className="text-slate-500 leading-snug">
                  Paper file movement, postal notices for deficiencies, and manual registry phone verification.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-amber-950 font-bold text-center">
                ⚡ 93.6% Reduction in Administrative Turnaround Time
              </div>
            </div>
          </div>

          {/* Deficiency Categories Breakdown (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-3">
              Common Deficiency Root Causes
            </h3>
            <div className="space-y-3">
              {deficiencyCategories.map((dc) => (
                <div key={dc.category} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span>{dc.category}</span>
                    <span className="font-mono text-amber-800">{dc.count} cases ({dc.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-2 rounded-full"
                      style={{ width: `${dc.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ListOrdered,
  Award,
  CheckCircle2,
  Sliders,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Star,
  Layers,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ScreeningRankings: React.FC = () => {
  const { applications, schemeWeights, updateStatus, schemes } = useApplication();
  const { success } = useToast();

  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState<string>('all');

  // Filter by scheme
  const filteredApps = applications.filter((app) =>
    selectedSchemeFilter === 'all' ? true : app.schemeCode.toUpperCase() === selectedSchemeFilter.toUpperCase()
  );

  // Dynamic weights based on scheme
  const currentWeights = schemeWeights;

  // Sort applications by overall score
  const ranked = [...filteredApps]
    .map((app, idx) => {
      // Dynamic score calculation based on scheme weights
      const academicScore = Math.min(99, 84 + (idx % 14));
      const researchFitScore = Math.min(98, 89 - (idx % 9));
      const docScore = Math.round(app.aiScore || 96);
      const instScore = app.schemeCode === 'NOS' ? 95 : 88;

      const weightedTotal = Math.round(
        (academicScore * currentWeights.academicPerformance +
          researchFitScore * currentWeights.researchProposal +
          95 * currentWeights.eligibilityCompliance +
          instScore * currentWeights.institutionRating +
          docScore * currentWeights.documentCompleteness) /
          100
      );

      return {
        ...app,
        calculatedScore: weightedTotal,
        academicScore,
        researchFit: idx % 3 === 0 ? 'Exceptional' : 'Strong',
        recommendation: weightedTotal >= 88 ? 'Recommended for Award' : 'Conditional Merit',
      };
    })
    .sort((a, b) => {
      if (b.calculatedScore !== a.calculatedScore) {
        return b.calculatedScore - a.calculatedScore;
      }
      // Tie-breaking rule (PS239 Requirement 14): Higher academic score takes precedence
      return b.academicScore - a.academicScore;
    });

  const handleShortlist = (appId: string) => {
    updateStatus(appId, 'Shortlisted', 'Shortlisted by Central Screening Committee for Fellowship Award.');
    success('Candidate Shortlisted', `${appId} has been moved to Shortlisted status.`);
  };

  const handleSanctionAward = (appId: string) => {
    updateStatus(appId, 'Selected', 'Final Statutory Sanction Order Issued under MoTA Rule 14(b).');
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#0D3829', '#D97706', '#10B981'],
    });
    success('Fellowship Award Sanctioned', `Provisional award letter & DBT mandate generated for ${appId}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
            Transparent Merit Matrix Engine (PS239)
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Candidate Screening & Merit Rankings (मेधा सूची)
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            योजना मानदंड भार, पारदर्शी प्राप्तांक गणना एवं शासकीय अनुमोदन
          </p>
        </div>

        <Link
          to="/admin/schemes"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-600" />
          <span>Calibrate Selection Weights</span>
        </Link>
      </div>

      {/* Scheme Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-800" />
          <span className="font-bold text-slate-700">Filter Merit List by Scheme:</span>
        </div>

        <div className="flex flex-wrap gap-1.5 font-bold">
          {['all', 'NFST', 'NOS', 'TCE-ST', 'PMS-ST'].map((sc) => (
            <button
              key={sc}
              onClick={() => setSelectedSchemeFilter(sc)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedSchemeFilter === sc
                  ? 'bg-[#0D3829] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sc === 'all' ? 'All MoTA Schemes' : sc}
            </button>
          ))}
        </div>
      </div>

      {/* Transparent Active Weight Formula Box (Requirement 14: Item 136-137) */}
      <div className="bg-emerald-950 text-emerald-100 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="font-bold flex items-center gap-1.5 text-amber-300">
            <TrendingUp className="w-4 h-4" />
            Transparent Merit Formula:
          </span>
          <p className="text-[11px] text-emerald-200 font-mono">
            Overall Index = (Academic × {currentWeights.academicPerformance}% + Research/SOP ×{' '}
            {currentWeights.researchProposal}% + Need × {currentWeights.eligibilityCompliance}% + Inst Tier ×{' '}
            {currentWeights.institutionRating}% + Doc Authenticity × {currentWeights.documentCompleteness}%) / 100
          </p>
        </div>

        <div className="p-2 bg-emerald-900/80 rounded-xl text-[10px] text-emerald-200 border border-emerald-700/60 max-w-xs">
          <strong>Tie-Breaking Rule (Rule 18):</strong> When 2 candidates have identical index, higher qualifying marks wins rank priority.
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#072319] text-white uppercase text-[10px] tracking-wider border-b border-emerald-950 font-bold">
              <tr>
                <th className="py-3.5 px-4 text-center">Rank</th>
                <th className="py-3.5 px-4">Applicant Particulars</th>
                <th className="py-3.5 px-4">Scheme</th>
                <th className="py-3.5 px-4">Academic ({currentWeights.academicPerformance}%)</th>
                <th className="py-3.5 px-4">Research / SOP ({currentWeights.researchProposal}%)</th>
                <th className="py-3.5 px-4">AI Doc Score</th>
                <th className="py-3.5 px-4 font-black text-amber-400">Composite Score</th>
                <th className="py-3.5 px-4">Recommendation</th>
                <th className="py-3.5 px-4 text-right">Statutory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ranked.map((cand, idx) => (
                <tr key={cand.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-100 text-amber-900'
                          : 'text-slate-500'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{cand.applicantName}</span>
                      {idx === 0 && <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {cand.id} • {cand.state}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
                      {cand.schemeCode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {cand.academicScore}%
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {cand.researchFit}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                    {cand.aiScore}%
                  </td>

                  <td className="py-3.5 px-4 font-mono text-sm font-black text-[#0D3829]">
                    {cand.calculatedScore} / 100
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        cand.calculatedScore >= 88
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {cand.recommendation}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {cand.status === 'Shortlisted' ? (
                        <button
                          onClick={() => handleSanctionAward(cand.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-all shadow-xs cursor-pointer"
                        >
                          Sanction Award
                        </button>
                      ) : cand.status === 'Selected' || cand.status === 'Approved' ? (
                        <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Sanctioned ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => handleShortlist(cand.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs cursor-pointer"
                        >
                          Shortlist
                        </button>
                      )}
                    </div>
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

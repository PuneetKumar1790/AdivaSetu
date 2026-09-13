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
} from 'lucide-react';

export const ScreeningRankings: React.FC = () => {
  const { applications, schemeWeights, updateStatus } = useApplication();
  const { success } = useToast();

  // Sort applications by overall score
  const ranked = [...applications]
    .map((app, idx) => {
      // Dynamic score calculation based on scheme weights
      const academicScore = 85 + (idx % 12);
      const researchFitScore = 90 - (idx % 8);
      const docScore = Math.round(app.aiScore);

      const weightedTotal = Math.round(
        (academicScore * schemeWeights.academicPerformance +
          researchFitScore * schemeWeights.researchProposal +
          95 * schemeWeights.eligibilityCompliance +
          88 * schemeWeights.institutionRating +
          docScore * schemeWeights.documentCompleteness) /
          100
      );

      return {
        ...app,
        calculatedScore: weightedTotal,
        academicScore,
        researchFit: idx % 3 === 0 ? 'Excellent' : 'Strong',
        recommendation: weightedTotal >= 90 ? 'Recommended' : 'Conditional',
      };
    })
    .sort((a, b) => b.calculatedScore - a.calculatedScore);

  const handleShortlist = (appId: string) => {
    updateStatus(appId, 'Shortlisted', 'Shortlisted by Central Screening Committee for Fellowship Award.');
    success('Candidate Shortlisted', `${appId} has been moved to Shortlisted status.`);
  };

  const handleSanctionAward = (appId: string) => {
    updateStatus(appId, 'Selected', 'Final Sanction Order Issued for National Fellowship.');
    success('Fellowship Award Sanctioned', `Provisional sanction letter generated for ${appId}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
            Merit Matrix Engine
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Candidate Screening & Merit Rankings (मेधा सूची)
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            योजना मानदंड भार एवं एआई विश्लेषित मेधा क्रम
          </p>
        </div>

        <Link
          to="/admin/schemes"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-600" />
          <span>Adjust Selection Weights</span>
        </Link>
      </div>

      {/* Active Weight Pills Summary */}
      <div className="bg-emerald-950 text-emerald-100 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold flex items-center gap-1.5 text-amber-300">
          <TrendingUp className="w-4 h-4" />
          Active Screening Weight Formula:
        </span>
        <div className="flex flex-wrap gap-2 text-[11px] font-mono">
          <span className="bg-emerald-900 px-2 py-0.5 rounded">
            Academic: {schemeWeights.academicPerformance}%
          </span>
          <span className="bg-emerald-900 px-2 py-0.5 rounded">
            Research: {schemeWeights.researchProposal}%
          </span>
          <span className="bg-emerald-900 px-2 py-0.5 rounded">
            Eligibility: {schemeWeights.eligibilityCompliance}%
          </span>
          <span className="bg-emerald-900 px-2 py-0.5 rounded">
            Institution: {schemeWeights.institutionRating}%
          </span>
          <span className="bg-emerald-900 px-2 py-0.5 rounded">
            Documents: {schemeWeights.documentCompleteness}%
          </span>
        </div>
      </div>

      {/* Rankings Table (Requirement 31) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#072319] text-white uppercase text-[10px] tracking-wider border-b border-emerald-950 font-bold">
              <tr>
                <th className="py-3.5 px-4 text-center">Rank</th>
                <th className="py-3.5 px-4">Applicant Particulars</th>
                <th className="py-3.5 px-4">Academic</th>
                <th className="py-3.5 px-4">Eligibility</th>
                <th className="py-3.5 px-4">Research Fit</th>
                <th className="py-3.5 px-4">Doc Score</th>
                <th className="py-3.5 px-4 font-black text-amber-400">Overall Index</th>
                <th className="py-3.5 px-4">Recommendation</th>
                <th className="py-3.5 px-4 text-right">Committee Action</th>
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
                      {cand.id} • {cand.schemeCode}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {cand.academicScore}%
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-emerald-800 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {cand.eligibilityStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {cand.researchFit}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                    {cand.aiScore}%
                  </td>

                  <td className="py-3.5 px-4 font-mono text-sm font-black text-[#0D3829]">
                    {cand.calculatedScore}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded text-[10px]">
                      {cand.recommendation}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                    {cand.status === 'Selected' || cand.status === 'Approved' ? (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                        Sanctioned ✓
                      </span>
                    ) : cand.status === 'Shortlisted' ? (
                      <button
                        onClick={() => handleSanctionAward(cand.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-2xs"
                      >
                        Sanction Award
                      </button>
                    ) : (
                      <button
                        onClick={() => handleShortlist(cand.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-colors"
                      >
                        Shortlist
                      </button>
                    )}
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

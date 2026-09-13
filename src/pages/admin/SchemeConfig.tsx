import React, { useState } from 'react';
import { useApplication } from '../../context/ApplicationContext';
import { SchemeConfigurationWeights } from '../../types';
import { Sliders, Save, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SchemeConfig: React.FC = () => {
  const { schemeWeights, updateSchemeWeights } = useApplication();
  const [weights, setWeights] = useState<SchemeConfigurationWeights>({ ...schemeWeights });

  const total =
    weights.academicPerformance +
    weights.researchProposal +
    weights.eligibilityCompliance +
    weights.institutionRating +
    weights.documentCompleteness;

  const handleSave = () => {
    updateSchemeWeights(weights);
  };

  const handleReset = () => {
    const defaultWeights: SchemeConfigurationWeights = {
      academicPerformance: 30,
      researchProposal: 25,
      eligibilityCompliance: 20,
      institutionRating: 15,
      documentCompleteness: 10,
    };
    setWeights(defaultWeights);
    updateSchemeWeights(defaultWeights);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
            Policy & Parameter Tuning
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Scheme Selection Criteria Configuration
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            योजना चयन मानदंड भार विन्यास एवं नीतिगत समायोजन
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={total !== 100}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-md transition-all active:scale-95 disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Main Configuration Card (Requirement 32) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              National Fellowship for Scheduled Tribes (NFST)
            </h3>
            <p className="text-xs text-slate-500">
              Adjust multi-criteria weight distributions to calibrate automated applicant scoring.
            </p>
          </div>

          <div
            className={`px-4 py-1.5 rounded-2xl text-xs font-black font-mono border ${
              total === 100
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            Total Weight: {total}% {total === 100 ? '✓' : '(Must equal 100%)'}
          </div>
        </div>

        {/* Sliders List (Requirement 32) */}
        <div className="space-y-6 max-w-2xl">
          {/* 1. Academic */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">1. Academic Performance (UG/PG Percentage & CGPA)</span>
              <span className="font-mono text-emerald-800 text-sm">{weights.academicPerformance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={weights.academicPerformance}
              onChange={(e) =>
                setWeights({ ...weights, academicPerformance: parseInt(e.target.value) || 0 })
              }
              className="w-full accent-emerald-800"
            />
            <p className="text-[11px] text-slate-500">Weight assigned to qualifying Master's degree percentage.</p>
          </div>

          {/* 2. Research Proposal */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">2. Research Proposal / Tribal Subject Relevance</span>
              <span className="font-mono text-emerald-800 text-sm">{weights.researchProposal}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={weights.researchProposal}
              onChange={(e) =>
                setWeights({ ...weights, researchProposal: parseInt(e.target.value) || 0 })
              }
              className="w-full accent-emerald-800"
            />
            <p className="text-[11px] text-slate-500">Weight assigned to synopsis feasibility and indigenous tribal welfare relevance.</p>
          </div>

          {/* 3. Eligibility Compliance */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">3. Statutory Eligibility & Economic Need (Income Tier)</span>
              <span className="font-mono text-emerald-800 text-sm">{weights.eligibilityCompliance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={weights.eligibilityCompliance}
              onChange={(e) =>
                setWeights({ ...weights, eligibilityCompliance: parseInt(e.target.value) || 0 })
              }
              className="w-full accent-emerald-800"
            />
            <p className="text-[11px] text-slate-500">Weight prioritizing lower income quintiles and PVTG tribal groups.</p>
          </div>

          {/* 4. Institution Rating */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">4. Institution / NIRF Ranking & Department Tier</span>
              <span className="font-mono text-emerald-800 text-sm">{weights.institutionRating}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={weights.institutionRating}
              onChange={(e) =>
                setWeights({ ...weights, institutionRating: parseInt(e.target.value) || 0 })
              }
              className="w-full accent-emerald-800"
            />
            <p className="text-[11px] text-slate-500">Weight given to Institutes of National Importance (IITs, IIMs, Central Universities).</p>
          </div>

          {/* 5. Document Completeness */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">5. Document Authenticity Index & OCR Confidence</span>
              <span className="font-mono text-emerald-800 text-sm">{weights.documentCompleteness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={weights.documentCompleteness}
              onChange={(e) =>
                setWeights({ ...weights, documentCompleteness: parseInt(e.target.value) || 0 })
              }
              className="w-full accent-emerald-800"
            />
            <p className="text-[11px] text-slate-500">Weight awarded for complete DigiLocker verification with zero manual clarifications.</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Modifications take immediate effect across the <strong>Merit Screening Engine</strong>. Application rankings will dynamically recalculate according to the updated criteria distribution.
          </p>
        </div>
      </div>
    </div>
  );
};

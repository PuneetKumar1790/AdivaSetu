import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockEligibilityService } from '../../services/mockEligibilityService';
import { INDIAN_STATES, TRIBAL_COMMUNITIES } from '../../data/stateData';
import { EligibilityQuery, EligibilityResult } from '../../types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Check,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export const EligibilityWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<EligibilityQuery>>({
    category: 'ST',
    tribeCommunity: 'Gond',
    state: 'Delhi',
    age: 26,
    educationLevel: 'Post-Graduation (Master’s)',
    course: 'Ph.D in Environmental Sciences',
    institution: 'Jawaharlal Nehru University (JNU)',
    annualIncome: 240000,
    percentage: 88,
    admissionStatus: 'Confirmed Admission',
    studyDestination: 'Domestic',
    researchProgramme: true,
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Trigger simulated AI Analysis
      runAIAnalysis();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const evaluation = mockEligibilityService.evaluateEligibility(formData);
      setResult(evaluation);
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/15 text-amber-700 rounded-xl border border-amber-300">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Eligibility Assistant</h1>
            <p className="text-xs text-slate-500 font-hindi">
              कृत्रिम बुद्धिमत्ता आधारित पात्रता पूर्वानुमान सहायक
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-600 border border-slate-200">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Wizard Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Step Indicator Bar */}
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
            <span className={currentStep >= 1 ? 'text-emerald-800' : 'text-slate-400'}>1. Category</span>
            <span className={currentStep >= 2 ? 'text-emerald-800' : 'text-slate-400'}>2. Academic</span>
            <span className={currentStep >= 3 ? 'text-emerald-800' : 'text-slate-400'}>3. Financial</span>
            <span className={currentStep >= 4 ? 'text-emerald-800' : 'text-slate-400'}>4. Programme</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0D3829] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Category & Personal */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-200">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2">
              1. Identity & Tribal Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Social Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="OBC">Other Backward Class (OBC)</option>
                  <option value="General">General Category</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tribe / Sub-Community</label>
                <select
                  value={formData.tribeCommunity}
                  onChange={(e) => setFormData({ ...formData, tribeCommunity: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {TRIBAL_COMMUNITIES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">State of Domicile</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Applicant Age (Years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
                <span className="text-[10px] text-slate-500">Max age limit for NFST is 36 years.</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic Credentials */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-200">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2">
              2. Highest Qualification & Performance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Highest Completed Qualification</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Post-Graduation (Master’s)">Post-Graduation (Master’s degree / M.Sc / M.Tech / M.A)</option>
                  <option value="Graduation (Bachelor’s)">Graduation (Bachelor’s / B.Tech / B.Sc)</option>
                  <option value="M.Phil">M.Phil</option>
                  <option value="Class 12th">Class 12th / Intermediate</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Academic Percentage / Equivalent CGPA</label>
                <input
                  type="number"
                  value={formData.percentage}
                  onChange={(e) => setFormData({ ...formData, percentage: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
                <span className="text-[10px] text-slate-500">Must be minimum 55% for research fellowships.</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Financial Background */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-200">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2">
              3. Family Annual Income
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="font-semibold text-slate-700">Gross Annual Family Income (INR)</label>
                  <span className="font-bold text-emerald-800">₹{(formData.annualIncome || 0).toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1200000"
                  step="25000"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: parseInt(e.target.value) })}
                  className="w-full accent-emerald-800"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>₹50,000</span>
                  <span>Ceiling: ₹6,00,000 (NFST)</span>
                  <span>₹12,00,000</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
                Income certificates must be issued by a competent Revenue Officer (Tehsildar / Sub-Divisional Magistrate) for the active financial year.
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Proposed Programme & Destination */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-200">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2">
              4. Programme & Study Destination
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Study Destination</label>
                <select
                  value={formData.studyDestination}
                  onChange={(e) => setFormData({ ...formData, studyDestination: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Domestic">Indian University / Institute (Domestic)</option>
                  <option value="Overseas">Abroad / QS Top 1000 University (Overseas)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Enrolment / Admission Status</label>
                <select
                  value={formData.admissionStatus}
                  onChange={(e) => setFormData({ ...formData, admissionStatus: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Confirmed Admission">Confirmed Regular Enrolment / Admission</option>
                  <option value="Provisional Offer">Provisional Admission Offer</option>
                  <option value="Entrance Qualified">National Entrance Exam Qualified (UGC-NET / GATE / IPMAT)</option>
                  <option value="Not Applied">Not Yet Enrolled</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700">Enrolled Institution Name</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={handlePrev}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={handleNext}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running AI Simulation...</span>
              </>
            ) : currentStep === totalSteps ? (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Calculate Eligibility</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preliminary Eligibility Result (Requirement 11) */}
      {result && (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Preliminary Eligibility Result
              </span>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 mt-0.5">
                <span>{result.verdict}</span>
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </h2>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">Predicted Match Confidence</span>
              <div className="text-2xl font-mono font-black text-emerald-800">
                {result.confidence}%
              </div>
            </div>
          </div>

          {/* Factor Checklist (Requirement 11) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Factor Evaluation Breakdown
            </h4>
            <div className="space-y-2">
              {result.factors.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  {f.satisfied ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-slate-800">{f.factor}</span>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-snug">{f.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Scheme Match */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
            <h4 className="text-xs font-bold text-emerald-950">Recommended Open Schemes:</h4>
            <ul className="text-xs font-semibold text-emerald-900 space-y-1">
              {result.matchedSchemes.map((scheme, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                  <span>{scheme}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mandatory Disclaimer (Requirement 11) */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Mandatory Notice:</strong> {result.disclaimer}
            </p>
          </div>

          {/* CTA */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setResult(null)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl border border-slate-300"
            >
              Recalculate
            </button>
            <button
              onClick={() => navigate('/applicant/application/new')}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-md transition-all active:scale-95"
            >
              <span>Start Application for NFST</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

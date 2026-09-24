import React, { useState, useEffect } from 'react';
import { useApplication } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';
import { Scheme, SchemeConfigurationWeights, DocumentType } from '../../types';
import {
  Sliders,
  Save,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Settings,
  FileText,
  ListFilter,
  Layers,
  Calendar,
  Globe2,
  Award,
  Sparkles,
  PlusCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const SchemeConfig: React.FC = () => {
  const { schemes, updateScheme, activeSchemeCode, setActiveSchemeCode } = useApplication();
  const { success, info } = useToast();

  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>(activeSchemeCode || 'NFST');
  const [activeTab, setActiveTab] = useState<'weights' | 'rules' | 'documents' | 'tenor'>('weights');

  // Currently loaded scheme
  const currentScheme = schemes.find((s) => s.code === selectedSchemeCode) || schemes[0];

  // Local editable state for current scheme
  const [formData, setFormData] = useState<Scheme>({ ...currentScheme });

  useEffect(() => {
    const matched = schemes.find((s) => s.code === selectedSchemeCode) || schemes[0];
    setFormData({ ...matched });
  }, [selectedSchemeCode, schemes]);

  const weights: SchemeConfigurationWeights = formData.selectionWeights || {
    academicPerformance: 30,
    researchProposal: 25,
    eligibilityCompliance: 20,
    institutionRating: 15,
    documentCompleteness: 10,
  };

  const totalWeight =
    weights.academicPerformance +
    weights.researchProposal +
    weights.eligibilityCompliance +
    weights.institutionRating +
    weights.documentCompleteness;

  const handleWeightChange = (key: keyof SchemeConfigurationWeights, val: number) => {
    setFormData((prev) => ({
      ...prev,
      selectionWeights: {
        ...(prev.selectionWeights || weights),
        [key]: val,
      },
    }));
  };

  const handleSaveAll = () => {
    updateScheme(formData);
    success('Scheme Engine Updated', `Statutory parameters & rules for ${formData.name} successfully deployed.`);
  };

  const handleResetDefaults = () => {
    const matched = schemes.find((s) => s.code === selectedSchemeCode) || schemes[0];
    setFormData({ ...matched });
    info('Reset Completed', `Defaults for ${matched.code} restored.`);
  };

  const toggleDocumentMandatory = (docType: DocumentType) => {
    if (!formData.requiredDocuments) return;
    const updated = formData.requiredDocuments.map((doc) =>
      doc.type === docType ? { ...doc, mandatory: !doc.mandatory } : doc
    );
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: updated,
      requiredDocumentsCount: updated.filter((d) => d.mandatory).length,
    }));
  };

  const handleCloneVersion = () => {
    const nextVer = `${formData.code} (Amendment 2026-27)`;
    setFormData((prev) => ({
      ...prev,
      version: `${prev.version || 'v2026.1'} - Rev B`,
      name: `${prev.name} [Amended Guidelines]`,
    }));
    success('Scheme Version Cloned', `Drafted statutory version revision for ${formData.code}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
              Configurable Scheme Engine (PS239)
            </span>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
              {formData.version || 'v2026.1'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Dynamic Scheme Policy & Rules Configuration
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            योजना नियम, पात्रता शर्तें, आवश्यक दस्तावेज़ एवं मेधा भार विन्यास
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCloneVersion}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors"
            title="Create an amended version of this scheme rules"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Amend Version</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={totalWeight !== 100}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-md transition-all active:scale-95 disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Deploy Configuration</span>
          </button>
        </div>
      </div>

      {/* Scheme Selector Pills Bar (The "Killer Feature" Demo Switcher) */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Scheme to Configure:
            </span>
          </div>
          <span className="text-[11px] text-amber-300 font-mono">
            Active: {formData.name} ({formData.code})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {schemes.map((s) => (
            <button
              key={s.code}
              onClick={() => {
                setSelectedSchemeCode(s.code);
                setActiveSchemeCode(s.code);
              }}
              className={`p-3 rounded-2xl text-left border transition-all ${
                selectedSchemeCode === s.code
                  ? 'bg-emerald-800 text-white border-amber-400 shadow-md font-bold'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs">{s.code}</span>
                {selectedSchemeCode === s.code && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />}
              </div>
              <div className="text-[11px] mt-1 truncate">{s.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{s.category.toUpperCase()}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Tabs Bar */}
      <div className="flex border-b border-slate-200 text-xs font-bold bg-white px-6 rounded-t-2xl pt-3 space-x-6">
        <button
          onClick={() => setActiveTab('weights')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'weights'
              ? 'border-[#0D3829] text-[#0D3829]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4 text-emerald-700" />
          <span>1. Selection Weights ({totalWeight}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'rules'
              ? 'border-[#0D3829] text-[#0D3829]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>2. Eligibility Criteria & Thresholds</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'documents'
              ? 'border-[#0D3829] text-[#0D3829]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>3. Mandatory Document Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('tenor')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'tenor'
              ? 'border-[#0D3829] text-[#0D3829]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4 text-emerald-700" />
          <span>4. Scheme Metadata & Tenor</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="bg-white rounded-b-3xl border border-slate-200 border-t-0 p-6 sm:p-8 shadow-xs space-y-6">
        {/* TAB 1: SELECTION WEIGHTS SLIDERS */}
        {activeTab === 'weights' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {formData.name} ({formData.code}) - Selection Formula
                </h3>
                <p className="text-xs text-slate-500">
                  Calibrate automated screening weights. When an applicant applies for {formData.code}, the merit calculation dynamically follows this distribution.
                </p>
              </div>

              <div
                className={`px-4 py-1.5 rounded-2xl text-xs font-black font-mono border ${
                  totalWeight === 100
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}
              >
                Total Weight: {totalWeight}% {totalWeight === 100 ? '✓ Valid' : '(Must equal 100%)'}
              </div>
            </div>

            <div className="space-y-6 max-w-2xl">
              {/* 1. Academic Performance */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">1. Academic Performance (Degree Marksheet & CGPA)</span>
                  <span className="font-mono text-emerald-800 text-sm">{weights.academicPerformance}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={weights.academicPerformance}
                  onChange={(e) => handleWeightChange('academicPerformance', parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-800"
                />
                <p className="text-[11px] text-slate-500">
                  Weight evaluated from qualifying degree percentage (UG for Masters / PG for Doctoral).
                </p>
              </div>

              {/* 2. Research / Study Plan */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">
                    2. Research Proposal / Study Plan / Statement of Purpose
                  </span>
                  <span className="font-mono text-emerald-800 text-sm">{weights.researchProposal}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={weights.researchProposal}
                  onChange={(e) => handleWeightChange('researchProposal', parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-800"
                />
                <p className="text-[11px] text-slate-500">
                  Evaluated from research synopsis feasibility and indigenous tribal welfare relevance.
                </p>
              </div>

              {/* 3. Statutory Eligibility */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">3. Statutory Need & Economic Vulnerability Tier</span>
                  <span className="font-mono text-emerald-800 text-sm">{weights.eligibilityCompliance}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={weights.eligibilityCompliance}
                  onChange={(e) => handleWeightChange('eligibilityCompliance', parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-800"
                />
                <p className="text-[11px] text-slate-500">
                  Prioritizes Particularly Vulnerable Tribal Groups (PVTG) and lower-income families.
                </p>
              </div>

              {/* 4. Institution Rating */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">
                    4. {formData.category === 'overseas' ? 'QS World University Rank Tier' : 'Institution NIRF Tier / Central University'}
                  </span>
                  <span className="font-mono text-emerald-800 text-sm">{weights.institutionRating}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={weights.institutionRating}
                  onChange={(e) => handleWeightChange('institutionRating', parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-800"
                />
                <p className="text-[11px] text-slate-500">
                  {formData.category === 'overseas'
                    ? 'Top 100 QS = 100% of weight, Top 500 = 80%, Top 1000 = 60%.'
                    : 'Institutes of National Importance (IITs, IIMs, IISc, Central Universities).'}
                </p>
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
                  max="30"
                  step="5"
                  value={weights.documentCompleteness}
                  onChange={(e) => handleWeightChange('documentCompleteness', parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-800"
                />
                <p className="text-[11px] text-slate-500">
                  Automated verification score awarded for clean e-District / DigiLocker DSC seals.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ELIGIBILITY CRITERIA RULES */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Statutory Eligibility Rules Builder ({formData.code})
              </h3>
              <p className="text-xs text-slate-500">
                Rules dynamically enforced by the automated eligibility engine. Modifying these immediately re-configures verification logic without code edits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-700 block">Gross Family Income Ceiling (INR / Annum)</label>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    value={formData.maxIncomeCeiling || 600000}
                    onChange={(e) =>
                      setFormData({ ...formData, maxIncomeCeiling: parseInt(e.target.value) || 0 })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Candidates with income above this threshold will be flagged as Ineligible. (e.g. ₹6.0L for NFST, ₹8.0L for NOS, ₹2.5L for PMS).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-700 block">Minimum Qualifying Degree Marks (%)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={formData.minPercentage || 55}
                    onChange={(e) =>
                      setFormData({ ...formData, minPercentage: parseInt(e.target.value) || 0 })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                  />
                  <span className="font-mono font-bold text-slate-500">%</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Minimum percentage required in previous qualifying degree (55% for NFST, 60% for NOS).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-700 block">Maximum Age Limit (Years)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="15"
                    max="50"
                    value={formData.maxAgeLimit || 36}
                    onChange={(e) =>
                      setFormData({ ...formData, maxAgeLimit: parseInt(e.target.value) || 0 })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                  />
                  <span className="font-mono font-bold text-slate-500">Yrs</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Cut-off age for applicants as of statutory notification date.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-700 block">Category Requirement</label>
                <div className="p-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 font-bold flex items-center justify-between">
                  <span>Scheduled Tribe (ST) with Competent Authority Certificate</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Strictly mandated for all Ministry of Tribal Affairs fellowship schemes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENT REQUIREMENTS CHECKLIST */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Scheme Document Submission Checklist ({formData.code})
              </h3>
              <p className="text-xs text-slate-500">
                When an applicant submits for {formData.code}, the application wizard dynamically builds upload dropzones according to these rules.
              </p>
            </div>

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden text-xs">
              {(formData.requiredDocuments || []).map((doc, idx) => (
                <div key={doc.id || idx} className="p-4 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={doc.mandatory}
                      onChange={() => toggleDocumentMandatory(doc.type)}
                      className="w-4 h-4 accent-emerald-800 rounded cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{doc.name}</span>
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {doc.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{doc.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-right">
                    <span className="text-[11px] text-slate-500">Max: {doc.maxSizeMB} MB</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        doc.mandatory
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {doc.mandatory ? 'MANDATORY' : 'OPTIONAL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SCHEME METADATA & TENOR */}
        {activeTab === 'tenor' && (
          <div className="space-y-6 text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Scheme Tenor, Deadlines & Quota Parameters
              </h3>
              <p className="text-xs text-slate-500">
                Administrative particulars shown to candidates and monitored by MoTA reporting systems.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Scheme Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Applicable Academic Year</label>
                <input
                  type="text"
                  value={formData.academicYear || '2026-27'}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Application Closing Deadline</label>
                <input
                  type="text"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">National Slots / Awards Available</label>
                <input
                  type="number"
                  value={formData.slotsAvailable}
                  onChange={(e) => setFormData({ ...formData, slotsAvailable: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700">Stipend & Financial Support Structure</label>
                <input
                  type="text"
                  value={formData.stipendAmount}
                  onChange={(e) => setFormData({ ...formData, stipendAmount: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700">Eligible Institutions / Jurisdictions</label>
                <input
                  type="text"
                  value={formData.eligibleInstitutions || ''}
                  onChange={(e) => setFormData({ ...formData, eligibleInstitutions: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Global Informational Banner */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Configurable DPI Engine Active:</strong> Updates saved here dynamically calibrate the entire applicant ingestion pipeline, automated AI document checklists, eligibility verification engine, and merit screening formulas without needing software rebuilds.
          </div>
        </div>
      </div>
    </div>
  );
};

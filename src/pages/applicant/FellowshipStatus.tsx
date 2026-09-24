import React, { useState } from 'react';
import { useApplication } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';
import { downloadMockCertificate } from '../../utils/pdfGenerator';
import { formatCurrencyINR, formatDate } from '../../utils/formatters';
import {
  Award,
  Download,
  CheckCircle2,
  Calendar,
  Building,
  CreditCard,
  Clock,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  Upload,
  Send,
  FileText,
  Check,
} from 'lucide-react';

export const FellowshipStatus: React.FC = () => {
  const { applications, updateApplication } = useApplication();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState<'disbursement' | 'onboarding' | 'milestones'>('disbursement');

  // Find active or selected fellowship
  const app =
    applications.find(
      (a) => a.status === 'Selected' || a.status === 'Approved' || a.status === 'Shortlisted' || a.id.includes('NFST')
    ) || applications[0];

  const isFormallyAwarded =
    app.status === 'Selected' || app.status === 'Approved' || app.status === 'Shortlisted';

  // Onboarding Form State
  const [joiningDate, setJoiningDate] = useState('2026-08-01');
  const [supervisorEmail, setSupervisorEmail] = useState('ramaswamy.ses@jnu.ac.in');
  const [labNumber, setLabNumber] = useState('Lab 304, Forest Hydrology Wing');
  const [joiningFileAttached, setJoiningFileAttached] = useState(false);
  const [onboardingSubmitted, setOnboardingSubmitted] = useState(false);

  // Milestone Progress Report State
  const [progressSummary, setProgressSummary] = useState(
    'Completed comprehensive field survey across 14 tribal settlements in Central Highlands. Published 1 Scopus-indexed research paper on agroforestry water retention.'
  );
  const [publicationsCount, setPublicationsCount] = useState('1');
  const [claimHRA, setClaimHRA] = useState(true);
  const [contingencyAmount, setContingencyAmount] = useState('12000');
  const [milestoneSubmitted, setMilestoneSubmitted] = useState(false);

  const handleJoiningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingSubmitted(true);
    success(
      'Joining Formalities Submitted',
      'Official Joining Report and university bonafide forwarded to Nodal Officer for verification.'
    );
  };

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMilestoneSubmitted(true);
    success(
      'Annual Progress Report Logged',
      'Year 1 research progress and contingency grant claim submitted to Ministry Review Board.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Post-Selection Fellowship Governance (PS239)
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Fellowship Lifecycle & Sanction Management
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            अध्येतावृत्ति संस्वीकृति, कार्यभार ग्रहण प्रतिवेदन, वार्षिक प्रगति व डीबीटी संवितरण
          </p>
        </div>

        <button
          onClick={() => downloadMockCertificate(app)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span>Download Provisional Award Letter</span>
        </button>
      </div>

      {/* Main Award Status Card */}
      <div className="bg-gradient-to-br from-[#0D3829] via-[#16533D] to-[#0A2E22] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {isFormallyAwarded ? 'Provisional Fellowship Award Conferred' : 'Under Evaluation'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {app.schemeName} ({app.schemeCode})
            </h2>
            <p className="text-xs text-emerald-200">
              Sanction Order Ref:{' '}
              <strong className="font-mono text-white">MOTA/{app.schemeCode}/2026-27/{app.id.slice(-4)}</strong>
            </p>
          </div>

          <div className="px-4 py-2 bg-emerald-800/80 rounded-2xl border border-emerald-600/50 text-right">
            <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">
              Fellowship Status
            </span>
            <div className="text-lg font-black text-amber-300">
              {isFormallyAwarded ? 'ACTIVE & SANCTIONED' : 'IN SCRUTINY'}
            </div>
          </div>
        </div>

        {/* 4-stat grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-emerald-200">Monthly Financial Grant</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {app.schemeCode === 'NOS' ? '£9,900 / yr' : '₹37,000'}
            </div>
            <span className="text-[10px] text-amber-300">
              {app.schemeCode === 'NOS' ? '+ Full Tuition & Airfare' : '+ HRA & Annual Contingency'}
            </span>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-emerald-200">Approved Tenor</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {app.schemeCode === 'NOS' ? '3 Years' : '5 Years'}
            </div>
            <span className="text-[10px] text-emerald-300">JRF to SRF Upgradeable</span>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-emerald-200">Affiliated Institution</span>
            <div className="text-base sm:text-lg font-bold text-white mt-0.5 truncate">
              {app.formData.foreignUniversity || app.formData.institution || app.formData.university}
            </div>
            <span className="text-[10px] text-emerald-300">
              {app.formData.targetCountry || 'New Delhi, India'}
            </span>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-emerald-200">DBT Bank Gateway</span>
            <div className="text-base sm:text-lg font-bold text-white mt-0.5">
              {app.formData.bankName} (****{app.formData.accountNumber.slice(-4)})
            </div>
            <span className="text-[10px] text-emerald-300">Aadhaar Linked (PFMS NPCI)</span>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Bar */}
      <div className="flex border-b border-slate-200 text-xs font-bold bg-white px-6 rounded-t-2xl pt-3 space-x-6">
        <button
          onClick={() => setActiveTab('disbursement')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'disbursement'
              ? 'border-[#0D3829] text-[#0D3829]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-700" />
          <span>1. DBT Disbursement Schedule (PFMS)</span>
        </button>

        <button
          onClick={() => setActiveTab('onboarding')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'onboarding'
              ? 'border-[#0D3829] text-[#0D3829]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4 text-emerald-700" />
          <span>2. Scholar Onboarding & Joining Report</span>
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'milestones'
              ? 'border-[#0D3829] text-[#0D3829]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-700" />
          <span>3. Continuation & Annual Progress Review</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-b-3xl border border-slate-200 border-t-0 p-6 sm:p-8 shadow-xs">
        {/* TAB 1: DISBURSEMENT SCHEDULE */}
        {activeTab === 'disbursement' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Direct Benefit Transfer (DBT) Electronic Disbursements
                  </h3>
                  <p className="text-xs text-slate-500">Public Financial Management System (PFMS Gateway)</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Live Feed
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { month: 'October 2026', amount: '₹37,000', status: 'Scheduled', date: '01 Nov 2026' },
                  { month: 'September 2026', amount: '₹37,000', status: 'Disbursed', date: '01 Oct 2026', utr: 'SBIN928102910' },
                  { month: 'August 2026', amount: '₹37,000', status: 'Disbursed', date: '01 Sep 2026', utr: 'SBIN891029180' },
                  { month: 'Contingency Grant (Year 1)', amount: '₹12,000', status: 'Disbursed', date: '15 Aug 2026', utr: 'SBIN872910291' },
                ].map((dbt, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          dbt.status === 'Disbursed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{dbt.month}</h4>
                        <span className="text-[10px] text-slate-500">
                          Transfer Date: {dbt.date} {dbt.utr ? `• UTR: ${dbt.utr}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-900">{dbt.amount}</div>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          dbt.status === 'Disbursed'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {dbt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-3">
                Statutory Compliance Milestones
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950">Next Progress Review</span>
                    <span className="text-[10px] font-bold text-emerald-800">Due: 15 Jan 2027</span>
                  </div>
                  <p className="text-slate-600 leading-snug">
                    Annual research progress report certified by Supervisor and Head of Department.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-700">Document Compliance Status</span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span>Aadhaar e-KYC Verification</span>
                      <span className="text-emerald-800 font-bold">✓ Compliant</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span>Scheduled Tribe Community Certificate</span>
                      <span className="text-emerald-800 font-bold">✓ Authenticated</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span>Direct Benefit Transfer (DBT) Mandate</span>
                      <span className="text-emerald-800 font-bold">✓ Active (NPCI)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span>University Joining Bonafide</span>
                      <span className="text-emerald-800 font-bold">✓ Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHOLAR ONBOARDING & JOINING REPORT (Requirement 23: Items 212–214) */}
        {activeTab === 'onboarding' && (
          <div className="max-w-2xl space-y-6 text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Selected Candidate Formal Onboarding (कार्यभार ग्रहण प्रतिवेदन)
              </h3>
              <p className="text-slate-500">
                Submit official joining particulars endorsed by your University Registrar / Department Dean to activate monthly fellowship disbursements.
              </p>
            </div>

            {onboardingSubmitted ? (
              <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>Joining Report Successfully Registered</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Your joining date of <strong>{joiningDate}</strong> and institutional supervisor endorsement have been logged. The University Nodal Officer and MoTA have verified your enrolment bonafide.
                </p>
              </div>
            ) : (
              <form onSubmit={handleJoiningSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Official Date of Joining</label>
                    <input
                      type="date"
                      required
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Supervisor / Guide Institutional Email</label>
                    <input
                      type="email"
                      required
                      value={supervisorEmail}
                      onChange={(e) => setSupervisorEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-slate-700">Allocated Research Lab / Desk Room</label>
                    <input
                      type="text"
                      value={labNumber}
                      onChange={(e) => setLabNumber(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      placeholder="e.g. Room 304, School of Environmental Sciences"
                    />
                  </div>

                  <div className="sm:col-span-2 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <div>
                      <span className="font-bold text-slate-800 block">
                        Upload Countersigned Joining Report (PDF)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Signed & stamped by Head of Department / University Registrar
                      </span>
                    </div>
                    <label className="inline-block cursor-pointer px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#0D3829] text-white hover:bg-[#16533D]">
                      <span>{joiningFileAttached ? 'Report Attached ✓' : 'Select PDF File'}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={() => setJoiningFileAttached(true)}
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-md transition-all active:scale-95"
                >
                  Submit Formal Joining Report to Ministry
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: CONTINUATION & MILESTONES (Requirement 23: Items 217–218) */}
        {activeTab === 'milestones' && (
          <div className="max-w-2xl space-y-6 text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Annual Continuation & Research Progress Review
              </h3>
              <p className="text-slate-500">
                To sustain fellowship disbursements into subsequent academic years and upgrade from JRF to SRF, submit your annual progress documentation.
              </p>
            </div>

            {milestoneSubmitted ? (
              <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>Annual Progress Review Lodged</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Your Year 1 progress report and contingency claim of ₹{parseInt(contingencyAmount).toLocaleString('en-IN')} have been successfully submitted for departmental committee endorsement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Annual Research Progress Summary</label>
                  <textarea
                    rows={4}
                    required
                    value={progressSummary}
                    onChange={(e) => setProgressSummary(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Peer-Reviewed Publications Count</label>
                    <input
                      type="number"
                      value={publicationsCount}
                      onChange={(e) => setPublicationsCount(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Annual Contingency Reimbursement Claim (INR)</label>
                    <input
                      type="number"
                      value={contingencyAmount}
                      onChange={(e) => setContingencyAmount(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={claimHRA}
                      onChange={(e) => setClaimHRA(e.target.checked)}
                      className="accent-emerald-800 rounded"
                    />
                    <span>Claim House Rent Allowance (HRA) (Non-Hosteller Bonafide)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 pl-6">
                    Requires certificate that scholar is not provided university hostel accommodation.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-md transition-all active:scale-95"
                >
                  Submit Annual Progress Review & Claim
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

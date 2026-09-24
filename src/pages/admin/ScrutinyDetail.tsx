import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { HumanInTheLoopBanner } from '../../components/ai/HumanInTheLoopBanner';
import { DocumentViewerModal } from '../../components/document/DocumentViewerModal';
import { DocumentItem } from '../../types';
import { formatDate } from '../../utils/formatters';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Check,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Eye,
  Send,
} from 'lucide-react';

export const ScrutinyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { applications, updateStatus } = useApplication();
  const { success, warning, info } = useToast();
  const navigate = useNavigate();

  const app = applications.find((a) => a.id === id) || applications[0];

  const [activeTab, setActiveTab] = useState<'scrutiny' | 'documents' | 'overview' | 'audit'>('scrutiny');
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);

  // Confirmation Modal State
  const [confirmAction, setConfirmAction] = useState<'approve' | 'deficient' | 'clarify' | null>(null);
  const [officerRemarks, setOfficerRemarks] = useState('');

  if (!app) {
    return <div className="p-8 text-center text-slate-500">Application not found.</div>;
  }

  const handleExecuteApproval = () => {
    updateStatus(app.id, 'Screening', officerRemarks || 'Ministry Scrutiny Cleared: Forwarded to Merit Screening Committee.');
    success('Application Scrutiny Cleared', `${app.id} approved and moved to Screening Committee ranking.`);
    setConfirmAction(null);
    navigate('/admin/screening');
  };

  const handleExecuteDeficient = () => {
    updateStatus(app.id, 'Deficient', officerRemarks || 'Document deficiency flagged during officer scrutiny.');
    warning('Marked as Deficient', `Deficiency notice generated and dispatched to ${app.applicantName}.`);
    setConfirmAction(null);
  };

  const handleExecuteClarify = () => {
    info('Clarification Requested', `Query dispatched to ${app.applicantName} via official portal notification.`);
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/admin/scrutiny"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Scrutiny Queue</span>
      </Link>

      {/* Header Card (Requirement 28) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                Official Scrutiny Desk
              </span>
              <span className="text-xs text-slate-500 font-mono">Dossier: {app.id}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <span>{app.applicantName}</span>
              <span className="text-sm font-normal text-slate-500 font-mono">({app.schemeCode})</span>
            </h1>
            <p className="text-xs text-slate-600">
              {app.schemeName} • {app.formData.institution || app.formData.university}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={app.status} size="lg" />
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex space-x-4 border-b border-slate-200 text-xs font-bold pt-2">
          <button
            onClick={() => setActiveTab('scrutiny')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'scrutiny'
                ? 'border-[#0D3829] text-[#0D3829]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI-Assisted Scrutiny</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'documents'
                ? 'border-[#0D3829] text-[#0D3829]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Documents ({app.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'border-[#0D3829] text-[#0D3829]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Dossier Particulars</span>
          </button>
        </div>
      </div>

      {/* Human-in-the-Loop Banner (Requirement 30) */}
      <HumanInTheLoopBanner />

      {/* Tab 1: AI-Assisted Scrutiny Panel (Requirement 29) */}
      {activeTab === 'scrutiny' && (
        <div className="space-y-6">
          {/* Main Scrutiny Metrics Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Decision Support Analysis
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  AI-Assisted Scrutiny Assessment
                </h2>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">Overall AI Confidence</span>
                <div className="text-3xl font-black font-mono text-emerald-800">
                  {app.aiScrutinyReport?.overallConfidence || 96.2}%
                </div>
              </div>
            </div>

            {/* 6 Metric Indicators (Requirement 29) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500">Eligibility Criteria</span>
                <div className="text-base font-bold text-emerald-800 mt-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>PASS (Rule Verified)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500">Document Completeness</span>
                <div className="text-base font-bold text-emerald-800 mt-0.5">
                  100% (All 7 Present)
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500">Cross-Document Consistency</span>
                <div className="text-base font-bold text-emerald-800 mt-0.5">
                  98.6% Match
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500">Duplicate Application Check</span>
                <div className="text-base font-bold text-slate-800 mt-0.5">
                  Low Risk (0 Duplicates)
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500">Anomaly & Tamper Indicator</span>
                <div className="text-base font-bold text-slate-800 mt-0.5">
                  Low (Clean PAdES DSC)
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500">Risk Flags</span>
                <div className="text-base font-bold text-slate-800 mt-0.5">
                  0 Critical • 0 Info
                </div>
              </div>
            </div>

            {/* AI Recommendation Box (Requirement 29) */}
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>AI Recommendation: {app.aiScrutinyReport?.recommendation || 'Recommend for human approval'}</span>
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Ready for Signature
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {app.aiScrutinyReport?.recommendationDetails ||
                  'All mandatory documents are present. Extracted identity and academic details are consistent across submitted documents. No significant anomaly indicators detected.'}
              </p>
            </div>

            {/* Officer Sovereign Action Buttons (Requirement 30) */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Authorized Officer Digital Decision:
              </span>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    setConfirmAction('clarify');
                    setOfficerRemarks('Please provide clarification regarding enrolment registration number.');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                >
                  Request Clarification
                </button>

                <button
                  onClick={() => {
                    setConfirmAction('deficient');
                    setOfficerRemarks('Document validity expired.');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                >
                  Mark Deficient
                </button>

                <button
                  onClick={() => {
                    setConfirmAction('approve');
                    setOfficerRemarks('Recommended for Merit Screening Committee.');
                  }}
                  className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-md transition-all active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Eligibility & Forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Documents Grid */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Mandatory Documents & Extracted OCR Metadata
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {app.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg text-emerald-800 border">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{doc.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{doc.fileName}</span>
                  </div>
                </div>

                <button
                  onClick={() => setViewingDoc(doc)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0D3829] text-white"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Dossier Particulars */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b pb-3">
            Candidate Application Dossier Particulars
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Personal Details */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-[#0D3829]">
                Personal & Socio-Economic Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Full Name</span>
                  <span className="font-bold text-slate-900">{app.applicantName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Gender & DOB</span>
                  <span className="font-semibold text-slate-800">{app.formData.gender || 'Female'} • {app.formData.dob || '1998-05-12'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Tribal Community (ST)</span>
                  <span className="font-semibold text-slate-800">{app.formData.tribeCommunity || 'Santhal'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Declared Family Income</span>
                  <span className="font-bold text-emerald-800 font-mono">₹{app.formData.annualIncome ? Number(app.formData.annualIncome).toLocaleString('en-IN') : '2,40,000'} / annum</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Domicile / District</span>
                  <span className="font-semibold text-slate-800">{app.formData.state || 'Jharkhand'}</span>
                </div>
              </div>
            </div>

            {/* Academic & Scheme Details */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-[#0D3829]">
                Enrolment & Academic Undertaking
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Scheme Code</span>
                  <span className="font-bold text-slate-900 font-mono">{app.schemeCode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Course / Programme</span>
                  <span className="font-semibold text-slate-800">{app.formData.course || 'Ph.D in Ecology'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Institution / University</span>
                  <span className="font-semibold text-slate-800">{app.formData.foreignUniversity || app.formData.institution || app.formData.university || 'IIT Delhi'}</span>
                </div>
                {app.formData.targetCountry && (
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500">Host Country & QS Rank</span>
                    <span className="font-bold text-indigo-700">{app.formData.targetCountry} (QS #{app.formData.qsRanking || '3'})</span>
                  </div>
                )}
                {app.formData.passportNumber && (
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500">Passport Number</span>
                    <span className="font-mono font-bold text-slate-900">{app.formData.passportNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Qualifying Marks / CGPA</span>
                  <span className="font-bold text-slate-800 font-mono">{app.formData.percentageOrCgpa || '78.5%'}</span>
                </div>
              </div>
            </div>

            {/* Direct Benefit Transfer (DBT) Banking Details */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 md:col-span-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-[#0D3829]">
                Direct Benefit Transfer (DBT) & Aadhaar Bank Seeding
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-slate-500 block">Bank & Account</span>
                  <span className="font-mono font-bold text-slate-900">{app.formData.bankName || 'State Bank of India'} - ••••{app.formData.accountNumber ? app.formData.accountNumber.slice(-4) : '4829'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">IFSC Code</span>
                  <span className="font-mono font-bold text-slate-900">{app.formData.ifsc || 'SBIN0001005'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">NPCI Aadhaar Bridge</span>
                  <span className="inline-flex items-center text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Confirm Official Ministerial Action
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are about to execute action: <strong className="uppercase">{confirmAction}</strong> on application <strong className="font-mono">{app.id}</strong>.
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Official Remarks for Record / Audit Trail</label>
              <textarea
                rows={3}
                value={officerRemarks}
                onChange={(e) => setOfficerRemarks(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={
                  confirmAction === 'approve'
                    ? handleExecuteApproval
                    : confirmAction === 'deficient'
                    ? handleExecuteDeficient
                    : handleExecuteClarify
                }
                className="px-6 py-2 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-xs"
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Inspector Modal */}
      <DocumentViewerModal
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        document={viewingDoc}
        readOnly={false}
        onAccept={() => success('Document Accepted', `${viewingDoc?.name} validated for official approval.`)}
        onFlag={() => warning('Document Flagged', `${viewingDoc?.name} marked with deficiency note.`)}
      />
    </div>
  );
};

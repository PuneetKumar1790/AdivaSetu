import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { downloadMockCertificate } from '../../utils/pdfGenerator';
import { DocumentViewerModal } from '../../components/document/DocumentViewerModal';
import { DocumentItem } from '../../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Shield,
  User,
  Building,
  ArrowLeft,
  Eye,
  History,
  Check,
} from 'lucide-react';

export const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { applications } = useApplication();

  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'documents' | 'audit'>('timeline');
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);

  const app = applications.find((a) => a.id === id) || applications[0];

  if (!app) {
    return (
      <div className="p-8 text-center text-slate-500">
        Application not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/applicant/applications"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to My Applications</span>
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {app.schemeCode}
              </span>
              <span className="text-xs text-slate-400 font-mono">Ref No.</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {app.id}
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              {app.schemeName}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Lifecycle Stage:</span>
              <StatusBadge status={app.status} size="lg" />
            </div>
            <button
              onClick={() => downloadMockCertificate(app)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-800" />
              <span>Download Sanction / Receipt</span>
            </button>
          </div>
        </div>

        {/* Overview row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500">Applicant Name</span>
            <div className="font-bold text-slate-900 mt-0.5">{app.applicantName}</div>
          </div>
          <div>
            <span className="text-slate-500">Date of Submission</span>
            <div className="font-bold text-slate-900 mt-0.5">{formatDate(app.submittedAt)}</div>
          </div>
          <div>
            <span className="text-slate-500">AI Consistency Score</span>
            <div className="font-bold text-emerald-800 mt-0.5">{app.aiScore}% Verified</div>
          </div>
          <div>
            <span className="text-slate-500">Enrolled Institution</span>
            <div className="font-bold text-slate-900 mt-0.5 truncate">
              {app.formData.institution || app.formData.university}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 pt-2 space-x-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'timeline'
                ? 'border-[#0D3829] text-[#0D3829]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Workflow Timeline</span>
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
            <span>Submitted Documents ({app.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'details'
                ? 'border-[#0D3829] text-[#0D3829]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Application Particulars</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'audit'
                ? 'border-[#0D3829] text-[#0D3829]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Digital Audit Trail ({app.auditTrail.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Workflow Timeline (Requirement 22) */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Official Progress Timeline (प्रगति कालक्रम)
            </h3>
            <p className="text-xs text-slate-500">
              End-to-end transparent state transitions recorded across ministerial milestones.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {app.timeline.map((stage) => {
              const isCompleted = stage.status === 'completed';
              const isInProgress = stage.status === 'in_progress';
              const isAlert = stage.status === 'alert';

              return (
                <div key={stage.id} className="relative space-y-1">
                  {/* Timeline circle node */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs ${
                      isCompleted
                        ? 'bg-[#0D3829] text-white'
                        : isInProgress
                        ? 'bg-amber-500 text-slate-950 font-bold ring-4 ring-amber-100'
                        : isAlert
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : isAlert ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">{stage.name}</h4>
                      <span className="text-xs text-slate-500 font-hindi">({stage.hindiName})</span>
                    </div>
                    {stage.date && (
                      <span className="text-[11px] font-semibold text-slate-500 font-mono">
                        {stage.date}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {stage.description}
                  </p>

                  {stage.actor && (
                    <div className="text-[11px] text-slate-400 font-medium">
                      Action Executed By: <span className="text-slate-600 font-semibold">{stage.actor}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Submitted Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Submitted Documents & AI Inspection Status
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {app.documents.filter((d) => d.verificationStatus === 'verified').length} of {app.documents.length} Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {app.documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                  doc.verificationStatus === 'verified'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2.5">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-emerald-800 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{doc.fileName}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      doc.verificationStatus === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-200 text-amber-950'
                    }`}
                  >
                    {doc.verificationStatus}
                  </span>
                </div>

                {doc.flagReason && (
                  <p className="text-[11px] text-rose-800 bg-rose-50 p-2 rounded-lg border border-rose-200 leading-snug">
                    {doc.flagReason}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    Confidence: <strong>{doc.aiConfidence || 98.4}%</strong>
                  </span>
                  <button
                    onClick={() => setViewingDoc(doc)}
                    className="flex items-center space-x-1 text-emerald-800 hover:text-emerald-950 font-bold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View & Inspect</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Application Particulars */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 uppercase tracking-wider">
              1. Personal Particulars
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3">
              <div>
                <span className="text-slate-500">Full Name</span>
                <div className="font-bold text-slate-900 mt-0.5">{app.formData.fullName}</div>
              </div>
              <div>
                <span className="text-slate-500">Date of Birth</span>
                <div className="font-bold text-slate-900 mt-0.5">{app.formData.dob}</div>
              </div>
              <div>
                <span className="text-slate-500">Community / Tribe</span>
                <div className="font-bold text-slate-900 mt-0.5">{app.formData.tribeCommunity} (ST)</div>
              </div>
              <div>
                <span className="text-slate-500">Father's Name</span>
                <div className="font-bold text-slate-900 mt-0.5">{app.formData.fatherName}</div>
              </div>
              <div>
                <span className="text-slate-500">Mother's Name</span>
                <div className="font-bold text-slate-900 mt-0.5">{app.formData.motherName}</div>
              </div>
              <div>
                <span className="text-slate-500">Aadhaar Reference</span>
                <div className="font-bold text-slate-900 mt-0.5 font-mono">XXXX XXXX 2841</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 uppercase tracking-wider">
              2. Academic & Research Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3">
              <div>
                <span className="text-slate-500">Highest Qualification</span>
                <div className="font-bold text-slate-900 mt-0.5">{app.formData.highestQualification}</div>
              </div>
              <div>
                <span className="text-slate-500">Enrolled Course</span>
                <div className="font-bold text-slate-900 mt-0.5">{app.formData.course}</div>
              </div>
              <div>
                <span className="text-slate-500">Academic Score</span>
                <div className="font-bold text-slate-900 mt-0.5">{app.formData.percentageOrCgpa}</div>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Research Synopsis Title</span>
                <div className="font-bold text-slate-900 mt-0.5 leading-relaxed">
                  {app.formData.researchProposalTitle || 'Evolving Agroforestry and Water Retention Systems of Gond Communities'}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Research Supervisor</span>
                <div className="font-bold text-slate-900 mt-0.5">{app.formData.supervisorName || 'Prof. S. R. Ramaswamy'}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 uppercase tracking-wider">
              3. Direct Benefit Transfer (DBT) Bank Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3">
              <div>
                <span className="text-slate-500">Bank Name</span>
                <div className="font-bold text-slate-900 mt-0.5">{app.formData.bankName}</div>
              </div>
              <div>
                <span className="text-slate-500">Account Number</span>
                <div className="font-bold text-slate-900 mt-0.5 font-mono">XXXX XXXX 4821</div>
              </div>
              <div>
                <span className="text-slate-500">IFSC Code</span>
                <div className="font-bold text-slate-900 mt-0.5 font-mono">{app.formData.ifsc}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Digital Audit Trail (Requirement 23) */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-800" />
                <span>Cryptographic & Digital Audit Trail (अंकीय अंकेक्षण पंजी)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Immutable chronological log of all applicant uploads, AI evaluations, and officer actions.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Audit Hash: SHA256:7fa8912b
            </span>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
            {app.auditTrail.map((ev) => (
              <div key={ev.id} className="p-4 flex items-start space-x-3.5 hover:bg-slate-50/80 transition-colors">
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    ev.statusType === 'success'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ev.statusType === 'alert'
                      ? 'bg-rose-100 text-rose-800'
                      : ev.statusType === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-slate-900">{ev.action}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDateTime(ev.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ev.description}</p>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Actor: <strong className="text-slate-700">{ev.actor}</strong> ({ev.actorRole})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Inspector Modal */}
      <DocumentViewerModal
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        document={viewingDoc}
        readOnly={true}
      />
    </div>
  );
};

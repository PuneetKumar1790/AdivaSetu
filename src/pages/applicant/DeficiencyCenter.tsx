import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';
import { mockDocumentService } from '../../services/mockDocumentService';
import { AIVerificationModal } from '../../components/ai/AIVerificationModal';
import { DocumentItem } from '../../types';
import {
  AlertTriangle,
  Upload,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const DeficiencyCenter: React.FC = () => {
  const { applications, resolveDeficiency } = useApplication();
  const { success, warning } = useToast();
  const navigate = useNavigate();

  // Active targeted application
  const app = applications.find((a) => a.id === 'ADVS-NFST-2026-00482') || applications[0];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocItem, setSelectedDocItem] = useState<DocumentItem | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [reverifiedSuccess, setReverifiedSuccess] = useState(false);

  if (!app) {
    return <div className="p-8 text-center text-slate-500">No application found.</div>;
  }

  const openDeficiencies = app.deficiencies.filter((d) => d.status === 'open');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create target doc item for simulation
      const docItem: DocumentItem = {
        id: 'doc-income-corr',
        type: 'income_certificate',
        name: 'Annual Family Income Certificate (FY 2026-27)',
        fileName: file.name,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        required: true,
        verificationStatus: 'pending',
      };
      setSelectedDocItem(docItem);
      setIsAIModalOpen(true);
    }
  };

  const handleVerificationComplete = (result: {
    status: 'verified' | 'deficient';
    confidence: number;
    extractedData: Record<string, string>;
  }) => {
    if (result.status === 'verified') {
      setReverifiedSuccess(true);
      success('AI Verification Complete', 'New Income Certificate verified with 98.2% confidence.');
    } else {
      warning('Document Flagged', 'Uploaded document did not meet validity criteria.');
    }
  };

  const handleSubmitResubmission = () => {
    if (!selectedFile) return;

    const fileUrl = URL.createObjectURL(selectedFile);
    resolveDeficiency(
      app.id,
      'income_certificate',
      fileUrl,
      selectedFile.name,
      `${Math.round(selectedFile.size / 1024)} KB`
    );

    success(
      'Application Resubmitted Successfully',
      'Your application has been updated to Resubmitted status and forwarded to the Ministry Officer scrutiny queue.'
    );

    navigate(`/applicant/applications/${app.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Correction Workspace
            </span>
            <span className="text-xs text-slate-500 font-mono">{app.id}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Deficiency Resolution Center (त्रुटि निवारण केंद्र)
          </h1>
          <p className="text-xs text-slate-500">
            Resolve issues flagged by the automated AI scrutiny engine to resume official evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Pending Issues:</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            {openDeficiencies.length} Action Required
          </span>
        </div>
      </div>

      {openDeficiencies.length > 0 ? (
        <div className="space-y-6">
          {openDeficiencies.map((def) => (
            <div
              key={def.id}
              className="bg-white rounded-3xl border-2 border-amber-300 shadow-md overflow-hidden"
            >
              {/* Issue Banner */}
              <div className="bg-amber-500/10 border-b border-amber-200 p-4 sm:p-6 flex items-start space-x-3.5">
                <div className="p-2 bg-amber-500 text-slate-950 rounded-xl shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-amber-950" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{def.documentName}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 uppercase tracking-wider">
                      High Severity
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-amber-950 mt-1">
                    Issue: {def.issue}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    <strong>Regulatory Rationale:</strong> {def.reason}
                  </p>
                </div>
              </div>

              {/* Resolution Form Area */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Recommended Action
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {def.recommendedAction}
                  </p>
                </div>

                {/* Split Comparison View: Old (Deficient) vs New (Verified) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Deficient File */}
                  <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900">Current File (Deficient)</span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        Expired 2023
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-700">
                      <FileText className="w-4 h-4 text-rose-600" />
                      <span>Income_Certificate_Old.pdf</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Issue Date: 10 April 2023 (Validity lapsed).
                    </p>
                  </div>

                  {/* Upload New Replacement File */}
                  <div
                    className={`p-4 rounded-2xl border transition-all space-y-2 ${
                      reverifiedSuccess
                        ? 'border-emerald-300 bg-emerald-50/60'
                        : 'border-slate-300 bg-slate-50 hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        {reverifiedSuccess ? 'Replacement File (Verified)' : 'Upload Valid Replacement'}
                      </span>
                      {reverifiedSuccess && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>AI Score: 98.2%</span>
                        </span>
                      )}
                    </div>

                    {!selectedFile ? (
                      <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-emerald-700 rounded-xl cursor-pointer bg-white transition-colors">
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-xs font-semibold text-emerald-900">
                          Select valid Revenue Certificate
                        </span>
                        <span className="text-[10px] text-slate-400">PDF, JPG or PNG up to 5 MB</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                          <div className="flex items-center space-x-2 truncate">
                            <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span className="truncate">{selectedFile.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {Math.round(selectedFile.size / 1024)} KB
                          </span>
                        </div>

                        <label className="text-[11px] text-emerald-800 font-semibold cursor-pointer hover:underline block text-center">
                          Choose another file
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Re-verification & Final Submission */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Automated AI verification runs before submission.</span>
                  </div>

                  <button
                    onClick={handleSubmitResubmission}
                    disabled={!reverifiedSuccess}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Submit for Re-verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Zero Deficiency State */
        <div className="p-12 bg-white rounded-3xl border border-slate-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-slate-900">All Deficiencies Resolved</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your application has no pending document deficiencies. The file is currently being evaluated in the Ministry Officer scrutiny queue.
            </p>
          </div>
          <button
            onClick={() => navigate(`/applicant/applications/${app.id}`)}
            className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0D3829] text-white hover:bg-[#16533D]"
          >
            <span>Track Application Timeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* AI Verification Scanner Modal */}
      <AIVerificationModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        document={selectedDocItem}
        isCorrectionFlow={true}
        onVerificationComplete={handleVerificationComplete}
      />
    </div>
  );
};

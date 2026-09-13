import React from 'react';
import { DocumentItem } from '../../types';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Download, RefreshCw, FileText } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  onAccept?: () => void;
  onFlag?: () => void;
  onReplace?: () => void;
  readOnly?: boolean;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document,
  onAccept,
  onFlag,
  onReplace,
  readOnly = false,
}) => {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#0D3829] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-800/80 rounded-lg text-emerald-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">{document.name}</h3>
              <p className="text-xs text-emerald-200/80">
                {document.fileName || 'Uploaded Document'} • {document.fileSize || '1.4 MB'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                document.verificationStatus === 'verified'
                  ? 'bg-emerald-900/60 text-emerald-300 border-emerald-600'
                  : 'bg-amber-900/60 text-amber-300 border-amber-600'
              }`}
            >
              {document.verificationStatus === 'verified' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              <span className="capitalize">{document.verificationStatus}</span>
            </span>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-emerald-800/80 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Two-Column Workspace (Requirement 36) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-slate-100">
          {/* Left Column: Document Visual Preview (7 cols) */}
          <div className="md:col-span-7 p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-center border-r border-slate-200 bg-slate-200/60">
            {document.fileUrl ? (
              <div className="w-full h-full max-h-[580px] bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden flex flex-col items-center justify-center p-2">
                <iframe
                  src={document.fileUrl}
                  title="Document Preview"
                  className="w-full h-full rounded border-0"
                />
              </div>
            ) : (
              /* High-fidelity Mock Official Certificate Canvas */
              <div className="w-full max-w-md bg-white rounded-lg shadow-xl border-4 border-double border-[#0D3829] p-6 text-center space-y-4">
                <div className="border-b-2 border-slate-200 pb-3">
                  <div className="text-xs font-bold text-amber-700 tracking-wider">
                    GOVERNMENT OF INDIA / भारत सरकार
                  </div>
                  <div className="text-sm font-black text-emerald-950 mt-0.5">
                    OFFICIAL CERTIFICATE & RECORD ARCHIVE
                  </div>
                  <div className="text-[10px] text-slate-500">
                    UID / Digital Seal Authenticated via National State Portal
                  </div>
                </div>

                <div className="py-4 space-y-2 text-left text-xs text-slate-700">
                  <p className="font-semibold text-center text-sm text-[#0D3829] underline">
                    {document.name.toUpperCase()}
                  </p>
                  <p>
                    This is to certify that the credentials and particulars presented by the scholar have been verified with competent statutory authorities.
                  </p>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono space-y-1">
                    <div>Ref ID: {document.id.toUpperCase()}-2026-GOV</div>
                    <div>Digital Timestamp: {document.uploadedAt || '2026-09-10 10:35:00 IST'}</div>
                    <div>Integrity Hash: SHA-256 (PAdES Certified)</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                  <div className="flex items-center gap-1 text-emerald-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>e-Sign Verified</span>
                  </div>
                  <span>Competent Issuing Officer</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Extracted Data & Recommendations (5 cols) */}
          <div className="md:col-span-5 p-6 bg-white overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    AI Extracted Data
                  </h4>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Confidence: {document.aiConfidence || 98.4}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Automated OCR extraction mapped against applicant form data.
                </p>
              </div>

              {/* Extracted Fields */}
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {document.extractedData && Object.keys(document.extractedData).length > 0 ? (
                  Object.entries(document.extractedData).map(([key, val]) => (
                    <div key={key} className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="text-slate-900 font-semibold text-right">{val}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-500">Document Name</span>
                      <span className="text-slate-900 font-semibold">{document.name}</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-500">Verification Engine</span>
                      <span className="text-slate-900 font-semibold">Vision OCR v2.4</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-500">OCR Decision</span>
                      <span className="text-emerald-700 font-bold">PASS (No Tampering)</span>
                    </div>
                  </>
                )}
              </div>

              {/* Flag reason if deficient */}
              {document.flagReason && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Deficiency Flag:</span>
                    <p className="mt-0.5 opacity-90 leading-relaxed">{document.flagReason}</p>
                  </div>
                </div>
              )}
            </div>

              {/* Action Buttons (Requirement 36: Accept, Flag, Replace) */}
              {!readOnly && (
                <div className="pt-6 border-t border-slate-200 flex flex-col gap-2 shrink-0">
                  <div className="grid grid-cols-2 gap-2">
                    {onAccept && (
                      <button
                        onClick={() => {
                          onAccept();
                          onClose();
                        }}
                        className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Document</span>
                      </button>
                    )}
                    {onFlag && (
                      <button
                        onClick={() => {
                          onFlag();
                          onClose();
                        }}
                        className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-2xs"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Flag Deficiency</span>
                      </button>
                    )}
                  </div>
                  {onReplace && (
                    <button
                      onClick={() => {
                        onReplace();
                        onClose();
                      }}
                      className="w-full flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-300"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Replace Document</span>
                    </button>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

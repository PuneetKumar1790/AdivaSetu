import React, { useState } from 'react';
import { useApplication } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';
import { DocumentItem } from '../../types';
import { DocumentViewerModal } from '../../components/document/DocumentViewerModal';
import { AIVerificationModal } from '../../components/ai/AIVerificationModal';
import { mockDocumentService } from '../../services/mockDocumentService';
import {
  FolderLock,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const DocumentsVault: React.FC = () => {
  const { applications, updateApplication } = useApplication();
  const { success } = useToast();

  const primaryApp = applications.find((a) => a.id === 'ADVS-NFST-2026-00482') || applications[0];

  const [docs, setDocs] = useState<DocumentItem[]>(primaryApp?.documents || []);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [verifyingDoc, setVerifyingDoc] = useState<DocumentItem | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const processed = mockDocumentService.processUploadedFile(file, 'st_certificate', file.name);

      const updated = docs.map((d) =>
        d.id === docId
          ? {
              ...d,
              fileUrl: processed.fileUrl,
              fileName: processed.fileName,
              fileSize: processed.fileSize,
              verificationStatus: 'pending' as const,
            }
          : d
      );
      setDocs(updated);
      success('File Uploaded', `${file.name} added to your secure document locker.`);

      const target = updated.find((d) => d.id === docId);
      if (target) {
        setVerifyingDoc(target);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            DigiLocker & Document Vault
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Verified Document Vault</h1>
          <p className="text-xs text-slate-500 font-hindi">
            प्रमाणित दस्तावेज़ लॉकर एवं एआई सत्यापन
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>DigiLocker e-Pramaan Synced</span>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
              doc.verificationStatus === 'verified'
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-amber-50/70 border-amber-300 shadow-xs'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-slate-100 rounded-xl text-emerald-800 shrink-0 border border-slate-200">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {doc.fileName || 'Pending Upload'} • {doc.fileSize || '—'}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    doc.verificationStatus === 'verified'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {doc.verificationStatus === 'verified' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                  )}
                  <span>{doc.verificationStatus}</span>
                </span>
              </div>

              {doc.flagReason && (
                <div className="p-2.5 bg-amber-100/70 border border-amber-300 rounded-xl text-[11px] text-amber-950 leading-snug">
                  <strong>Deficiency:</strong> {doc.flagReason}
                </div>
              )}

              {doc.aiConfidence && (
                <div className="text-[11px] text-slate-500">
                  OCR Matching Index: <strong className="text-slate-800">{doc.aiConfidence}%</strong>
                </div>
              )}
            </div>

            {/* Actions (Requirement 16: View, Replace, Verify) */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setViewingDoc(doc)}
                className="flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              <label className="cursor-pointer flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, doc.id)}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setVerifyingDoc(doc)}
                className="flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-[#0D3829] hover:bg-[#16533D] text-white font-bold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verify</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <DocumentViewerModal
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        document={viewingDoc}
        readOnly={false}
        onReplace={() => {
          // Trigger replace
          setViewingDoc(null);
        }}
      />

      <AIVerificationModal
        isOpen={!!verifyingDoc}
        onClose={() => setVerifyingDoc(null)}
        document={verifyingDoc}
        onVerificationComplete={(res) => {
          if (verifyingDoc) {
            setDocs((prev) =>
              prev.map((d) =>
                d.id === verifyingDoc.id
                  ? {
                      ...d,
                      verificationStatus: res.status,
                      aiConfidence: res.confidence,
                      extractedData: res.extractedData,
                      flagReason: res.flagReason,
                    }
                  : d
              )
            );
          }
        }}
      />
    </div>
  );
};

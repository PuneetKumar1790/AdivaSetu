import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, Loader2, FileText, Check, ArrowRight } from 'lucide-react';
import { AI_SCAN_STAGES } from '../../services/mockDocumentService';
import { DocumentItem, DocumentType } from '../../types';

interface AIVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  onVerificationComplete: (result: {
    status: 'verified' | 'deficient';
    confidence: number;
    extractedData: Record<string, string>;
    flagReason?: string;
  }) => void;
  isCorrectionFlow?: boolean;
}

export const AIVerificationModal: React.FC<AIVerificationModalProps> = ({
  isOpen,
  onClose,
  document,
  onVerificationComplete,
  isCorrectionFlow = false,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [extractedFields, setExtractedFields] = useState<Record<string, string>>({});
  const [finalStatus, setFinalStatus] = useState<'verified' | 'deficient'>('verified');
  const [confidence, setConfidence] = useState(98.4);
  const [flagReason, setFlagReason] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isOpen || !document) {
      setCurrentStageIndex(0);
      setIsDone(false);
      return;
    }

    setCurrentStageIndex(0);
    setIsDone(false);

    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < AI_SCAN_STAGES.length) {
        setCurrentStageIndex(stage);
      } else {
        clearInterval(interval);
        // Determine result
        const isDeficient =
          !isCorrectionFlow &&
          document.type === 'income_certificate' &&
          (document.fileName?.toLowerCase().includes('old') || !document.fileName?.toLowerCase().includes('2026'));

        if (isDeficient) {
          setFinalStatus('deficient');
          setConfidence(71.0);
          setFlagReason('Certificate issue date (2023) expired. Scheme guidelines mandate current annual validity.');
          setExtractedFields({
            'Document Type': 'Income Certificate',
            'Certificate Number': 'INC/DEL/2023/4921',
            'Issuing Authority': 'Tehsildar, South-West Delhi',
            'Gross Annual Income': '₹2,40,000',
            'Status': 'EXPIRED VALIDITY',
          });
        } else {
          setFinalStatus('verified');
          setConfidence(98.4);
          setFlagReason(undefined);
          setExtractedFields({
            'Document Type': document.name,
            'Candidate Name': 'Aarav Kumar',
            'Authenticity Seal': 'Digitally Verified DSC / QR',
            'Scheme Rule Match': '100% Satisfied',
            'Integrity Check': 'Pass (Zero Tamper Indicators)',
          });
        }
        setIsDone(true);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen, document, isCorrectionFlow]);

  if (!isOpen || !document) return null;

  const handleApply = () => {
    onVerificationComplete({
      status: finalStatus,
      confidence,
      extractedData: extractedFields,
      flagReason,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D3829] to-[#16533D] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wide">
                AI Document Intelligence Pipeline
              </h3>
              <p className="text-xs text-emerald-200 font-hindi">
                स्वचालित दस्तावेज़ विश्लेषण एवं सत्यापन प्रणाली
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-white/10 px-2.5 py-1 rounded-full text-emerald-100 border border-white/20">
            Vision OCR v2.4
          </span>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Target Document Info */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{document.name}</h4>
                <p className="text-xs text-slate-500 font-mono">
                  {document.fileName || 'Uploaded_Document.pdf'}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
              {document.fileSize || '1.4 MB'}
            </span>
          </div>

          {!isDone ? (
            /* Active Progress Steps */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing document...
                </span>
                <span>
                  Stage {currentStageIndex + 1} of {AI_SCAN_STAGES.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-emerald-700 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStageIndex + 1) / AI_SCAN_STAGES.length) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Pipeline Step List */}
              <div className="space-y-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {AI_SCAN_STAGES.map((stg, i) => {
                  const isCompleted = i < currentStageIndex;
                  const isCurrent = i === currentStageIndex;
                  return (
                    <div
                      key={stg.stage}
                      className={`flex items-center justify-between text-xs py-1 px-2 rounded-md transition-colors ${
                        isCurrent
                          ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                          : isCompleted
                          ? 'text-slate-600'
                          : 'text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 className="w-3.5 h-3.5 text-emerald-700 animate-spin shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"></div>
                        )}
                        <span>{stg.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-hindi">
                        {stg.hindiName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-4 animate-in fade-in duration-300">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  finalStatus === 'verified'
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-300 text-amber-950'
                }`}
              >
                {finalStatus === 'verified' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold">
                      {finalStatus === 'verified' ? 'AI Verification Passed' : 'Deficiency Detected'}
                    </h4>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white shadow-2xs border">
                      Confidence: {confidence}%
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {finalStatus === 'verified'
                      ? 'All required security seals, OCR fields, and scheme criteria are successfully validated.'
                      : flagReason}
                  </p>
                </div>
              </div>

              {/* Extracted Fields Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 flex justify-between">
                  <span>OCR Extracted Fields</span>
                  <span className="text-emerald-700 font-semibold">Structured Meta</span>
                </div>
                <div className="divide-y divide-slate-200 text-xs">
                  {Object.entries(extractedFields).map(([k, v]) => (
                    <div key={k} className="px-3.5 py-2 flex justify-between gap-2">
                      <span className="font-semibold text-slate-600">{k}</span>
                      <span className="text-slate-900 font-mono text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic text-center">
                AI recommendation provides decision support — official human scrutiny validates final sanction.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
          >
            Cancel
          </button>
          {isDone && (
            <button
              onClick={handleApply}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg text-xs font-bold bg-[#0D3829] text-white hover:bg-[#16533D] transition-colors shadow-sm"
            >
              <span>Apply Verification Result</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

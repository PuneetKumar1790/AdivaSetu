import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Loader2,
  FileText,
  Check,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCheck,
} from 'lucide-react';
import { AI_SCAN_STAGES } from '../../services/mockDocumentService';
import { ApplicationFormData, DocumentItem, DocumentType, Scheme } from '../../types';

interface ComparisonRow {
  field: string;
  extractedValue: string;
  formValue: string;
  match: boolean;
  notes: string;
}

interface AIVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  applicantFormData?: Partial<ApplicationFormData>;
  activeScheme?: Scheme;
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
  applicantFormData,
  activeScheme,
  onVerificationComplete,
  isCorrectionFlow = false,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [extractedFields, setExtractedFields] = useState<Record<string, string>>({});
  const [comparisons, setComparisons] = useState<ComparisonRow[]>([]);
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

        const candidateName = applicantFormData?.fullName || 'Aarav Kumar';
        const declaredIncome = applicantFormData?.annualIncome || '240000';
        const formattedIncome = `₹${parseInt(declaredIncome).toLocaleString('en-IN')}`;
        const ceiling = activeScheme?.maxIncomeCeiling || 600000;

        // Check if document is intentionally simulated as expired/deficient
        const isDeficient =
          !isCorrectionFlow &&
          document.type === 'income_certificate' &&
          (document.fileName?.toLowerCase().includes('old') ||
            document.fileName?.toLowerCase().includes('2023') ||
            (!document.fileName?.toLowerCase().includes('2026') && !document.fileName?.toLowerCase().includes('valid')));

        if (isDeficient) {
          setFinalStatus('deficient');
          setConfidence(71.2);
          const reason =
            'Income certificate issue date (FY 2023-24) has expired. Statutory MoTA guidelines mandate valid certificate for current FY 2026-27.';
          setFlagReason(reason);

          setExtractedFields({
            'Document Classification': 'Annual Family Income Certificate',
            'Certificate Number': 'INC/DEL/2023/4921',
            'Certificate Holder': candidateName,
            'Certified Annual Income': formattedIncome,
            'Validity Period': 'Financial Year 2023-24 (EXPIRED)',
            'Issuing Authority': 'Tehsildar Office, South-West Delhi',
            'Digital Verification': 'Revoked / Expired in Revenue e-Pramaan Gateway',
          });

          setComparisons([
            {
              field: 'Candidate Name',
              extractedValue: candidateName,
              formValue: candidateName,
              match: true,
              notes: 'Exact 100% string match',
            },
            {
              field: 'Declared Income',
              extractedValue: formattedIncome,
              formValue: formattedIncome,
              match: true,
              notes: 'Within prescribed ceiling',
            },
            {
              field: 'Financial Year Validity',
              extractedValue: 'FY 2023-24 (Expired)',
              formValue: 'FY 2026-27 (Mandatory)',
              match: false,
              notes: 'Deficiency: Document older than 12 months',
            },
          ]);
        } else if (document.type === 'passport') {
          setFinalStatus('verified');
          setConfidence(99.4);
          setFlagReason(undefined);
          const passNo = applicantFormData?.passportNumber || 'Z9482014';

          setExtractedFields({
            'Document Classification': 'Republic of India Regular Passport',
            'Passport Number': passNo,
            'Given Name': candidateName.split(' ')[0],
            'Surname': candidateName.split(' ')[1] || 'Kumar',
            'Nationality': 'INDIAN',
            'Date of Expiry': '14 November 2034',
            'ICAO 9303 Compliance': 'Biometric Machine Readable Zone (MRZ) Valid',
          });

          setComparisons([
            {
              field: 'Holder Name',
              extractedValue: candidateName,
              formValue: candidateName,
              match: true,
              notes: 'Exact match with application identity',
            },
            {
              field: 'Passport Number',
              extractedValue: passNo,
              formValue: passNo,
              match: true,
              notes: 'Matches declared passport particulars',
            },
            {
              field: 'Tenure Validity',
              extractedValue: 'Valid until Nov 2034',
              formValue: 'Active Passport',
              match: true,
              notes: '> 18 months validity satisfied for overseas visa',
            },
          ]);
        } else if (document.type === 'offer_letter_foreign') {
          setFinalStatus('verified');
          setConfidence(98.6);
          setFlagReason(undefined);
          const univ = applicantFormData?.foreignUniversity || 'University of Oxford';

          setExtractedFields({
            'Document Classification': 'Foreign University Admission Letter',
            'Admitted Student': candidateName,
            'Host University': univ,
            'Admission Type': 'Unconditional Offer of Admission',
            'Programme of Study': applicantFormData?.course || 'M.Sc in Environmental Science',
            'Academic Session': 'Autumn 2026 Intake',
          });

          setComparisons([
            {
              field: 'Admitted Candidate',
              extractedValue: candidateName,
              formValue: candidateName,
              match: true,
              notes: 'Candidate identity verified on official letterhead',
            },
            {
              field: 'Institution Fit',
              extractedValue: univ,
              formValue: univ,
              match: true,
              notes: 'Matches declared foreign university',
            },
            {
              field: 'Offer Conditionality',
              extractedValue: 'Unconditional',
              formValue: 'Confirmed',
              match: true,
              notes: 'Satisfies NOS unconditional admission clause',
            },
          ]);
        } else if (document.type === 'qs_ranking_proof') {
          setFinalStatus('verified');
          setConfidence(99.0);
          setFlagReason(undefined);
          const rank = applicantFormData?.qsRanking || '3';

          setExtractedFields({
            'Document Classification': 'QS World University Rankings Certificate',
            'Institution': applicantFormData?.foreignUniversity || 'University of Oxford',
            'Verified QS Rank': `#${rank} Worldwide`,
            'Statutory Limit': 'Rank <= 1000 (Satisfied)',
            'Ranking Edition': 'QS World University Rankings 2026/27',
          });

          setComparisons([
            {
              field: 'QS Global Rank',
              extractedValue: `#${rank}`,
              formValue: `#${rank}`,
              match: true,
              notes: 'Candidate university qualifies in Top 100 Tier (Max Points)',
            },
          ]);
        } else if (document.type === 'st_certificate') {
          setFinalStatus('verified');
          setConfidence(98.8);
          setFlagReason(undefined);

          setExtractedFields({
            'Document Classification': 'Scheduled Tribe Community Certificate',
            'Certificate Number': 'ST/DEL/2024/83921',
            'Candidate Name': candidateName,
            'Tribe / Community': `${applicantFormData?.tribeCommunity || 'Gond'} Scheduled Tribe`,
            'Issuing Authority': 'Sub-Divisional Magistrate (SDM), Revenue Dept.',
            'Digital Verification': 'Verified via DigiLocker e-District API (Tamper Clean)',
          });

          setComparisons([
            {
              field: 'Candidate Name',
              extractedValue: candidateName,
              formValue: candidateName,
              match: true,
              notes: 'Identical to application identity',
            },
            {
              field: 'Tribal Category',
              extractedValue: 'Scheduled Tribe (ST)',
              formValue: 'ST',
              match: true,
              notes: 'Statutory category mandate fully satisfied',
            },
            {
              field: 'Tribe Community',
              extractedValue: applicantFormData?.tribeCommunity || 'Gond',
              formValue: applicantFormData?.tribeCommunity || 'Gond',
              match: true,
              notes: 'Matches Central List of Scheduled Tribes',
            },
          ]);
        } else {
          // Default valid document
          setFinalStatus('verified');
          setConfidence(97.8);
          setFlagReason(undefined);

          setExtractedFields({
            'Document Type': document.name,
            'Identified Candidate': candidateName,
            'Authenticity Seal': 'Digitally Verified DSC / Official Seal Detected',
            'Scheme Rule Match': '100% Satisfied',
            'Integrity Check': 'Pass (Zero Tamper Indicators)',
          });

          setComparisons([
            {
              field: 'Candidate Name',
              extractedValue: candidateName,
              formValue: candidateName,
              match: true,
              notes: 'Exact match',
            },
            {
              field: 'Document Authenticity',
              extractedValue: 'Valid Official Seal',
              formValue: 'Required Document',
              match: true,
              notes: 'Cleared for officer scrutiny',
            },
          ]);
        }

        setIsDone(true);
      }
    }, 380);

    return () => clearInterval(interval);
  }, [isOpen, document, applicantFormData, activeScheme, isCorrectionFlow]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D3829] to-[#16533D] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wide">
                AI Vision OCR & Document Intelligence Pipeline
              </h3>
              <p className="text-xs text-emerald-200 font-hindi">
                स्वचालित दस्तावेज़ विश्लेषण, ओसीआर पाठ निष्कर्षण व क्रॉस-चेक सत्यापन
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-white/10 px-2.5 py-1 rounded-full text-emerald-100 border border-white/20">
            Vision OCR v2.6
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Target Document Details */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-xl border border-slate-200 text-[#0D3829]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">{document.name}</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  File: {document.fileName || 'Attached Certificate'} {document.fileSize && `(${document.fileSize})`}
                </span>
              </div>
            </div>

            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-bold uppercase">
              {document.type}
            </span>
          </div>

          {/* 7-Stage Inspection Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                {!isDone ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-800" />
                    <span>Processing Stage {currentStageIndex + 1} of {AI_SCAN_STAGES.length}:</span>
                    <strong className="text-emerald-900">{AI_SCAN_STAGES[currentStageIndex]?.name}</strong>
                  </>
                ) : (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-700" />
                    <span className="text-emerald-900 font-bold">All 7 Intelligence Stages Completed</span>
                  </>
                )}
              </span>
              <span className="font-mono text-emerald-900">
                {Math.round(((currentStageIndex + (isDone ? 1 : 0)) / AI_SCAN_STAGES.length) * 100)}%
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0D3829] h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStageIndex + (isDone ? 1 : 0)) / AI_SCAN_STAGES.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* RESULTS DISPLAY ONCE SCAN IS FINISHED */}
          {isDone && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Verdict Summary Card */}
              <div
                className={`p-4 rounded-2xl border-2 flex items-start justify-between gap-4 ${
                  finalStatus === 'verified'
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      finalStatus === 'verified'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {finalStatus === 'verified' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm">
                      {finalStatus === 'verified'
                        ? 'AI Document Verification: PASS'
                        : 'AI Document Verification: DEFICIENCY FLAGGED'}
                    </div>
                    <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                      {flagReason ||
                        'Multilingual OCR extraction verified. Certificate details are 100% consistent with application data and meet all statutory criteria.'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                    AI Confidence
                  </span>
                  <span className="text-2xl font-black font-mono text-emerald-800">
                    {confidence}%
                  </span>
                </div>
              </div>

              {/* Side-by-Side Cross-Check Comparison Matrix (Requirement 7 & 29) */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-emerald-800" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Automated Cross-Check Matrix (OCR vs Application Data)
                  </h4>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Field</th>
                        <th className="py-2.5 px-3">Extracted from Document</th>
                        <th className="py-2.5 px-3">Application Declared</th>
                        <th className="py-2.5 px-3 text-right">Cross-Check Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {comparisons.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{row.field}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">{row.extractedValue}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">{row.formValue}</td>
                          <td className="py-2.5 px-3 text-right">
                            {row.match ? (
                              <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                                <Check className="w-3 h-3" />
                                <span>{row.notes}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 text-[10px]">
                                <AlertTriangle className="w-3 h-3" />
                                <span>{row.notes}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Extracted Fields Table */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                  Detailed OCR Extracted Metadata:
                </span>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-1.5 font-mono text-[11px]">
                  {Object.entries(extractedFields).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-slate-200/60 pb-1 last:border-0 last:pb-0">
                      <span className="text-slate-500 font-sans">{key}:</span>
                      <span className="font-semibold text-slate-900 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleApply}
            disabled={!isDone}
            className="flex items-center space-x-1.5 px-6 py-2 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-all shadow-md active:scale-95 disabled:opacity-40"
          >
            <span>Confirm & Apply AI Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

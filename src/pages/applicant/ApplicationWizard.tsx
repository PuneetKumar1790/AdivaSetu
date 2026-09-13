import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';
import { INDIAN_STATES, TRIBAL_COMMUNITIES } from '../../data/stateData';
import { INITIAL_SCHEMES } from '../../data/schemesData';
import { Application, ApplicationFormData, DocumentItem } from '../../types';
import { AIVerificationModal } from '../../components/ai/AIVerificationModal';
import { mockDocumentService } from '../../services/mockDocumentService';
import {
  Save,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  Check,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_DRAFT_KEY = 'adivasetu_app_wizard_draft';

export const ApplicationWizard: React.FC = () => {
  const navigate = useNavigate();
  const { createApplication } = useApplication();
  const { success, info, warning } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeAIModalDoc, setActiveAIModalDoc] = useState<DocumentItem | null>(null);

  // Form State initialized from localStorage or defaults
  const [formData, setFormData] = useState<ApplicationFormData>(() => {
    const saved = localStorage.getItem(STORAGE_DRAFT_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      fullName: 'Aarav Kumar',
      dob: '1999-06-12',
      gender: 'Male',
      fatherName: 'Late Somnath Kumar',
      motherName: 'Savita Devi',
      category: 'ST',
      tribeCommunity: 'Gond',
      aadhaarNumber: '782940192841',
      state: 'Delhi',
      district: 'New Delhi',
      address: 'Hostel No. 6, JNU New Campus, New Mehrauli Road',
      pincode: '110067',
      email: 'aarav.kumar.st@tribal.edu.in',
      mobile: '9876543210',
      alternateMobile: '9811223344',
      highestQualification: 'Master of Science (M.Sc) in Environmental Sciences',
      university: 'Jawaharlal Nehru University',
      institution: 'School of Environmental Sciences, JNU',
      course: 'Ph.D in Environmental Sciences',
      specialization: 'Forest Hydrology & Tribal Agroforestry',
      passingYear: '2024',
      percentageOrCgpa: '8.82 CGPA',
      admissionStatus: 'Confirmed Regular Full-Time Ph.D',
      researchArea: 'Indigenous Forest Conservation and Climate Resilience',
      researchProposalTitle: 'Evolving Agroforestry and Water Retention Systems of Gond Communities in Central Highlands',
      supervisorName: 'Prof. S. R. Ramaswamy',
      schemeId: 'nfst-01',
      schemeCode: 'NFST',
      schemeName: 'National Fellowship for Scheduled Tribes',
      annualIncome: '240000',
      incomeCertificateNo: 'INC/DEL/2026/8940',
      issuingState: 'Delhi',
      issueDate: '2026-05-15',
      bankName: 'State Bank of India',
      accountHolder: 'Aarav Kumar',
      accountNumber: '30492819004821',
      ifsc: 'SBIN0001077',
      branch: 'JNU New Campus Branch',
    };
  });

  // Mandatory Documents Checklist with real file hooks
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-st',
      type: 'st_certificate',
      name: 'ST Community Certificate',
      required: true,
      fileName: 'ST_Certificate_Aarav.pdf',
      fileSize: '1.2 MB',
      verificationStatus: 'verified',
      aiConfidence: 98.4,
    },
    {
      id: 'doc-inc',
      type: 'income_certificate',
      name: 'Annual Family Income Certificate (FY 2026-27)',
      required: true,
      fileName: 'Income_Certificate_2026.pdf',
      fileSize: '950 KB',
      verificationStatus: 'verified',
      aiConfidence: 98.2,
    },
    {
      id: 'doc-adh',
      type: 'aadhaar',
      name: 'Aadhaar Identity Proof',
      required: true,
      fileName: 'Aadhaar_Front_Back.pdf',
      fileSize: '1.1 MB',
      verificationStatus: 'verified',
      aiConfidence: 99.1,
    },
    {
      id: 'doc-mks',
      type: 'marksheet',
      name: 'Post-Graduation Degree Marksheet',
      required: true,
      fileName: 'MSc_Consolidated_Marksheet.pdf',
      fileSize: '2.3 MB',
      verificationStatus: 'verified',
      aiConfidence: 96.5,
    },
    {
      id: 'doc-adm',
      type: 'admission_letter',
      name: 'Ph.D Enrolment / Admission Bonafide',
      required: true,
      fileName: 'PhD_Admission_Letter_SES.pdf',
      fileSize: '1.4 MB',
      verificationStatus: 'verified',
      aiConfidence: 97.4,
    },
    {
      id: 'doc-bnk',
      type: 'bank_passbook',
      name: 'Bank Passbook / Cancelled Cheque',
      required: true,
      fileName: 'SBI_Passbook_Frontpage.pdf',
      fileSize: '890 KB',
      verificationStatus: 'verified',
      aiConfidence: 98.9,
    },
    {
      id: 'doc-syn',
      type: 'research_proposal',
      name: 'Research Synopsis & Guide Approval',
      required: true,
      fileName: 'Research_Synopsis_SES_JNU.pdf',
      fileSize: '3.2 MB',
      verificationStatus: 'verified',
      aiConfidence: 95.0,
    },
  ]);

  const [declarationChecked, setDeclarationChecked] = useState(false);

  // Auto-save draft to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  const steps = [
    { num: 1, label: 'Personal Details' },
    { num: 2, label: 'Contact Details' },
    { num: 3, label: 'Education' },
    { num: 4, label: 'Scheme Details' },
    { num: 5, label: 'Financial' },
    { num: 6, label: 'Bank Details' },
    { num: 7, label: 'Documents' },
    { num: 8, label: 'Review' },
    { num: 9, label: 'Declaration' },
    { num: 10, label: 'Submit' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const processed = mockDocumentService.processUploadedFile(file, 'st_certificate', file.name);

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                fileUrl: processed.fileUrl,
                fileName: processed.fileName,
                fileSize: processed.fileSize,
                verificationStatus: 'pending',
              }
            : d
        )
      );

      // Open AI scanner automatically for interactive realism
      const targetDoc = documents.find((d) => d.id === docId);
      if (targetDoc) {
        setActiveAIModalDoc({
          ...targetDoc,
          fileName: file.name,
          fileSize: processed.fileSize,
        });
      }
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(formData));
    success('Draft Saved', 'Your application particulars have been safely persisted locally.');
  };

  const handleFinalSubmit = () => {
    if (!declarationChecked) {
      warning('Declaration Required', 'Please confirm the statutory e-sign declaration before submitting.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newAppId = `ADVS-NFST-2026-${randomSuffix}`;

    const newApplication: Application = {
      id: newAppId,
      applicantId: 'app-001',
      applicantName: formData.fullName,
      schemeId: formData.schemeId,
      schemeCode: formData.schemeCode,
      schemeName: formData.schemeName,
      state: formData.state,
      district: formData.district,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Submitted',
      currentStepIndex: 1,
      eligibilityStatus: 'Eligible',
      aiScore: 96.4,
      formData,
      documents,
      deficiencies: [],
      timeline: [
        {
          id: 't-1',
          name: 'Application Submitted',
          hindiName: 'आवेदन प्रस्तुत किया गया',
          status: 'completed',
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          actor: 'Applicant (e-Sign Authenticated)',
          description: 'Application received and registered on MoTA Central Fellowship Gateway.',
        },
        {
          id: 't-2',
          name: 'AI Document Verification',
          hindiName: 'एआई दस्तावेज़ सत्यापन',
          status: 'in_progress',
          actor: 'AI Vision OCR Engine',
          description: 'Multilingual field extraction and registry authentication in progress.',
        },
        {
          id: 't-3',
          name: 'Ministry Officer Scrutiny',
          hindiName: 'मंत्रालय अधिकारी जांच',
          status: 'pending',
          description: 'Official scrutiny against reservation norms and eligibility guidelines.',
        },
        {
          id: 't-4',
          name: 'Screening Committee Selection',
          hindiName: 'चयन समिति निर्णय',
          status: 'pending',
          description: 'Ranking aggregation and provisional fellowship sanction.',
        },
      ],
      auditTrail: [
        {
          id: 'aud-' + Date.now(),
          applicationId: newAppId,
          timestamp: new Date().toISOString(),
          actor: `${formData.fullName} (Applicant)`,
          actorRole: 'applicant',
          action: 'APPLICATION_SUBMITTED',
          description: 'Application submitted with 7 authenticated documents and UIDAI Aadhaar e-Sign.',
          statusType: 'success',
        },
      ],
    };

    createApplication(newApplication);

    // Trigger celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    localStorage.removeItem(STORAGE_DRAFT_KEY);

    success('Application Submitted Successfully', `Registered with ID: ${newAppId}`);
    navigate(`/applicant/applications/${newAppId}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Multi-Step Scholarship Wizard
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Application for National Fellowship for Scheduled Tribes (NFST)
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            अनुसूचित जनजातियों के लिए राष्ट्रीय अध्येतावृत्ति आवेदन प्रपत्र
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Persistent Progress Step Bar (Requirement 12) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center min-w-[680px] justify-between text-xs">
          {steps.map((st) => {
            const isDone = st.num < currentStep;
            const isCurrent = st.num === currentStep;
            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className="flex items-center space-x-1.5 focus:outline-none"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    isDone
                      ? 'bg-[#0D3829] text-white'
                      : isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-200'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : st.num}
                </div>
                <span
                  className={`text-[11px] font-semibold whitespace-nowrap ${
                    isCurrent ? 'text-slate-900 font-bold' : isDone ? 'text-emerald-900' : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </span>
                {st.num < 10 && <span className="text-slate-300 ml-1">›</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wizard Form Workspace */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Step 1: Personal Details (Requirement 13) */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 uppercase tracking-wider">
              1. Personal Particulars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name (As in Matriculation)</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Father's Full Name</label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Mother's Full Name</label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
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
                <label className="font-semibold text-slate-700">Aadhaar Reference Number</label>
                <input
                  type="text"
                  value="XXXX XXXX 2841"
                  disabled
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-500"
                />
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
                <label className="font-semibold text-slate-700">PIN Code</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact Details */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 uppercase tracking-wider">
              2. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Primary Mobile Number</label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700">Permanent Postal Address</label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Education Details (Requirement 14) */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 uppercase tracking-wider">
              3. Academic Qualifications & Research Programme
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Highest Completed Qualification</label>
                <input
                  type="text"
                  value={formData.highestQualification}
                  onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Qualifying Percentage / CGPA</label>
                <input
                  type="text"
                  value={formData.percentageOrCgpa}
                  onChange={(e) => setFormData({ ...formData, percentageOrCgpa: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Enrolled Institution / Department</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Course / Programme Enrolled</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700">Approved Research Synopsis Title</label>
                <input
                  type="text"
                  value={formData.researchProposalTitle}
                  onChange={(e) => setFormData({ ...formData, researchProposalTitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Research Supervisor</label>
                <input
                  type="text"
                  value={formData.supervisorName}
                  onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Scheme Details */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 uppercase tracking-wider">
              4. Scheme Allocation
            </h3>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-emerald-950 text-sm">{formData.schemeName}</h4>
                <span className="font-mono font-bold text-xs bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                  {formData.schemeCode}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Eligible ST students pursuing full-time Ph.D research programmes in Indian universities receive ₹37,000/mo JRF stipend + HRA + contingency.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Financial Details (Requirement 15) */}
        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 uppercase tracking-wider">
              5. Annual Family Income Particulars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Gross Annual Family Income (INR)</label>
                <input
                  type="text"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Income Certificate Reference Number</label>
                <input
                  type="text"
                  value={formData.incomeCertificateNo}
                  onChange={(e) => setFormData({ ...formData, incomeCertificateNo: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Bank Details (Requirement 15: Mask sensitive info) */}
        {currentStep === 6 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 uppercase tracking-wider">
              6. Direct Benefit Transfer (DBT) Bank Particulars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Account Holder Name</label>
                <input
                  type="text"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Bank Account Number</label>
                <input
                  type="text"
                  value="XXXX XXXX 4821"
                  disabled
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-500"
                />
                <span className="text-[10px] text-slate-400">Masked for privacy security.</span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifsc}
                  onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Documents Upload System (Requirement 16 & 17) */}
        {currentStep === 7 && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                7. Mandatory Document Upload & AI Verification
              </h3>
              <span className="text-[11px] text-emerald-800 font-bold">
                Supported: PDF, JPG, PNG (up to 5 MB)
              </span>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-emerald-800 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{doc.name}</h4>
                        {doc.required && (
                          <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {doc.fileName || 'No file selected yet'} • {doc.fileSize || 'Pending'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        doc.verificationStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {doc.verificationStatus === 'verified' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span className="capitalize">{doc.verificationStatus}</span>
                    </span>

                    {/* Actual browser file picker */}
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 transition-colors">
                      <span>Replace</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, doc.id)}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setActiveAIModalDoc(doc)}
                      className="px-3 py-1.5 rounded-lg bg-[#0D3829] hover:bg-[#16533D] font-bold text-white transition-colors"
                    >
                      AI Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Review */}
        {currentStep === 8 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 uppercase tracking-wider">
              8. Complete Application Summary Review
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-500">Applicant Full Name</span>
                <div className="font-bold text-slate-900 mt-0.5">{formData.fullName}</div>
              </div>
              <div>
                <span className="text-slate-500">Social Category & Tribe</span>
                <div className="font-bold text-slate-900 mt-0.5">{formData.tribeCommunity} (ST)</div>
              </div>
              <div>
                <span className="text-slate-500">Institution & Course</span>
                <div className="font-bold text-slate-900 mt-0.5">{formData.course} ({formData.institution})</div>
              </div>
              <div>
                <span className="text-slate-500">Direct Bank Account</span>
                <div className="font-bold text-slate-900 mt-0.5 font-mono">{formData.bankName} (****4821)</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Declaration */}
        {currentStep === 9 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 uppercase tracking-wider">
              9. Statutory Declaration & Aadhaar e-Sign
            </h3>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-3">
              <p className="text-slate-700 leading-relaxed">
                I hereby solemnly declare that all particulars stated in this application are true, correct, and complete to the best of my knowledge. I understand that any false declaration or forged document shall render me liable for immediate cancellation of fellowship and legal action under statutory laws.
              </p>
              <label className="flex items-start space-x-2.5 cursor-pointer font-bold text-slate-900 pt-2 border-t border-amber-200">
                <input
                  type="checkbox"
                  checked={declarationChecked}
                  onChange={(e) => setDeclarationChecked(e.target.checked)}
                  className="mt-0.5 accent-emerald-800 rounded"
                />
                <span>I accept and authorize Aadhaar-based digital authentication for scholarship DBT.</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 10: Submit */}
        {currentStep === 10 && (
          <div className="space-y-4 text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border-2 border-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Ready for Official Transmission</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Upon clicking Submit, an official reference tracking ID will be generated and your application will be routed to the Ministry Officer queue.
              </p>
            </div>
            <button
              onClick={handleFinalSubmit}
              className="px-8 py-3 rounded-xl bg-[#0D3829] hover:bg-[#16533D] text-white font-bold text-xs shadow-lg transition-all active:scale-95"
            >
              Submit Application to Ministry of Tribal Affairs
            </button>
          </div>
        )}

        {/* Wizard Footer Nav */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          )}

          {currentStep < 10 && (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="ml-auto flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-md transition-all active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Reusable AI Verification Modal */}
      <AIVerificationModal
        isOpen={!!activeAIModalDoc}
        onClose={() => setActiveAIModalDoc(null)}
        document={activeAIModalDoc}
        onVerificationComplete={(res) => {
          if (activeAIModalDoc) {
            setDocuments((prev) =>
              prev.map((d) =>
                d.id === activeAIModalDoc.id
                  ? { ...d, verificationStatus: res.status, aiConfidence: res.confidence }
                  : d
              )
            );
          }
        }}
      />
    </div>
  );
};

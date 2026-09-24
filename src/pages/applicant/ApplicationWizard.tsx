import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';
import { INDIAN_STATES, TRIBAL_COMMUNITIES } from '../../data/stateData';
import { Application, ApplicationFormData, DocumentItem, DocumentType } from '../../types';
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
  Globe2,
  Layers,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_DRAFT_KEY = 'adivasetu_app_wizard_draft';

export const ApplicationWizard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { createApplication, schemes, activeSchemeCode, setActiveSchemeCode } = useApplication();
  const { success, info, warning } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeAIModalDoc, setActiveAIModalDoc] = useState<DocumentItem | null>(null);

  // Determine current active scheme from URL or context
  const queryScheme = searchParams.get('scheme') || activeSchemeCode || 'NFST';
  const activeScheme =
    schemes.find((s) => s.code.toUpperCase() === queryScheme.toUpperCase() || s.id === queryScheme) ||
    schemes[0];

  // Form State
  const [formData, setFormData] = useState<ApplicationFormData>(() => {
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
      // Domestic defaults
      highestQualification: 'Master of Science (M.Sc) in Environmental Sciences',
      university: 'Jawaharlal Nehru University',
      institution: 'School of Environmental Sciences, JNU',
      course: 'Ph.D in Environmental Sciences',
      specialization: 'Forest Hydrology & Tribal Agroforestry',
      passingYear: '2024',
      percentageOrCgpa: '88.2%',
      admissionStatus: 'Confirmed Regular Full-Time',
      researchArea: 'Indigenous Forest Conservation and Climate Resilience',
      researchProposalTitle: 'Evolving Agroforestry Systems of Central Indian Tribal Communities',
      supervisorName: 'Prof. S. R. Ramaswamy',
      // Overseas defaults
      targetCountry: 'United Kingdom',
      foreignUniversity: 'University of Oxford',
      qsRanking: '3',
      passportNumber: 'Z9482014',
      languageTestScore: 'IELTS 8.0 Band Overall',
      // Scheme Details
      schemeId: activeScheme.id,
      schemeCode: activeScheme.code,
      schemeName: activeScheme.name,
      // Financial
      annualIncome: '240000',
      incomeCertificateNo: 'INC/DEL/2026/8940',
      issuingState: 'Delhi',
      issueDate: '2026-05-15',
      // Bank Details
      bankName: 'State Bank of India',
      accountHolder: 'Aarav Kumar',
      accountNumber: '30492819004821',
      ifsc: 'SBIN0001077',
      branch: 'JNU New Campus Branch',
    };
  });

  // Keep form scheme code in sync when scheme changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      schemeId: activeScheme.id,
      schemeCode: activeScheme.code,
      schemeName: activeScheme.name,
    }));
  }, [activeScheme]);

  // Generate dynamic required documents list based on activeScheme
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    if (activeScheme.requiredDocuments && activeScheme.requiredDocuments.length > 0) {
      const dynamicDocs: DocumentItem[] = activeScheme.requiredDocuments.map((req, idx) => {
        let defaultFileName = `${req.type}_aarav.pdf`;
        let defaultSize = '1.2 MB';
        let defaultConfidence = 98.2;

        if (req.type === 'passport') {
          defaultFileName = 'Indian_Passport_Aarav_Kumar.pdf';
          defaultSize = '1.8 MB';
          defaultConfidence = 99.4;
        } else if (req.type === 'offer_letter_foreign') {
          defaultFileName = 'Oxford_Unconditional_Offer_Letter.pdf';
          defaultSize = '2.4 MB';
          defaultConfidence = 97.8;
        } else if (req.type === 'qs_ranking_proof') {
          defaultFileName = 'QS_Rank_Proof_Oxford_2026.pdf';
          defaultSize = '680 KB';
          defaultConfidence = 98.9;
        } else if (req.type === 'sop_study_plan') {
          defaultFileName = 'SOP_Study_Plan_Oxford.pdf';
          defaultSize = '1.5 MB';
          defaultConfidence = 96.5;
        }

        return {
          id: `doc-${activeScheme.code.toLowerCase()}-${idx}-${req.type}`,
          type: req.type,
          name: req.name,
          required: req.mandatory,
          fileName: defaultFileName,
          fileSize: defaultSize,
          verificationStatus: 'verified',
          aiConfidence: defaultConfidence,
        };
      });
      setDocuments(dynamicDocs);
    }
  }, [activeScheme]);

  const [declarationChecked, setDeclarationChecked] = useState(false);

  const steps = [
    { num: 1, label: 'Personal Details' },
    { num: 2, label: 'Contact Details' },
    { num: 3, label: activeScheme.category === 'overseas' ? 'Overseas Study Details' : 'Academic & Programme' },
    { num: 4, label: 'Scheme Mandates' },
    { num: 5, label: 'Financial' },
    { num: 6, label: 'Bank Details' },
    { num: 7, label: `Documents (${documents.length})` },
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

  const handleFinalSubmit = async () => {
    if (!declarationChecked) {
      warning('Declaration Required', 'Please confirm the statutory e-sign declaration before submitting.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newAppId = `ADVS-${activeScheme.code}-2026-${randomSuffix}`;

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
          actor: 'Scholar Applicant',
          description: `Application registered under ${activeScheme.name} (${activeScheme.code}).`,
        },
        {
          id: 't-2',
          name: 'AI Document Scrutiny',
          hindiName: 'दस्तावेज़ विश्लेषण',
          status: 'in_progress',
          description: 'Multilingual OCR extraction and cross-field registry comparison in progress.',
        },
        {
          id: 't-3',
          name: 'Officer Screening',
          hindiName: 'शासकीय चयन',
          status: 'pending',
          description: 'Official scrutiny against statutory reservation norms and seat matrix.',
        },
        {
          id: 't-4',
          name: 'Merit Sanction',
          hindiName: 'अंतिम स्वीकृति',
          status: 'pending',
          description: 'Merit ranking compilation and Direct Benefit Transfer (DBT) sanction.',
        },
      ],
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          applicationId: newAppId,
          timestamp: new Date().toISOString(),
          actor: formData.fullName,
          actorRole: 'applicant',
          action: 'APPLICATION_SUBMITTED',
          description: `Formal online application submitted for ${activeScheme.name} (${activeScheme.code}).`,
          statusType: 'success',
        },
      ],
    };

    await createApplication(newApplication);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0D3829', '#F59E0B', '#10B981'],
    });

    navigate(`/applicant/applications/${newAppId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Scheme Switcher Pills */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Online Application Ingestion
            </span>
            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
              {activeScheme.code}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {activeScheme.name}
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            {activeScheme.hindiName} • शैक्षणिक सत्र {activeScheme.academicYear || '2026-27'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveDraft}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-300"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Scheme Selection Banner (Demonstrating PS239 "Two-Scheme" Instant Switch) */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold">Applying For:</span>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
            {activeScheme.name} ({activeScheme.code})
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] text-slate-400">Switch Scheme:</span>
          {schemes.map((s) => (
            <button
              key={s.code}
              onClick={() => {
                setSearchParams({ scheme: s.code });
                setActiveSchemeCode(s.code);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeScheme.code === s.code
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {s.code}
            </button>
          ))}
        </div>
      </div>

      {/* Step Progress Pills */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {steps.map((st) => (
            <button
              key={st.num}
              onClick={() => setCurrentStep(st.num)}
              className={`flex-1 py-2 px-2 text-center rounded-xl text-xs font-bold transition-all ${
                currentStep === st.num
                  ? 'bg-[#0D3829] text-white shadow-sm'
                  : currentStep > st.num
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border border-slate-200'
              }`}
            >
              <div className="text-[10px] uppercase font-mono">Step {st.num}</div>
              <div className="truncate">{st.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Body */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 uppercase tracking-wider">
              1. Candidate Identification Particulars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name (As in Matriculation / Passport)</label>
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
                <label className="font-semibold text-slate-700">Aadhaar Reference (Vault Encrypted)</label>
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
            </div>
          </div>
        )}

        {/* Step 2: Contact Details */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 uppercase tracking-wider">
              2. Communication & Contact Coordinates
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
                <label className="font-semibold text-slate-700">Registered Email Address</label>
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

        {/* Step 3: Dynamic Academic & Programme (Adapts between Domestic Ph.D and Overseas NOS) */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {activeScheme.category === 'overseas'
                  ? '3. Foreign University & Overseas Study Details (NOS)'
                  : '3. Academic Qualifications & Research Programme (Domestic)'}
              </h3>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                Scheme: {activeScheme.code}
              </span>
            </div>

            {/* DYNAMIC OVERSEAS FIELDS (NOS) */}
            {activeScheme.category === 'overseas' ? (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 flex items-center space-x-2">
                  <Globe2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>
                    NOS supports Master's, Ph.D. and Post-Doctoral studies in <strong>Top 1000 QS Ranked</strong> foreign universities.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Target Destination Country</label>
                    <select
                      value={formData.targetCountry || 'United Kingdom'}
                      onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                    >
                      <option value="United Kingdom">United Kingdom (UK)</option>
                      <option value="United States">United States (USA)</option>
                      <option value="Germany">Germany</option>
                      <option value="Australia">Australia</option>
                      <option value="Canada">Canada</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Foreign University Name</label>
                    <input
                      type="text"
                      value={formData.foreignUniversity || 'University of Oxford'}
                      onChange={(e) => setFormData({ ...formData, foreignUniversity: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                      placeholder="e.g. University of Oxford"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">QS World University Rank (2026)</label>
                    <input
                      type="number"
                      value={formData.qsRanking || '3'}
                      onChange={(e) => setFormData({ ...formData, qsRanking: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                      placeholder="e.g. 3 (Must be <= 1000)"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Valid Indian Passport Number</label>
                    <input
                      type="text"
                      value={formData.passportNumber || 'Z9482014'}
                      onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold uppercase"
                      placeholder="e.g. Z9482014"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Language / Aptitude Test Score</label>
                    <input
                      type="text"
                      value={formData.languageTestScore || 'IELTS 8.0 Band Overall'}
                      onChange={(e) => setFormData({ ...formData, languageTestScore: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      placeholder="e.g. IELTS 7.5 / TOEFL 105"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Previous Qualifying Degree Marks (%)</label>
                    <input
                      type="text"
                      value={formData.percentageOrCgpa}
                      onChange={(e) => setFormData({ ...formData, percentageOrCgpa: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-slate-700">Proposed Course & Field of Study Abroad</label>
                    <input
                      type="text"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      placeholder="e.g. M.Sc in Biodiversity, Conservation and Management"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* DYNAMIC DOMESTIC FIELDS (NFST / TCE-ST) */
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
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Enrolled Indian University</label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Institution / Department</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Degree Course Enrolled</label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Research Supervisor / Guide</label>
                  <input
                    type="text"
                    value={formData.supervisorName || ''}
                    onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700">Approved Research Synopsis Title</label>
                  <input
                    type="text"
                    value={formData.researchProposalTitle || ''}
                    onChange={(e) => setFormData({ ...formData, researchProposalTitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Scheme Details */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 uppercase tracking-wider">
              4. Scheme Allocation & Mandates
            </h3>
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-950 text-base">{activeScheme.name}</h4>
                  <p className="text-xs text-emerald-800 font-hindi">{activeScheme.hindiName}</p>
                </div>
                <span className="font-mono font-bold text-xs bg-emerald-200 text-emerald-900 px-3 py-1 rounded-lg">
                  {activeScheme.code}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">{activeScheme.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-emerald-200">
                <div>
                  <span className="text-slate-500 block">Stipend / Support:</span>
                  <span className="font-bold text-emerald-950">{activeScheme.stipendAmount}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Available Slots:</span>
                  <span className="font-bold text-emerald-950">{activeScheme.slotsAvailable} Slots</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Application Deadline:</span>
                  <span className="font-bold text-amber-800">{activeScheme.deadline}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Financial Details */}
        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                5. Annual Family Income Particulars
              </h3>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Scheme Ceiling: ₹{(activeScheme.maxIncomeCeiling || 600000).toLocaleString('en-IN')} / yr
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Gross Annual Family Income (INR)</label>
                <input
                  type="text"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
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

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Issuing State / Revenue Authority</label>
                <input
                  type="text"
                  value={formData.issuingState}
                  onChange={(e) => setFormData({ ...formData, issuingState: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Certificate Issue Date</label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Bank Details */}
        {currentStep === 6 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 uppercase tracking-wider">
              6. Aadhaar Linked DBT Bank Account (PFMS Gateway)
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
                <label className="font-semibold text-slate-700">Account Holder Name (As in Bank)</label>
                <input
                  type="text"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifsc}
                  onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Dynamic Documents Checklist (Driven by activeScheme.requiredDocuments) */}
        {currentStep === 7 && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                7. Required Documents Submission Checklist ({activeScheme.code})
              </h3>
              <span className="text-[11px] text-slate-500 font-semibold">
                {documents.filter((d) => d.verificationStatus === 'verified').length} of {documents.length} Ready
              </span>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white hover:border-emerald-700 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#0D3829] shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{doc.name}</span>
                        {doc.required && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                            MANDATORY
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {doc.fileName || 'No file attached'} {doc.fileSize && `• ${doc.fileSize}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {doc.verificationStatus === 'verified' ? (
                      <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>AI Scanned ({doc.aiConfidence || 98}%)</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                        Pending Verification
                      </span>
                    )}

                    <label className="cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-300 flex items-center space-x-1 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      <span>{doc.fileName ? 'Replace' : 'Upload'}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg"
                        onChange={(e) => handleFileUpload(e, doc.id)}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setActiveAIModalDoc(doc)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1 transition-colors"
                      title="Inspect with AI Document Intelligence"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>AI Scan</span>
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
              8. Complete Application Summary & Verification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-500">Target Scheme:</span>
                <div className="font-bold text-slate-900 text-sm">{activeScheme.name} ({activeScheme.code})</div>
              </div>
              <div>
                <span className="text-slate-500">Applicant Name:</span>
                <div className="font-bold text-slate-900">{formData.fullName} (ST - {formData.tribeCommunity})</div>
              </div>
              {activeScheme.category === 'overseas' ? (
                <>
                  <div>
                    <span className="text-slate-500">Target Country & University:</span>
                    <div className="font-bold text-slate-900">{formData.foreignUniversity} ({formData.targetCountry})</div>
                  </div>
                  <div>
                    <span className="text-slate-500">QS World University Rank:</span>
                    <div className="font-bold text-emerald-800 font-mono">#{formData.qsRanking}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Passport Number:</span>
                    <div className="font-bold text-slate-900 font-mono">{formData.passportNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Standardized Test:</span>
                    <div className="font-bold text-slate-900">{formData.languageTestScore}</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-slate-500">Enrolled Institution:</span>
                    <div className="font-bold text-slate-900">{formData.institution || formData.university}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Programme & Synopsis:</span>
                    <div className="font-bold text-slate-900">{formData.course} - {formData.researchProposalTitle}</div>
                  </div>
                </>
              )}
              <div>
                <span className="text-slate-500">Declared Family Income:</span>
                <div className="font-bold text-slate-900 font-mono">₹{parseInt(formData.annualIncome).toLocaleString('en-IN')} / yr</div>
              </div>
              <div>
                <span className="text-slate-500">DBT Bank Account:</span>
                <div className="font-bold text-slate-900 font-mono">{formData.bankName} (****{formData.accountNumber.slice(-4)})</div>
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
                I hereby solemnly declare that all particulars stated in this application under <strong>{activeScheme.name}</strong> are true, correct, and complete to the best of my knowledge. I understand that any false declaration or forged document shall render me liable for immediate cancellation of fellowship and legal action under statutory laws.
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
              <h3 className="text-base font-bold text-slate-900">
                Ready for Official Submission ({activeScheme.code})
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Upon clicking Submit, an official reference tracking ID will be generated and your application will be routed to the Ministry Officer scrutiny queue.
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
        applicantFormData={formData}
        activeScheme={activeScheme}
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

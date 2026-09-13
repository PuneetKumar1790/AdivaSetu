export type UserRole = 'applicant' | 'officer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  mobile: string;
  designation?: string;
  department?: string;
  avatar?: string;
  token?: string;
}

export type SchemeCategory = 'fellowship' | 'scholarship' | 'overseas' | 'domestic';

export interface Scheme {
  id: string;
  code: string;
  name: string;
  hindiName: string;
  category: SchemeCategory;
  ministry: string;
  targetGroup: string;
  educationLevel: string;
  stipendAmount: string;
  duration: string;
  deadline: string;
  isOpen: boolean;
  requiredDocumentsCount: number;
  eligibilitySummary: string[];
  slotsAvailable: number;
  description: string;
  guidelinesUrl?: string;
}

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Verification'
  | 'Deficient'
  | 'Resubmitted'
  | 'Scrutiny'
  | 'Screening'
  | 'Shortlisted'
  | 'Selected'
  | 'Approved'
  | 'Rejected';

export type DocumentType =
  | 'st_certificate'
  | 'income_certificate'
  | 'aadhaar'
  | 'marksheet'
  | 'degree_certificate'
  | 'admission_letter'
  | 'bank_passbook'
  | 'research_proposal';

export type VerificationStatus = 'pending' | 'verifying' | 'verified' | 'flagged' | 'deficient';

export interface DocumentItem {
  id: string;
  type: DocumentType;
  name: string;
  hindiName?: string;
  required: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  verificationStatus: VerificationStatus;
  aiConfidence?: number;
  extractedData?: Record<string, string>;
  flagReason?: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface DeficiencyItem {
  id: string;
  documentType: DocumentType;
  documentName: string;
  issue: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  recommendedAction: string;
  status: 'open' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditEvent {
  id: string;
  applicationId: string;
  timestamp: string;
  actor: string;
  actorRole: 'system' | 'ai' | 'applicant' | 'officer';
  action: string;
  description: string;
  statusType: 'info' | 'success' | 'warning' | 'alert';
}

export interface TimelineStage {
  id: string;
  name: string;
  hindiName: string;
  status: 'completed' | 'in_progress' | 'pending' | 'alert';
  date?: string;
  actor?: string;
  description: string;
}

export interface ApplicationFormData {
  // 1. Personal
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  fatherName: string;
  motherName: string;
  category: string;
  tribeCommunity: string;
  aadhaarNumber: string;
  state: string;
  district: string;
  address: string;
  pincode: string;
  // 2. Contact
  email: string;
  mobile: string;
  alternateMobile?: string;
  // 3. Education
  highestQualification: string;
  university: string;
  institution: string;
  course: string;
  specialization: string;
  passingYear: string;
  percentageOrCgpa: string;
  admissionStatus: string;
  researchArea?: string;
  researchProposalTitle?: string;
  supervisorName?: string;
  // 4. Scheme details
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  // 5. Financial
  annualIncome: string;
  incomeCertificateNo: string;
  issuingState: string;
  issueDate: string;
  // 6. Bank
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
}

export interface Application {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantPhoto?: string;
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  state: string;
  district: string;
  submittedAt: string;
  updatedAt: string;
  status: ApplicationStatus;
  currentStepIndex: number;
  eligibilityStatus: 'Eligible' | 'Conditional' | 'Ineligible';
  aiScore: number;
  formData: ApplicationFormData;
  documents: DocumentItem[];
  deficiencies: DeficiencyItem[];
  timeline: TimelineStage[];
  auditTrail: AuditEvent[];
  aiScrutinyReport?: AIScrutinyReport;
  rankingScore?: number;
  rank?: number;
  remarks?: string;
}

export interface AIScrutinyReport {
  overallConfidence: number;
  eligibilityDecision: 'PASS' | 'FLAG' | 'FAIL';
  documentCompleteness: number; // percentage
  consistencyScore: number; // percentage
  anomalyIndicator: 'Low' | 'Medium' | 'High';
  duplicateIndicator: 'Low' | 'Medium' | 'High';
  riskFlags: {
    critical: number;
    informational: number;
    details: string[];
  };
  recommendation: 'Recommend for human approval' | 'Requires scrutiny verification' | 'Deficiencies detected';
  recommendationDetails: string;
  processedAt: string;
}

export interface EligibilityQuery {
  category: string;
  tribeCommunity: string;
  state: string;
  age: number;
  educationLevel: string;
  course: string;
  institution: string;
  annualIncome: number;
  percentage: number;
  admissionStatus: string;
  studyDestination: 'Domestic' | 'Overseas';
  researchProgramme?: boolean;
}

export interface EligibilityFactor {
  factor: string;
  satisfied: boolean;
  notes: string;
}

export interface EligibilityResult {
  isLikelyEligible: boolean;
  confidence: number;
  verdict: 'Likely Eligible' | 'Conditional Eligibility' | 'Not Eligible';
  factors: EligibilityFactor[];
  matchedSchemes: string[];
  disclaimer: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'celebration';
  read: boolean;
  timestamp: string;
  applicationId?: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface CommunicationNotice {
  id: string;
  recipientId: string;
  recipientName: string;
  applicationId: string;
  templateType: 'deficiency_notice' | 'scrutiny_clarification' | 'shortlist_letter' | 'selection_award';
  subject: string;
  content: string;
  sentAt: string;
  senderOfficer: string;
  status: 'delivered' | 'read';
}

export interface SchemeConfigurationWeights {
  academicPerformance: number; // e.g. 30
  researchProposal: number;     // e.g. 25
  eligibilityCompliance: number;// e.g. 20
  institutionRating: number;    // e.g. 15
  documentCompleteness: number; // e.g. 10
}

export interface StateApplicationStat {
  state: string;
  applications: number;
  eligible: number;
  selected: number;
  pending: number;
}

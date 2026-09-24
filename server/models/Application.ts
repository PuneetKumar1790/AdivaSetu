import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
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
  status: string;
  currentStepIndex: number;
  eligibilityStatus: string;
  aiScore: number;
  academicYear?: string;
  aiConfidence?: number;
  documentsCount?: number;
  verifiedDocumentsCount?: number;
  formData: Record<string, any>;
  documents: Array<Record<string, any>>;
  deficiencies: Array<Record<string, any>>;
  timeline: Array<Record<string, any>>;
  auditTrail: Array<Record<string, any>>;
  aiScrutinyReport?: Record<string, any>;
  rankingScore?: number;
  rank?: number;
  remarks?: string;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    id: { type: String, required: true, unique: true, index: true },
    applicantId: { type: String, required: true, index: true },
    applicantName: { type: String, required: true },
    applicantPhoto: { type: String },
    schemeId: { type: String, required: true },
    schemeCode: { type: String, required: true, index: true },
    schemeName: { type: String, required: true },
    state: { type: String, required: true, index: true },
    district: { type: String, default: 'Central' },
    submittedAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
    status: { type: String, required: true, index: true, default: 'Submitted' },
    currentStepIndex: { type: Number, default: 1 },
    eligibilityStatus: { type: String, default: 'Eligible' },
    aiScore: { type: Number, default: 85 },
    academicYear: { type: String, default: '2026-27' },
    aiConfidence: { type: Number, default: 95.0 },
    documentsCount: { type: Number, default: 5 },
    verifiedDocumentsCount: { type: Number, default: 0 },
    formData: { type: Schema.Types.Mixed, default: {} },
    documents: { type: [Schema.Types.Mixed], default: [] },
    deficiencies: { type: [Schema.Types.Mixed], default: [] },
    timeline: { type: [Schema.Types.Mixed], default: [] },
    auditTrail: { type: [Schema.Types.Mixed], default: [] },
    aiScrutinyReport: { type: Schema.Types.Mixed },
    rankingScore: { type: Number },
    rank: { type: Number },
    remarks: { type: String },
  },
  { timestamps: true }
);

export const ApplicationModel = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

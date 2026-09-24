import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditEvent extends Document {
  id: string;
  applicationId?: string;
  timestamp: string;
  actor: string;
  actorRole: 'system' | 'ai' | 'applicant' | 'officer';
  action: string;
  description: string;
  statusType: 'info' | 'success' | 'warning' | 'alert';
}

const AuditEventSchema = new Schema<IAuditEvent>(
  {
    id: { type: String, required: true, unique: true, index: true },
    applicationId: { type: String, index: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    actor: { type: String, required: true },
    actorRole: { type: String, required: true },
    action: { type: String, required: true },
    description: { type: String, required: true },
    statusType: { type: String, default: 'info' },
  },
  { timestamps: true }
);

export const AuditEventModel =
  mongoose.models.AuditEvent || mongoose.model<IAuditEvent>('AuditEvent', AuditEventSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  id: string;
  title: string;
  message: string;
  type: string;
  applicationId?: string;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  timestamp: string;
}

const NotificationSchema = new Schema<INotification>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'info' },
    applicationId: { type: String },
    actionUrl: { type: String },
    actionLabel: { type: String },
    read: { type: Boolean, default: false },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const NotificationModel =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

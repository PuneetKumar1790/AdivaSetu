import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  role: 'applicant' | 'officer';
  email: string;
  mobile: string;
  designation?: string;
  department?: string;
  avatar?: string;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ['applicant', 'officer'] },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    designation: { type: String },
    department: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

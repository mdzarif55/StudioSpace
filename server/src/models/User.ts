import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types/index.js';

export interface UserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    photoURL: { 
      type: String, 
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' 
    },
    role: { type: String, enum: ['creator', 'host', 'admin'], default: 'creator' }
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>('User', UserSchema);


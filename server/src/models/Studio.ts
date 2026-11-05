import mongoose, { Schema, Document } from 'mongoose';
import { IStudio } from '../types/index.js';

export interface StudioDocument extends Omit<IStudio, '_id'>, Document {}

const StudioSchema = new Schema<StudioDocument>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Photo Studio', 'Film Stage', 'Podcast Lounge', 'Music Suite', 'Art Workshop']
    },
    hourlyRate: { type: Number, required: true, min: 0 },
    securityDeposit: { type: Number, default: 0, min: 0 },
    maxCapacity: { type: Number, required: true, min: 1 },
    location: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    additionalImages: [{ type: String }],
    amenities: [{ type: String, required: true }],
    overview: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerEmail: { type: String, required: true, lowercase: true },
    ownerAvatar: { type: String },
    rating: { type: Number, default: 4.9, min: 1, max: 5 },
    reviewCount: { type: Number, default: 12 },
    featured: { type: Boolean, default: false },
    rules: [{ type: String }],
    dimensionsSqFt: { type: Number, default: 1200 }
  },
  { timestamps: true }
);

StudioSchema.index({ category: 1 });
StudioSchema.index({ ownerEmail: 1 });
StudioSchema.index({ rating: -1 });

export const Studio = mongoose.model<StudioDocument>('Studio', StudioSchema);


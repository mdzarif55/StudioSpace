import mongoose, { Schema, Document } from 'mongoose';
import { IWishlist } from '../types/index.js';

export interface WishlistDocument extends Omit<IWishlist, '_id'>, Document {}

const WishlistSchema = new Schema<WishlistDocument>(
  {
    userEmail: { type: String, required: true, lowercase: true },
    studioId: { type: String, required: true, ref: 'Studio' }
  },
  { timestamps: true }
);

WishlistSchema.index({ userEmail: 1, studioId: 1 }, { unique: true });

export const Wishlist = mongoose.model<WishlistDocument>('Wishlist', WishlistSchema);


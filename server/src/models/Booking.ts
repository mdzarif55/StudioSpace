import mongoose, { Schema, Document } from 'mongoose';
import { IBooking } from '../types/index.js';

export interface BookingDocument extends Omit<IBooking, '_id'>, Document {}

const BookingSchema = new Schema<BookingDocument>(
  {
    studioId: { type: String, required: true, ref: 'Studio' },
    studioTitle: { type: String, required: true },
    studioImage: { type: String, required: true },
    studioLocation: { type: String, required: true },
    hourlyRate: { type: Number, required: true },
    renterName: { type: String, required: true },
    renterEmail: { type: String, required: true, lowercase: true },
    renterPhone: { type: String },
    bookingDate: { type: String, required: true }, // Format: YYYY-MM-DD
    startTime: { type: String, required: true },   // Format: HH:mm
    endTime: { type: String, required: true },     // Format: HH:mm
    totalHours: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    securityDeposit: { type: Number, default: 0 },
    guestCount: { type: Number, default: 1 },
    specialNotes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

BookingSchema.index({ studioId: 1, bookingDate: 1, status: 1 });
BookingSchema.index({ renterEmail: 1 });

export const Booking = mongoose.model<BookingDocument>('Booking', BookingSchema);


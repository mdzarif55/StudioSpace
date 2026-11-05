'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Studio } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import {
  X,
  Calendar,
  Clock,
  Users,
  Phone,
  FileText,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface BookingModalProps {
  studio: Studio;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ studio, isOpen, onClose }) => {
  const router = useRouter();
  const { user } = useAuth();

  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [guestCount, setGuestCount] = useState(2);
  const [renterPhone, setRenterPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate duration and price in real-time
  const calculateTotal = () => {
    if (!startTime || !endTime) return { hours: 0, totalPrice: 0 };
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const diffMin = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMin <= 0) return { hours: 0, totalPrice: 0 };
    const hours = Math.round((diffMin / 60) * 10) / 10;
    return {
      hours,
      totalPrice: Math.round(hours * studio.hourlyRate)
    };
  };

  const { hours, totalPrice } = calculateTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    if (!user) {
      toast.info('Please log in or register before booking a workspace.');
      router.push('/login');
      return;
    }

    if (!bookingDate) {
      toast.error('Please pick a shoot date.');
      return;
    }

    if (hours <= 0) {
      toast.error('End time must be after start time.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetchAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          studioId: studio._id,
          bookingDate,
          startTime,
          endTime,
          guestCount,
          renterPhone,
          specialNotes
        })
      });

      if (res.success) {
        toast.success('Studio slot reserved! Status: Pending host confirmation.');
        onClose();
        router.push('/my-bookings');
      }
    } catch (err: any) {
      // Challenge 2 collision handling
      const msg = err.message || 'Failed to submit booking reservation.';
      setConflictError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date formatted as YYYY-MM-DD for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 text-zinc-900 dark:text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Reservation Engine</span>
          </div>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
            Reserve Workspace
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {studio.title} • ${studio.hourlyRate}/hr • {studio.location}
          </p>
        </div>

        {/* Conflict Warning Box (Challenge 2) */}
        {conflictError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Collision Detected</p>
              <p className="mt-0.5 leading-relaxed">{conflictError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-500" />
              <span>Production Date *</span>
            </label>
            <input
              type="date"
              required
              min={minDate}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Time Block (Start & End) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>Start Time *</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>End Time *</span>
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Guest Count & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-orange-500" />
                <span>Cast & Crew Size</span>
              </label>
              <input
                type="number"
                min="1"
                max={studio.maxCapacity}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">Max capacity: {studio.maxCapacity}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                <span>Contact Phone</span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={renterPhone}
                onChange={(e) => setRenterPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Special Production Notes */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-orange-500" />
              <span>Production Notes (Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="E.g., Bringing 2 RED cameras, need rolling garment rack and freight elevator code."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Pricing Breakdown Summary */}
          <div className="p-4 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>Hourly Rate</span>
              <span>${studio.hourlyRate} / hr</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>Estimated Duration</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{hours} {hours === 1 ? 'hour' : 'hours'}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>Security Deposit (Refundable Escrow)</span>
              <span>${studio.securityDeposit || 0}</span>
            </div>
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-extrabold text-zinc-900 dark:text-white">
              <span>Estimated Shoot Total</span>
              <span className="text-xl text-orange-600 dark:text-orange-400">${totalPrice}</span>
            </div>
          </div>

          {/* Trust Guarantee */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Includes $1M Host Liability Protection and free cancellation up to 48h before shoot.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || hours <= 0}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-orange-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Checking Collisions...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Request Booking Now</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};


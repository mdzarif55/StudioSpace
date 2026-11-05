'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { Booking } from '@/types';
import { generateBookingInvoicePDF } from '@/lib/pdfGenerator';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  Download,
  XCircle,
  CheckCircle,
  Hourglass,
  AlertTriangle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Private route check
  useEffect(() => {
    if (!isLoading && !user) {
      toast.info('Please log in to review your studio bookings.');
      router.push('/login?redirect=/my-bookings');
    }
  }, [user, isLoading, router]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await fetchAPI('/bookings/my-bookings');
      if (res.success && Array.isArray(res.bookings)) {
        setBookings(res.bookings);
      }
    } catch (err: any) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Loading your reservations...
        </p>
      </div>
    );
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);
      const res = await fetchAPI(`/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
      });

      if (res.success) {
        toast.success(res.message || 'Booking reservation cancelled.');
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: 'Cancelled' } : b))
        );
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel reservation.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownloadPDF = (booking: Booking) => {
    try {
      generateBookingInvoicePDF(booking);
      toast.success('Downloaded official StudioSpace PDF invoice.');
    } catch (err: any) {
      toast.error('Could not generate PDF invoice.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Hourglass className="w-3.5 h-3.5 animate-pulse" />
            <span>Pending Review</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen py-12 bg-zinc-50 dark:bg-[#0c0e14] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Production Schedule</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
              My Workspace Bookings
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Track upcoming production reservations, inspect reservation details, download invoices, or cancel pending slots.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-0.5"
          >
            <span>Book Another Studio</span>
          </Link>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 animate-pulse"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="You Have No Studio Reservations"
            description="Explore our curated directory of soundstages, cyc wall lofts, and podcast lounges to reserve your next production date."
            actionText="Explore Workspaces"
            actionHref="/studios"
          />
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#151922] p-6 shadow-sm hover:border-orange-500/30 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Studio Info */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={booking.studioImage}
                    alt={booking.studioTitle}
                    className="w-24 h-24 rounded-2xl object-cover shrink-0 ring-1 ring-zinc-200 dark:ring-zinc-800"
                  />
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(booking.status)}
                      <span className="text-[11px] font-mono text-zinc-400">
                        REF #{booking._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">
                      {booking.studioTitle}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{booking.studioLocation}</span>
                    </div>

                    {booking.specialNotes && (
                      <p className="text-[11px] text-zinc-400 italic line-clamp-1">
                        Note: &ldquo;{booking.specialNotes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Middle: Schedule & Financials */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 py-2 lg:py-0 border-y lg:border-y-0 lg:border-x border-zinc-100 dark:border-zinc-800/80 px-0 lg:px-8">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Shoot Date
                    </span>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-900 dark:text-white">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span>{booking.bookingDate}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Time Slot ({booking.totalHours} hrs)
                    </span>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-900 dark:text-white">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Total Cost
                    </span>
                    <div className="text-lg font-black text-orange-600 dark:text-orange-400">
                      ${booking.totalPrice}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap lg:flex-col items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end">
                  
                  {/* PDF Booking Invoice Generator */}
                  <button
                    onClick={() => handleDownloadPDF(booking)}
                    className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-500" />
                    <span>Download Invoice (PDF)</span>
                  </button>

                  {/* Cancel Booking (available for Pending or Confirmed slots) */}
                  {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}</span>
                    </button>
                  )}

                  <Link
                    href={`/studios/${booking.studioId}`}
                    className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 text-zinc-400 hover:text-orange-500 text-[11px] font-medium transition-colors"
                  >
                    <span>View Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}


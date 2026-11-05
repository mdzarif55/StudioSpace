'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Studio } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { BookingModal } from '@/components/studios/BookingModal';
import {
  MapPin,
  Star,
  Users,
  ShieldCheck,
  Maximize2,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

export default function StudioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Require login to view studio details
  useEffect(() => {
    if (!authLoading && !user) {
      toast.info('Please log in first to view full studio details.');
      router.push(`/login?redirect=/studios/${id}`);
    }
  }, [user, authLoading, id, router]);

  useEffect(() => {
    const loadStudio = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchAPI(`/studios/${id}`);
        if (res.success && res.studio) {
          setStudio(res.studio);
        } else {
          setError('Studio workspace could not be found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve studio details.');
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      loadStudio();
    }
  }, [id, user]);

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-6">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="w-full h-96 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
            <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          </div>
          <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Workspace Unavailable</h2>
        <p className="text-sm text-zinc-500 mb-6">{error || 'This studio listing does not exist.'}</p>
        <button
          onClick={() => router.push('/studios')}
          className="px-6 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
        >
          Return to Explore Studios
        </button>
      </div>
    );
  }

  // Combine primary image and additional gallery images
  const allImages = [studio.imageUrl, ...(studio.additionalImages || [])].filter(Boolean);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Studio link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen py-10 bg-zinc-50 dark:bg-[#0c0e14] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
              <span>Studios</span>
              <span>/</span>
              <span className="text-orange-500 font-semibold">{studio.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {studio.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{studio.rating ? studio.rating.toFixed(1) : '5.0'}</span>
                <span className="text-zinc-400 font-normal">({studio.reviewCount || 12} reviews)</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{studio.location}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:border-orange-500 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Space</span>
            </button>
          </div>
        </div>

        {/* Gallery Carousel */}
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 h-[380px] sm:h-[480px] lg:h-[520px] shadow-lg mb-10">
          <img
            src={allImages[activeImageIndex] || studio.imageUrl}
            alt={studio.title}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Carousel Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-orange-600 text-white backdrop-blur-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % allImages.length)}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-orange-600 text-white backdrop-blur-md transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Thumbnails */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-2xl bg-black/50 backdrop-blur-md">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex ? 'border-orange-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Specifications (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Hourly Rate</span>
                <div className="text-xl font-black text-orange-600 dark:text-orange-400">${studio.hourlyRate}/hr</div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Capacity</span>
                <div className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span>Up to {studio.maxCapacity}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Floor Space</span>
                <div className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                  <Maximize2 className="w-4 h-4 text-orange-500" />
                  <span>{studio.dimensionsSqFt || 1200} sq.ft</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Escrow Deposit</span>
                <div className="text-lg font-bold text-zinc-900 dark:text-white">${studio.securityDeposit || 0}</div>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Workspace Overview</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {studio.overview}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Amenities & Production Equipment</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studio.amenities?.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Studio Rules */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Studio Guidelines & Rules</h2>
              <div className="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                {(studio.rules && studio.rules.length > 0 ? studio.rules : [
                  'No open flame, smoke effects, or haze without prior host approval.',
                  'All crew members must keep noise below 85dB after 10 PM.',
                  'Studio space must be swept and left in original clean condition upon wrap.',
                  'Overtime shoot hours billed at 1.5x regular hourly rate.'
                ]).map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Section */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <img
                  src={studio.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={studio.ownerName}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-orange-500/40"
                />
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-500 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>Verified Studio Host</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{studio.ownerName}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{studio.ownerEmail}</p>
                </div>
              </div>
              <div className="text-right text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-semibold text-zinc-900 dark:text-white">Response rate: 100%</span>
                <p>Typically responds in under 15 minutes</p>
              </div>
            </div>

          </div>

          {/* Sticky Booking CTA Box (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 sm:p-7 space-y-6">
              
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-orange-600 dark:text-orange-400">
                    ${studio.hourlyRate}
                  </span>
                  <span className="text-xs text-zinc-500 font-semibold"> / hr</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{studio.rating ? studio.rating.toFixed(1) : '5.0'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Minimum Session:</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">2 Hours</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Security Deposit:</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">${studio.securityDeposit || 0}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Capacity:</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{studio.maxCapacity} Creators</span>
                </div>
              </div>

              {/* "Book Workspace Now" Action Button */}
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-xl shadow-orange-600/25 hover:shadow-orange-600/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Book Workspace Now</span>
              </button>

              <div className="space-y-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Backed by $1M Host Liability Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Double-booking collision protection guarantee</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Booking Modal Dialog */}
      <BookingModal
        studio={studio}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}


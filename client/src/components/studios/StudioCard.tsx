'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Studio } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { MapPin, Star, Heart, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface StudioCardProps {
  studio: Studio;
  isInitialSaved?: boolean;
  onWishlistToggle?: (studioId: string, isSaved: boolean) => void;
}

export const StudioCard: React.FC<StudioCardProps> = ({
  studio,
  isInitialSaved = false,
  onWishlistToggle
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(isInitialSaved);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please log in first to view full studio details and book workspace.');
      router.push(`/login?redirect=/studios/${studio._id}`);
    } else {
      router.push(`/studios/${studio._id}`);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info('Please log in to save studios to your wishlist.');
      return;
    }

    try {
      setIsLoadingWishlist(true);
      const res = await fetchAPI('/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ studioId: studio._id }),
      });

      if (res.success) {
        setIsSaved(res.isSaved);
        toast.success(res.message);
        if (onWishlistToggle) {
          onWishlistToggle(studio._id, res.isSaved);
        }
      }
    } catch (err: any) {
      toast.error('Could not update saved spaces.');
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Photo Studio':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Film Stage':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Podcast Lounge':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Music Suite':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'Art Workshop':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    }
  };

  return (
    <div className="group flex flex-col h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#151922] overflow-hidden hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-500/40 transition-all duration-300">
      
      {/* Studio Image & Badges Container (Uniform Height) */}
      <div className="relative w-full h-56 sm:h-60 overflow-hidden bg-zinc-900">
        <img
          src={studio.imageUrl}
          alt={studio.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getCategoryTheme(studio.category)}`}>
            {studio.category}
          </span>
        </div>

        {/* Wishlist Heart Icon */}
        <button
          onClick={handleToggleWishlist}
          disabled={isLoadingWishlist}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isSaved
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-black/40 hover:bg-black/60 text-white/90 hover:text-rose-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{studio.rating ? studio.rating.toFixed(1) : '5.0'}</span>
          <span className="text-zinc-300 font-normal">({studio.reviewCount || 12})</span>
        </div>

        {/* Max Capacity */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-zinc-200 text-xs font-medium">
          <Users className="w-3.5 h-3.5" />
          <span>Up to {studio.maxCapacity}</span>
        </div>
      </div>

      {/* Card Content & Details (Equal Height Body via flex-1) */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="truncate">{studio.location}</span>
          </div>

          {/* Title */}
          <button
            onClick={handleViewDetails}
            className="block text-left group-hover:text-orange-500 transition-colors w-full"
          >
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">
              {studio.title}
            </h3>
          </button>

          {/* Overview Snippet */}
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {studio.overview}
          </p>

          {/* Key Amenities Preview */}
          {studio.amenities && studio.amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {studio.amenities.slice(0, 2).map((amenity, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span className="truncate max-w-[120px]">{amenity}</span>
                </span>
              ))}
              {studio.amenities.length > 2 && (
                <span className="text-[10px] text-zinc-400 self-center">
                  +{studio.amenities.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer: Hourly Rate & "View Details" Button */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-zinc-400">Hourly Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
                ${studio.hourlyRate}
              </span>
              <span className="text-xs text-zinc-500 font-medium">/ hr</span>
            </div>
          </div>

          <button
            onClick={handleViewDetails}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-orange-600 text-white dark:bg-zinc-800 dark:hover:bg-orange-600 text-xs font-semibold shadow-sm hover:shadow-orange-600/20 transition-all duration-200 cursor-pointer"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};


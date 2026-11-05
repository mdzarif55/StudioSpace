'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Studio } from '@/types';
import { fetchAPI } from '@/lib/api';
import { StudioCard } from '../studios/StudioCard';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

export const FeaturedStudios: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAPI('/studios/featured');
      if (res.success && Array.isArray(res.studios)) {
        setStudios(res.studios);
      } else {
        setStudios([]);
      }
    } catch (err: any) {
      console.error('Failed to load featured studios:', err);
      setError(err.message || 'Unable to connect to StudioSpace database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-zinc-50/50 dark:bg-[#0c0e14] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Featured Creative Studios
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
              Dynamically fetched from MongoDB. Top-rated soundstages, infinity cyc lofts, and music sanctuaries handpicked for demanding creators.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-orange-400 hover:text-orange-500 transition-colors group"
          >
            <span>Browse All Available Spaces</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Studio Grid or Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-4 animate-pulse h-[420px]"
              >
                <div className="w-full h-52 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                <div className="pt-4 flex justify-between items-center">
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
                  <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-8 text-center max-w-md mx-auto">
            <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchFeatured}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-500 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Fetch</span>
            </button>
          </div>
        ) : studios.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            No featured studios found in database.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};


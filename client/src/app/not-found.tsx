'use client';

import React from 'react';
import Link from 'next/link';
import { Aperture, Home, Film, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-zinc-50 dark:bg-[#0c0e14]">
      <div className="max-w-lg w-full text-center space-y-8 p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-xl">
        
        {/* Creative Studio Spotlight / Aperture Graphic */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 opacity-20 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-orange-600/30">
            <Aperture className="w-12 h-12 animate-[spin_16s_linear_infinite]" />
          </div>
        </div>

        {/* 404 Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Out of Focus • 404</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Studio Space Not Found
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
            The creative stage, sound suite, or workspace URL you are looking for does not exist or has been relocated to another soundstage.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/studios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
          >
            <Film className="w-4 h-4" />
            <span>Explore Studios</span>
          </Link>
        </div>

      </div>
    </div>
  );
}


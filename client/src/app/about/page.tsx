'use client';

import React from 'react';
import Link from 'next/link';
import { Aperture, ShieldCheck, Target, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 bg-zinc-50 dark:bg-[#0c0e14] transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Our Origin & Mission</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
            Democratizing Access to Creative Production Spaces
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            StudioSpace was built to eliminate the gatekeepers of physical production by connecting independent creators with world-class, underutilized creative studios.
          </p>
        </div>

        {/* Mission & Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Transparent Access</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              No back-and-forth email chains or mystery rates. Real-time availability, clear hourly costs, and verified technical specifications.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Comprehensive Safety</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every booking includes $1M property damage protection, verified profiles, escrow deposits, and zero-collision scheduling guarantees.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Creator Community</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We empower studio owners to turn dark studio days into thriving income, while giving independent directors and artists spaces to excel.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Built by Filmmakers, for Filmmakers
          </h2>
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <p>
              In 2024, our founding team of commercial directors and audio engineers grew frustrated with how difficult it was to book commercial soundstages. You had to call studio managers, wait three days for insurance certificates, and pay 40% agency broker markups.
            </p>
            <p>
              At the same time, world-class studios sat vacant on Mondays, Tuesdays, and weeknights. StudioSpace bridges this divide with peer-to-peer sharing, instant scheduling, and standardized protection policies.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/studios"
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span>Explore Studios</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/add-studio"
              className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Become a Studio Host
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}


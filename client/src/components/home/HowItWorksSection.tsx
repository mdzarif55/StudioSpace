'use client';

import React from 'react';
import Link from 'next/link';
import { Search, CalendarCheck, Zap, Video, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Discover Spaces',
    description: 'Browse verified soundstages, cyc walls, audio suites, and art lofts with real specs, equipment inventories, and transparent hourly rates.',
    icon: Search,
    color: 'from-orange-500 to-amber-500',
  },
  {
    step: '02',
    title: 'Select Shoot Hours',
    description: 'Choose your shoot date and exact block of production hours. Check live calendar availability with built-in collision prevention.',
    icon: CalendarCheck,
    color: 'from-amber-500 to-yellow-500',
  },
  {
    step: '03',
    title: 'Book Instantly',
    description: 'Reserve your production slot in seconds with automated confirmations, security deposit escrow, and downloadable PDF invoices.',
    icon: Zap,
    color: 'from-orange-600 to-rose-500',
  },
  {
    step: '04',
    title: 'Create & Produce',
    description: 'Receive automated lockbox / host check-in instructions. Bring your cast and crew, power up the lighting grid, and create your masterpiece.',
    icon: Video,
    color: 'from-rose-500 to-purple-600',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-zinc-50 dark:bg-[#12161f] border-y border-zinc-200 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Streamlined Production Workflow
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            How Booking Works
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            From initial concept to wrap day. StudioSpace eliminates endless host emails, hidden fees, and scheduling headaches with our 4-step workflow.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#181d28] p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-zinc-200 dark:text-zinc-700/60 font-mono">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-600/10">
          <div>
            <h4 className="text-xl font-bold">Ready to roll cameras or record your next album?</h4>
            <p className="text-xs text-white/80 mt-1">Explore over 300+ creative workspaces ready for immediate booking.</p>
          </div>
          <Link
            href="/studios"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold shadow-lg transition-colors"
          >
            <span>Explore Workspaces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};


'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Wrench, Headphones, Check, Sparkles } from 'lucide-react';

const assurances = [
  {
    title: '$1,000,000 Host Liability Guarantee',
    description: 'Every confirmed reservation includes comprehensive platform insurance protecting studio facilities and gear against unexpected accidental property damages.',
    icon: ShieldCheck,
    tag: 'Automated Protection',
  },
  {
    title: 'Verified Creator Profiles & Backgrounds',
    description: 'Both studio hosts and visiting production crews pass our multi-tier identity verification, portfolio validation, and peer community ratings before booking.',
    icon: UserCheck,
    tag: 'Trusted Network',
  },
  {
    title: 'Pre-Inspected Equipment & Safety Standards',
    description: 'Camlock power boxes, lighting trusses, ventilation hoods, and fire safety systems are verified for code compliance and peak operational performance.',
    icon: Wrench,
    tag: 'Production Safe',
  },
  {
    title: '24/7 Host & Production Concierge Support',
    description: 'Need early load-in, emergency grip equipment delivery, or overtime clearance? Our dedicated creator support desk is reachable around the clock.',
    icon: Headphones,
    tag: 'Live Concierge',
  },
];

export const HostGuaranteeSection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-[#0c0e14] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unmatched Peace of Mind</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
              Host Guarantee & Creator Support
            </h2>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We understand what is on the line when filming multi-day projects, commercial shoots, or high-profile interviews. StudioSpace provides institutional-grade guarantees for both hosts and creators.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Zero hidden commission surcharges on gear add-ons',
                'Transparent cancellation policies with instant refunds',
                'Escrow security deposit protection with video damage log',
                'Host blackout dates and custom booking approvals'
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/add-studio"
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-0.5"
              >
                Become a Studio Host
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all"
              >
                Read Safety Policy
              </Link>
            </div>
          </div>

          {/* Right Column (7 cols): 4 Assurance Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {assurances.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-[#151922] p-6 space-y-3 hover:border-emerald-500/40 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};


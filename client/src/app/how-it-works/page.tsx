'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Calendar, Zap, Film, CheckCircle, Shield, ArrowRight, Sparkles } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-16 bg-zinc-50 dark:bg-[#0c0e14] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Transparent Creative Infrastructure</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
            How StudioSpace Works
          </h1>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Whether you are a commercial filmmaker booking an infinity cyc stage or a studio owner monetizing open days, here is how our peer-to-peer ecosystem connects creators.
          </p>
        </div>

        {/* For Creators vs For Hosts Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          
          {/* For Creators */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase">
              For Creators & Filmmakers
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Discover & Book In 4 Simple Steps
            </h2>

            <div className="space-y-6 pt-2">
              {[
                {
                  step: '1. Discover Verified Spaces',
                  desc: 'Search our directory by category, equipment package, power grid, and location. Inspect authentic high-res photos and square footage.'
                },
                {
                  step: '2. Check Live Slot Availability',
                  desc: 'Select shoot date and hours. Our collision engine prevents double-booking so your slot is guaranteed.'
                },
                {
                  step: '3. Instant Reservation & Escrow Protection',
                  desc: 'Submit reservation requests with transparent pricing. Security deposits are safely held in escrow.'
                },
                {
                  step: '4. Check-in & Roll Camera',
                  desc: 'Receive digital lockbox codes, load-in bay instructions, and host contact info. Create without friction.'
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{item.step}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/studios"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Browse Studios</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* For Hosts */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
              For Studio Owners & Hosts
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Monetize Downtime With Confidence
            </h2>

            <div className="space-y-6 pt-2">
              {[
                {
                  step: '1. List Your Workspace',
                  desc: 'Publish your studio specifications, hourly rate, included grip gear, house rules, and high-resolution visuals.'
                },
                {
                  step: '2. Set Your Rules & Availability',
                  desc: 'Retain 100% control over operational hours, blackout dates, crew size limits, and security deposit requirements.'
                },
                {
                  step: '3. Backed by $1M Host Guarantee',
                  desc: 'Every session is covered by our comprehensive property and liability insurance policy for total peace of mind.'
                },
                {
                  step: '4. Automated Direct Payouts',
                  desc: 'Receive secure payouts directly upon production wrap. Build repeat clients and glowing 5-star creator reviews.'
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{item.step}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/add-studio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold transition-all shadow-md"
              >
                <span>List Your Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


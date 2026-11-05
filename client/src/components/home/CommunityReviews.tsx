'use client';

import React from 'react';
import { Star, Quote, Award, Sparkles, Building, CalendarCheck, Users } from 'lucide-react';

const stats = [
  { label: 'Verified Production Studios', value: '540+', icon: Building },
  { label: 'Shoots Successfully Booked', value: '14,800+', icon: CalendarCheck },
  { label: 'Active Creators & Hosts', value: '28,000+', icon: Users },
  { label: 'Five-Star Production Rating', value: '99.4%', icon: Star },
];

const reviews = [
  {
    author: 'Mateo Morales',
    role: 'Commercial Cinematographer',
    project: 'Nike Summer Lookbook Campaign',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    content: 'StudioSpace transformed how we scout production locations. We booked the Aperture Cyc Stage in SoHo for 2 days—the power distribution, pre-hung scrims, and roll-up load bay made our 20-person crew workflow seamless.',
    rating: 5,
    studio: 'Aperture Daylight Infinity Cyc Stage',
  },
  {
    author: 'Chloe Vance',
    role: 'Executive Podcast Producer',
    project: 'The Modern Founder Podcast (Ep. 110)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    content: 'Zero friction. The 4K PTZ Sony cameras and Shure SM7B array were perfectly calibrated. We showed up with an external SSD, plugged into the console, and walked away with broadcast-ready ISO video tracks.',
    rating: 5,
    studio: 'The Broadcast Suite — Podcast Lounge',
  },
  {
    author: 'Darnell Washington',
    role: 'Grammy-Nominated Mixing Engineer',
    project: 'Atmospheric R&B Album Master',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    content: 'Booking the Dolby Atmos suite was unbelievable. The Genelec monitoring precision and vintage outboard gear are rare finds on any open marketplace. The double-booking prevention gave our team total confidence.',
    rating: 5,
    studio: 'Neve 88RS Analogue & Dolby Atmos Audio Suite',
  },
];

export const CommunityReviews: React.FC = () => {
  return (
    <section className="py-20 bg-zinc-50 dark:bg-[#12161f] border-t border-zinc-200 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#181d28] shadow-sm text-center space-y-2"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                  {s.value}
                </div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Trusted by Creators Nationwide
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Creator Community Voices
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Discover how visionary filmmakers, podcasters, and musicians use StudioSpace to bring their artistic productions to life without overhead baggage.
          </p>
        </div>

        {/* Reviews Cards (Equal Height) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#181d28] shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-zinc-300 dark:text-zinc-700" />
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic mb-4">
                  &ldquo;{rev.content}&rdquo;
                </p>

                <div className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 mb-4">
                  Booked: {rev.studio}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{rev.author}</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{rev.role}</p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{rev.project}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


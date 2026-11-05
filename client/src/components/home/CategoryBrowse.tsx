'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Film, Mic, Music, Palette, ArrowRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  count: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  bgImage: string;
  queryParam: string;
}

const categories: CategoryItem[] = [
  {
    id: 'photo',
    name: 'Photo Studios',
    count: '85+ Cyc Walls & Lofts',
    description: 'Daylight lofts, two-wall seamless cycloramas, and strobe-equipped commercial stages.',
    icon: Camera,
    gradient: 'from-blue-600/80 to-cyan-500/80',
    bgImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    queryParam: 'Photo Studio',
  },
  {
    id: 'film',
    name: 'Sound Stages',
    count: '60+ Stages & Warehouses',
    description: 'Acoustically isolated stages with Camlock 400A power, drive-in bay doors, and LED volumes.',
    icon: Film,
    gradient: 'from-purple-600/80 to-pink-500/80',
    bgImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    queryParam: 'Film Stage',
  },
  {
    id: 'podcast',
    name: 'Podcast Lounges',
    count: '95+ Turnkey Suites',
    description: 'Multi-camera 4K podcast suites, Shure SM7B setups, live switching, and soundproofing.',
    icon: Mic,
    gradient: 'from-amber-600/80 to-orange-500/80',
    bgImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    queryParam: 'Podcast Lounge',
  },
  {
    id: 'music',
    name: 'Music Suites',
    count: '70+ Mixing & Live Rooms',
    description: 'Dolby Atmos audio rooms, vintage Neve/SSL analog consoles, and vocal isolation booths.',
    icon: Music,
    gradient: 'from-rose-600/80 to-red-500/80',
    bgImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    queryParam: 'Music Suite',
  },
  {
    id: 'art',
    name: 'Art Workshops',
    count: '45+ Ceramic & Maker Spaces',
    description: 'High-ceiling industrial lofts with pottery wheels, ceramic kilns, and painter easels.',
    icon: Palette,
    gradient: 'from-emerald-600/80 to-teal-500/80',
    bgImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80',
    queryParam: 'Art Workshop',
  },
];

export const CategoryBrowse: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-[#0c0e14] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Tailored Creative Environments
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Browse by Studio Categories
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Select a specialized space engineered for your craft. Each category comes with pre-verified power, acoustics, and production specifications.
          </p>
        </div>

        {/* 5 Interactive Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/studios?category=${encodeURIComponent(cat.queryParam)}`}
                className="group relative h-80 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md hover:shadow-2xl hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-end p-5"
              >
                {/* Background Image */}
                <img
                  src={cat.bgImage}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:opacity-90 transition-opacity`} />

                {/* Accent glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-b ${cat.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative z-10 text-white space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-orange-500 transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-orange-400">
                    <span>{cat.count}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};


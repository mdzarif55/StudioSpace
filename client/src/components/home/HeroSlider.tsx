'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface Slide {
  id: number;
  tagline: string;
  headline: string;
  highlight: string;
  subtext: string;
  image: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  statBadge: string;
}

const slides: Slide[] = [
  {
    id: 1,
    tagline: 'CINEMA SOUNDSTAGES & CYC WALLS',
    headline: 'Unleash Your Production in',
    highlight: 'World-Class Film Stages',
    subtext: 'Book private infinity cyc walls, 400A Camlock power grids, drive-in roll-up doors, and pre-rigged ARRI lighting setups across premier media hubs.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&auto=format&fit=crop&q=85',
    primaryCtaText: 'Explore Studios',
    primaryCtaLink: '/studios?category=Film%20Stage',
    secondaryCtaText: 'Host Your Space',
    secondaryCtaLink: '/add-studio',
    statBadge: '400+ Verified Stages'
  },
  {
    id: 2,
    tagline: 'BROADCAST PODCAST LOUNGES',
    headline: 'Broadcast Every Episode in',
    highlight: 'Acoustically Treated Suites',
    subtext: 'Plug-and-play podcast studios featuring Shure SM7B mics, 4K Sony multi-cam switching, custom velvet lounge staging, and live streaming cloud uplinks.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1920&auto=format&fit=crop&q=85',
    primaryCtaText: 'Explore Studios',
    primaryCtaLink: '/studios?category=Podcast%20Lounge',
    secondaryCtaText: 'Host Your Space',
    secondaryCtaLink: '/add-studio',
    statBadge: 'Broadcast-Ready Gear'
  },
  {
    id: 3,
    tagline: 'ANALOG & DOLBY ATMOS AUDIO',
    headline: 'Capture Sonic Perfection in',
    highlight: 'Legendary Music Suites',
    subtext: 'From vintage Neve and SSL consoles to floating live tracking rooms and vocal isolation booths, find sanctuary for your next record or film score.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&auto=format&fit=crop&q=85',
    primaryCtaText: 'Explore Studios',
    primaryCtaLink: '/studios?category=Music%20Suite',
    secondaryCtaText: 'Host Your Space',
    secondaryCtaLink: '/add-studio',
    statBadge: '99.8% 5-Star Sessions'
  }
];

export const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[current];

  return (
    <div
      className="relative w-full h-[620px] md:h-[680px] lg:h-[720px] overflow-hidden bg-zinc-950 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Cinematic Overlays */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transition: 'opacity 1s ease-in-out, transform 8s ease' }}
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-transparent to-black/40" />
        </div>
      ))}

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl space-y-6">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeSlide.tagline}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-zinc-300 font-normal">{activeSlide.statBadge}</span>
          </div>

          {/* Punchy Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            {activeSlide.headline}{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
              {activeSlide.highlight}
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl font-normal">
            {activeSlide.subtext}
          </p>

          {/* Primary CTA Buttons ("Explore Studios" / "Host Your Space") */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={activeSlide.primaryCtaLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-orange-600/30 hover:shadow-orange-600/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>{activeSlide.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={activeSlide.secondaryCtaLink}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-500/60 hover:border-white bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md transition-all duration-200"
            >
              <span>{activeSlide.secondaryCtaText}</span>
            </Link>
          </div>

          {/* Trust Guarantee Micro-badge */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Instant booking confirmation • Real-time host messaging • Fully insured</span>
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-6 bottom-10 z-20 flex items-center gap-3">
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="p-3 rounded-full border border-white/20 bg-black/40 hover:bg-orange-600 hover:border-orange-600 text-white backdrop-blur-md transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="p-3 rounded-full border border-white/20 bg-black/40 hover:bg-orange-600 hover:border-orange-600 text-white backdrop-blur-md transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-orange-500' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};


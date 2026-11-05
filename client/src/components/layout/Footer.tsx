'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Aperture, Send, Heart, ShieldCheck, Mail } from 'lucide-react';
import { toast } from 'sonner';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to the StudioSpace Creator Dispatch!');
    setEmail('');
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-[#0c0e14] text-zinc-600 dark:text-zinc-400 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Mission Statement (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Aperture className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Studio<span className="text-orange-500">Space</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-sm">
              The premier peer-to-peer workspace marketplace built for filmmakers, photographers, audio engineers, podcasters, and visual artists. Discover verified creative sanctuaries and monetize your studio downtime.
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>$1,000,000 Comprehensive Host Liability Coverage</span>
            </div>

            {/* Social Links with the NEW X Logo (NOT Twitter bird!) */}
            <div className="flex items-center gap-3 pt-3">
              {/* New X Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow us on X"
                className="w-9 h-9 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-zinc-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/studios" className="hover:text-orange-500 transition-colors">
                  Explore All Spaces
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-orange-500 transition-colors">
                  How Booking Works
                </Link>
              </li>
              <li>
                <Link href="/add-studio" className="hover:text-orange-500 transition-colors">
                  Host Your Workspace
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-500 transition-colors">
                  About StudioSpace
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-orange-500 transition-colors">
                  Creator Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Studio Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-zinc-900 dark:text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/studios?category=Photo%20Studio" className="hover:text-orange-500 transition-colors">
                  Photo Studios & Cyc Walls
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Film%20Stage" className="hover:text-orange-500 transition-colors">
                  Cinema & Sound Stages
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Podcast%20Lounge" className="hover:text-orange-500 transition-colors">
                  Podcast Lounges & ISO Rooms
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Music%20Suite" className="hover:text-orange-500 transition-colors">
                  Music Suites & Mixing Rooms
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Art%20Workshop" className="hover:text-orange-500 transition-colors">
                  Ceramic & Art Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Input */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-zinc-900 dark:text-white">
              Creator Dispatch
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Get exclusive studio flash deals, equipment guides, and creator interviews delivered weekly.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@production.com"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">Zero spam. Unsubscribe anytime.</p>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} StudioSpace Marketplace Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-zinc-500 dark:text-zinc-400">
            <Link href="/about" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-orange-500 transition-colors">Trust & Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};


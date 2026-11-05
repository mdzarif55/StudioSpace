'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { Studio, Booking } from '@/types';
import {
  LayoutDashboard,
  CalendarCheck,
  FolderKanban,
  Heart,
  PlusCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Studio[]>([]);
  const [savedStudios, setSavedStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  // Private route check
  useEffect(() => {
    if (!isLoading && !user) {
      toast.info('Please log in to access your Creator Dashboard.');
      router.push('/login?redirect=/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [bookingsRes, listingsRes, wishlistRes] = await Promise.all([
          fetchAPI('/bookings/my-bookings').catch(() => ({ bookings: [] })),
          fetchAPI('/studios/user/listings').catch(() => ({ studios: [] })),
          fetchAPI('/wishlist').catch(() => ({ studios: [] }))
        ]);

        if (bookingsRes.success && Array.isArray(bookingsRes.bookings)) {
          setBookings(bookingsRes.bookings);
        }
        if (listingsRes.success && Array.isArray(listingsRes.studios)) {
          setListings(listingsRes.studios);
        }
        if (wishlistRes.success && Array.isArray(wishlistRes.studios)) {
          setSavedStudios(wishlistRes.studios);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Loading Creator Dashboard...
        </p>
      </div>
    );
  }

  // Calculate quick stats
  const activeBookingsCount = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending').length;
  const totalSpent = bookings.reduce((acc, b) => (b.status !== 'Cancelled' ? acc + b.totalPrice : acc), 0);

  return (
    <div className="min-h-screen py-12 bg-zinc-50 dark:bg-[#0c0e14] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <img
              src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-orange-500/30"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Creator Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                Welcome back, {user.name}!
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Studio</span>
            </Link>
          </div>
        </div>

        {/* 3 Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Reservations</span>
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">{activeBookingsCount}</div>
            <Link href="/my-bookings" className="text-xs font-semibold text-orange-500 hover:underline flex items-center gap-1 pt-1">
              <span>View all bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">My Studio Listings</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">{listings.length}</div>
            <Link href="/my-listings" className="text-xs font-semibold text-purple-500 hover:underline flex items-center gap-1 pt-1">
              <span>Manage studio spaces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Saved Favorites</span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">{savedStudios.length}</div>
            <Link href="/studios" className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1 pt-1">
              <span>Explore studio directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Recent Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Upcoming Reservations */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-orange-500" />
                <span>Upcoming Studio Sessions</span>
              </h3>
              <Link href="/my-bookings" className="text-xs font-semibold text-orange-500 hover:underline">
                View All
              </Link>
            </div>

            {bookings.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No reservations found.</p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 3).map((b) => (
                  <div
                    key={b._id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <img src={b.studioImage} alt={b.studioTitle} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">{b.studioTitle}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                          <span>{b.bookingDate}</span>
                          <span>•</span>
                          <span>{b.startTime} - {b.endTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400">${b.totalPrice}</span>
                      <p className="text-[10px] font-semibold text-zinc-400">{b.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User's Studio Listings Overview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-purple-500" />
                <span>Hosted Workspaces</span>
              </h3>
              <Link href="/my-listings" className="text-xs font-semibold text-purple-500 hover:underline">
                Manage
              </Link>
            </div>

            {listings.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">You haven&apos;t listed any studios yet.</p>
            ) : (
              <div className="space-y-3">
                {listings.slice(0, 3).map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <img src={s.imageUrl} alt={s.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">{s.title}</h4>
                        <p className="text-[10px] text-zinc-400">{s.category} • {s.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400">${s.hourlyRate}/hr</span>
                      <p className="text-[10px] text-emerald-500 font-semibold">Active</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}


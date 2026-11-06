'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { Studio, Booking } from '@/types';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Calendar,
  Sparkles,
  Edit3,
  ShieldCheck,
  Building2,
  CalendarCheck,
  FolderKanban,
  Heart,
  Camera,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  Save,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

// Curated avatar presets for creators and hosts
const AVATAR_PRESETS = [
  {
    label: 'Photographer',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Filmmaker',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Sound Engineer',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Creative Director',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Podcaster',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Visual Artist',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateUserProfile, checkSession } = useAuth();

  // Metrics states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Studio[]>([]);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [dataLoading, setDataLoading] = useState(true);

  // Edit modal & form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState<'creator' | 'host'>('creator');
  const [photoURL, setPhotoURL] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');

  // Password Change Fields
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Protect private route with single-page resilience
  useEffect(() => {
    if (!isLoading && !user) {
      toast.info('Please log in to view your profile.');
      router.push('/login?redirect=/profile');
    }
  }, [user, isLoading, router]);

  // Sync user state into edit form
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setRole((user.role as 'creator' | 'host') || 'creator');
      setPhotoURL(
        user.photoURL ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      );
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setBio(user.bio || '');
      setWebsite(user.website || '');
      setInstagram(user.instagram || '');
    }
  }, [user]);

  // Load user statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        setDataLoading(true);
        const [bookingsRes, listingsRes, wishlistRes] = await Promise.all([
          fetchAPI('/bookings/my-bookings').catch(() => ({ bookings: [] })),
          fetchAPI('/studios/user/listings').catch(() => ({ studios: [] })),
          fetchAPI('/wishlist').catch(() => ({ studios: [] })),
        ]);

        if (bookingsRes.success && Array.isArray(bookingsRes.bookings)) {
          setBookings(bookingsRes.bookings);
        }
        if (listingsRes.success && Array.isArray(listingsRes.studios)) {
          setListings(listingsRes.studios);
        }
        if (wishlistRes.success && Array.isArray(wishlistRes.studios)) {
          setSavedCount(wishlistRes.studios.length);
        }
      } catch (err) {
        console.error('Error fetching profile metrics:', err);
      } finally {
        setDataLoading(false);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user]);

  // Handle Edit Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Full name is required.');
      return;
    }

    // Password validation if user opted to change password
    if (showPasswordSection && (newPassword || currentPassword)) {
      if (!currentPassword) {
        toast.error('Current password is required to change password.');
        return;
      }
      if (newPassword.length < 6) {
        toast.error('New password must be at least 6 characters long.');
        return;
      }
      if (!/[A-Z]/.test(newPassword)) {
        toast.error('New password must contain at least one uppercase letter.');
        return;
      }
      if (!/[a-z]/.test(newPassword)) {
        toast.error('New password must contain at least one lowercase letter.');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('New password and confirm password do not match.');
        return;
      }
    }

    try {
      setIsSaving(true);
      const updateData: any = {
        name: name.trim(),
        role,
        photoURL: photoURL.trim(),
        phone: phone.trim(),
        location: location.trim(),
        bio: bio.trim(),
        website: website.trim(),
        instagram: instagram.trim(),
      };

      if (showPasswordSection && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      const success = await updateUserProfile(updateData);
      if (success) {
        setIsEditModalOpen(false);
        // Reset password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordSection(false);
        // Refresh session data
        await checkSession();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Loading StudioSpace Profile...
        </p>
      </div>
    );
  }

  // Format joined date
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'November 2026';

  return (
    <div className="min-h-screen py-10 bg-zinc-50 dark:bg-[#0c0e14] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Hero Card */}
        <div className="relative rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden mb-8">
          {/* Top Decorative Banner */}
          <div className="h-44 sm:h-52 w-full bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 relative">
            <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" />
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
                Verified Creator Account
              </span>
            </div>
          </div>

          {/* Profile Header Details */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
              
              {/* Avatar + Basic Identity */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                <div className="relative group w-28 h-28 sm:w-36 sm:h-36 rounded-3xl ring-4 ring-white dark:ring-[#151922] shadow-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Change</span>
                  </button>
                </div>

                <div className="space-y-1 sm:mb-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                      {user.name}
                    </h1>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40 flex items-center gap-1">
                      {user.role === 'host' ? (
                        <>
                          <Building2 className="w-3 h-3" />
                          <span>Studio Host</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>Creative Member</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      {user.email}
                    </span>
                    {user.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        {user.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      Member since {joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 self-start sm:self-end">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all hover:-translate-y-0.5"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold text-xs transition-colors"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </Link>
              </div>

            </div>

            {/* Bio / Summary Statement */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Creative Bio
              </h3>
              {user.bio ? (
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-3xl">
                  {user.bio}
                </p>
              ) : (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
                  <span>Add your creative statement, gear preferences, and production disciplines so collaborators know what you produce.</span>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-orange-500 font-bold hover:underline ml-3 whitespace-nowrap"
                  >
                    + Add Bio
                  </button>
                </div>
              )}
            </div>

            {/* Quick Contact & Portfolio Links */}
            {(user.phone || user.website || user.instagram) && (
              <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
                {user.phone && (
                  <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                    <Phone className="w-3.5 h-3.5 text-orange-500" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.website && (
                  <a
                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 hover:underline font-medium"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{user.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
                {user.instagram && (
                  <a
                    href={`https://instagram.com/${user.instagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-rose-500 hover:underline font-medium"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@{user.instagram.replace(/^@/, '')}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          <div className="p-5 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Bookings</span>
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">
              {dataLoading ? '...' : bookings.length}
            </div>
            <Link href="/my-bookings" className="text-[11px] font-semibold text-orange-500 hover:underline flex items-center gap-1 pt-1">
              <span>View bookings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Hosted Studios</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">
              {dataLoading ? '...' : listings.length}
            </div>
            <Link href="/my-listings" className="text-[11px] font-semibold text-purple-500 hover:underline flex items-center gap-1 pt-1">
              <span>Manage listings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Saved Wishlist</span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">
              {dataLoading ? '...' : savedCount}
            </div>
            <Link href="/studios" className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-1 pt-1">
              <span>Explore spaces</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Account Pass</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              Active Pro
            </div>
            <span className="text-[11px] text-zinc-400 block pt-1">Standard Production Tier</span>
          </div>

        </div>

        {/* Quick Hub Shortcuts */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Creative Workspace Shortcuts</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/add-studio"
              className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 hover:bg-orange-50 dark:hover:bg-orange-950/20 border border-zinc-100 dark:border-zinc-800 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors">
                  List Your Studio
                </span>
                <Building2 className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Turn your soundstage, photo cove, or vocal booth into shared revenue.
              </p>
            </Link>

            <Link
              href="/studios"
              className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 hover:bg-orange-50 dark:hover:bg-orange-950/20 border border-zinc-100 dark:border-zinc-800 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors">
                  Book Workspaces
                </span>
                <CalendarCheck className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Browse verified stages with live equipment rosters and instant reservations.
              </p>
            </Link>

            <Link
              href="/my-bookings"
              className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 hover:bg-orange-50 dark:hover:bg-orange-950/20 border border-zinc-100 dark:border-zinc-800 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors">
                  Session Receipts & Invoices
                </span>
                <ShieldCheck className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Download printable PDF production booking invoices and calendar schedules.
              </p>
            </Link>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#151922] w-full max-w-2xl rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Edit StudioSpace Profile
                  </h3>
                  <p className="text-xs text-zinc-400">Update your public creator bio and contact settings</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Full Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-orange-500" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Julian Vance"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-orange-500" />
                    <span>Platform Role</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'creator' | 'host')}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="creator">Creator / Renter (Book Studios)</option>
                    <option value="host">Studio Host (Own & List Studios)</option>
                  </select>
                </div>
              </div>

              {/* Avatar URL & Presets */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-orange-500" />
                    <span>Profile Photo URL</span>
                  </span>
                  <span className="text-[11px] font-normal text-zinc-400">Paste URL or pick preset</span>
                </label>
                
                <div className="flex items-center gap-3">
                  <img
                    src={photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-orange-500/30 shrink-0"
                  />
                  <input
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Preset Avatars */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Quick Preset Avatars:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setPhotoURL(preset.url)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 transition-colors ${
                          photoURL === preset.url
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-orange-500/50'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-3.5 h-3.5 rounded-full object-cover" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phone & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-500" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>Location / Base City</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Brooklyn, New York, NY"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Bio Statement */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                  <span>Creative Bio / Production Experience</span>
                  <span className="text-[10px] text-zinc-400">{bio.length}/500</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 500))}
                  rows={3}
                  placeholder="Tell clients and studio hosts about your creative craft, preferred gear, commercial projects, or stage management..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* Portfolio & Instagram Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-orange-500" />
                    <span>Portfolio / Website URL</span>
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://mycreativestudio.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-rose-500" />
                    <span>Instagram Handle</span>
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@studiospace.creator"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Optional Security / Password Change Collapsible */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-zinc-50/50 dark:bg-zinc-900/30">
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-zinc-800 dark:text-zinc-200"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-orange-500" />
                    <span>Change Account Password (Optional)</span>
                  </div>
                  <span className="text-orange-500 text-xs">
                    {showPasswordSection ? 'Hide' : 'Expand'}
                  </span>
                </button>

                {showPasswordSection && (
                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                          aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 6 chars (Upper + Lower)"
                            className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                            aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat new password"
                            className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Password must be 6+ chars and contain uppercase and lowercase letters.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}


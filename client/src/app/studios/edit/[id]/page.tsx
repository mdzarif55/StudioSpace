'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { Studio, StudioCategory } from '@/types';
import {
  Edit3,
  Building,
  DollarSign,
  Image as ImageIcon,
  CheckSquare,
  FileText,
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

const categoryOptions: StudioCategory[] = [
  'Photo Studio',
  'Film Stage',
  'Podcast Lounge',
  'Music Suite',
  'Art Workshop'
];

const availableAmenities = [
  'Cyclorama Infinity Wall',
  'ARRI & Aputure Lighting Grid',
  'Soundproofing (STC 60+)',
  '4K Multi-Camera Setup',
  'Shure SM7B Microphones',
  'Dolby Atmos Monitoring',
  'Grand Piano & Outboard Gear',
  'Pottery Wheels & Kiln Access',
  'High-Speed 1Gbps Fiber WiFi',
  'Hair & Makeup Vanity Station',
  'Private Dressing Lounge',
  'Freight Elevator & Loading Dock',
  'Drive-in Roll-up Bay Door',
  'Green Screen Cyc',
  'Air Conditioning & Heating',
  'Free Dedicated Crew Parking'
];

export default function EditStudioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [loadingData, setLoadingData] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudioCategory>('Photo Studio');
  const [hourlyRate, setHourlyRate] = useState<number | ''>(100);
  const [securityDeposit, setSecurityDeposit] = useState<number | ''>(200);
  const [maxCapacity, setMaxCapacity] = useState<number | ''>(15);
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [overview, setOverview] = useState('');
  const [dimensionsSqFt, setDimensionsSqFt] = useState<number | ''>(1200);
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Private route check
  useEffect(() => {
    if (!isLoading && !user) {
      toast.info('Please sign in to edit your studio listing.');
      router.push(`/login?redirect=/studios/edit/${id}`);
    }
  }, [user, isLoading, router, id]);

  // Load existing studio data to pre-fill the form
  useEffect(() => {
    const fetchStudio = async () => {
      try {
        setLoadingData(true);
        const res = await fetchAPI(`/studios/${id}`);
        if (res.success && res.studio) {
          const s: Studio = res.studio;
          setTitle(s.title);
          setCategory(s.category);
          setHourlyRate(s.hourlyRate);
          setSecurityDeposit(s.securityDeposit || 0);
          setMaxCapacity(s.maxCapacity);
          setLocation(s.location);
          setImageUrl(s.imageUrl);
          setSelectedAmenities(s.amenities || []);
          setOverview(s.overview);
          setDimensionsSqFt(s.dimensionsSqFt || 1200);
          setOwnerName(s.ownerName);
          setOwnerEmail(s.ownerEmail);
        }
      } catch (err: any) {
        toast.error('Failed to load existing studio information.');
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      fetchStudio();
    }
  }, [id]);

  if (isLoading || loadingData || !user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Loading studio listing details...
        </p>
      </div>
    );
  }

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !hourlyRate || !maxCapacity || !location || !imageUrl || !overview) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetchAPI(`/studios/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          category,
          hourlyRate: Number(hourlyRate),
          securityDeposit: Number(securityDeposit || 0),
          maxCapacity: Number(maxCapacity),
          location,
          imageUrl,
          amenities: selectedAmenities,
          overview,
          dimensionsSqFt: Number(dimensionsSqFt || 1200),
        }),
      });

      if (res.success) {
        toast.success(res.message || 'Studio listing updated successfully in MongoDB!');
        router.push('/my-listings');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update studio listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-zinc-50 dark:bg-[#0c0e14] transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update Studio Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            Edit Studio Listing
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
            Update hourly pricing, amenities inventory, and high-resolution visuals for this workspace.
          </p>
        </div>

        {/* Pre-filled Form */}
        <div className="rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Identity */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <Building className="w-4 h-4 text-orange-500" />
                <span>1. Workspace Identity</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Studio Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as StudioCategory)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Location / Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Rates */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <DollarSign className="w-4 h-4 text-orange-500" />
                <span>2. Pricing & Capacity</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Hourly Rate ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Security Deposit ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Max Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Square Footage (sq.ft)
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={dimensionsSqFt}
                    onChange={(e) => setDimensionsSqFt(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Image URL */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <ImageIcon className="w-4 h-4 text-orange-500" />
                <span>3. Showcase Image</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {imageUrl && (
                <div className="relative rounded-2xl overflow-hidden h-40 bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* 4. Amenities */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <CheckSquare className="w-4 h-4 text-orange-500" />
                <span>4. Amenities & Gear</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {availableAmenities.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                        isChecked
                          ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-orange-500 border-orange-500 text-white' : 'border-zinc-300 dark:border-zinc-700'
                      }`}>
                        {isChecked && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                      <span className="truncate">{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Overview */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>5. Detailed Overview</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Detailed Overview *
                </label>
                <textarea
                  rows={4}
                  required
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
                />
              </div>
            </div>

            {/* 6. Read-Only Host Info */}
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-500" />
                <span>Host Information (Read-Only)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-400">Host Name:</span>
                  <div className="font-bold text-zinc-900 dark:text-white">{ownerName || user.name}</div>
                </div>
                <div>
                  <span className="text-zinc-400">Host Email:</span>
                  <div className="font-bold text-zinc-900 dark:text-white">{ownerEmail || user.email}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/my-listings')}
                className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-orange-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {submitting ? (
                  <span>Updating Studio...</span>
                ) : (
                  <>
                    <span>Save Changes</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}


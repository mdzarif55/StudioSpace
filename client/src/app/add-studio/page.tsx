'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { StudioCategory } from '@/types';
import {
  PlusCircle,
  Building,
  DollarSign,
  Users,
  MapPin,
  Image as ImageIcon,
  CheckSquare,
  FileText,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck
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

export default function AddStudioPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudioCategory>('Photo Studio');
  const [hourlyRate, setHourlyRate] = useState<number | ''>(120);
  const [securityDeposit, setSecurityDeposit] = useState<number | ''>(200);
  const [maxCapacity, setMaxCapacity] = useState<number | ''>(20);
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High-Speed 1Gbps Fiber WiFi',
    'Air Conditioning & Heating'
  ]);
  const [overview, setOverview] = useState('');
  const [dimensionsSqFt, setDimensionsSqFt] = useState<number | ''>(1500);
  const [submitting, setSubmitting] = useState(false);

  // Private route check: ONLY redirect if auth finished loading AND user is null
  useEffect(() => {
    if (!isLoading && !user) {
      toast.info('Please sign in to list a creative studio.');
      router.push('/login?redirect=/add-studio');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Verifying host credentials...
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

  const handleSelectPresetImage = (url: string) => {
    setImageUrl(url);
    toast.success('Selected studio showcase photo.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !hourlyRate || !maxCapacity || !location || !imageUrl || !overview) {
      toast.error('Please complete all required fields.');
      return;
    }

    if (selectedAmenities.length === 0) {
      toast.error('Please select at least one production amenity.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetchAPI('/studios', {
        method: 'POST',
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
          dimensionsSqFt: Number(dimensionsSqFt || 1200)
        }),
      });

      if (res.success) {
        toast.success('Studio workspace listed successfully on StudioSpace!');
        router.push('/my-listings');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to list studio workspace.');
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
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Host Workspace Creation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            List a Creative Studio
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
            Monetize your studio downtime. Join verified hosts earning thousands by sharing cyc stages, recording suites, and artist lofts.
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Basic Studio Details */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <Building className="w-4 h-4 text-orange-500" />
                <span>1. Workspace Identity</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Studio Listing Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Aperture Daylight Infinity Cyc Stage"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Studio Category *
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
                    Studio Location / Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., SoHo Arts District, New York, NY"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Capacity */}
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
                    placeholder="120"
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
                    placeholder="200"
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
                    placeholder="20"
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
                    placeholder="1500"
                    value={dimensionsSqFt}
                    onChange={(e) => setDimensionsSqFt(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Visual Showcase */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <ImageIcon className="w-4 h-4 text-orange-500" />
                <span>3. Photography & Showcase Image</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Primary Studio Image URL (ImgBB / Unsplash / Direct Link) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Instant High-Res Preset Picker */}
              <div>
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
                  Or select a verified studio photography preset:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { name: 'Cyc Wall Loft', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80' },
                    { name: 'Sound Stage', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80' },
                    { name: 'Podcast Suite', url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80' },
                    { name: 'Audio Neve', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80' },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPresetImage(preset.url)}
                      className={`relative rounded-xl overflow-hidden h-20 border-2 transition-all ${
                        imageUrl === preset.url ? 'border-orange-500 scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white font-medium">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Live Preview */}
              {imageUrl && (
                <div className="relative rounded-2xl overflow-hidden h-44 bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-black/60 text-white text-[10px] font-bold">
                    Live Photo Preview
                  </span>
                </div>
              )}
            </div>

            {/* Section 4: Amenities Checkboxes */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <CheckSquare className="w-4 h-4 text-orange-500" />
                <span>4. Included Amenities & Gear</span>
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

            {/* Section 5: Detailed Overview */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>5. Detailed Overview</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Studio Overview & Technical Specifications *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your studio layout, natural lighting exposure, acoustic dampening, power specs, loading access, and what makes it extraordinary for creators..."
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Section 6: Read-Only User Host Credentials */}
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-500" />
                <span>Host Verification (Read-Only)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-400">Host Name:</span>
                  <div className="font-bold text-zinc-900 dark:text-white">{user.name}</div>
                </div>
                <div>
                  <span className="text-zinc-400">Host Email:</span>
                  <div className="font-bold text-zinc-900 dark:text-white">{user.email}</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
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
                  <span>Publishing Listing to MongoDB...</span>
                ) : (
                  <>
                    <span>Publish Studio Workspace</span>
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


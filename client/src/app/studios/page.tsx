'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Studio, StudioCategory } from '@/types';
import { fetchAPI } from '@/lib/api';
import { StudioCard } from '@/components/studios/StudioCard';
import { StudioCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search, SlidersHorizontal, Sparkles, FolderSearch } from 'lucide-react';

const categories = [
  'All',
  'Photo Studio',
  'Film Stage',
  'Podcast Lounge',
  'Music Suite',
  'Art Workshop'
];

function StudiosList() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Update category when URL query changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const loadStudios = async () => {
    try {
      setLoading(true);
      let endpoint = '/studios?';
      const params = new URLSearchParams();

      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (sortBy === 'price-low') {
        params.append('sort', 'price-low');
      } else if (sortBy === 'price-high') {
        params.append('sort', 'price-high');
      } else if (sortBy === 'rating') {
        params.append('sort', 'rating');
      }

      endpoint += params.toString();
      const res = await fetchAPI(endpoint);
      if (res.success && Array.isArray(res.studios)) {
        setStudios(res.studios);
      }
    } catch (err) {
      console.error('Error fetching studios:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's wishlist IDs
  const loadWishlist = async () => {
    try {
      const res = await fetchAPI('/wishlist');
      if (res.success && Array.isArray(res.studioIds)) {
        setSavedIds(res.studioIds);
      }
    } catch {
      // not logged in, wishlist empty
    }
  };

  useEffect(() => {
    loadStudios();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadStudios();
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('latest');
  };

  return (
    <div className="min-h-screen py-12 bg-zinc-50 dark:bg-[#0c0e14] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            Explore Production Studios
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Discover verified cyc walls, sound stages, acoustic podcast lounges, analog recording suites, and artist workshops across the country.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-[#151922] p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by studio title, equipment, city..."
                className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition-colors"
              >
                Search
              </button>
            </form>

            {/* Price / Rating Sort */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                <span>Sort By:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="latest">Newest Workspaces</option>
                <option value="price-low">Hourly Rate: Low to High</option>
                <option value="price-high">Hourly Rate: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                      : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Studios Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        ) : studios.length === 0 ? (
          <EmptyState
            icon={FolderSearch}
            title="No Studios Match Your Search"
            description="We couldn't find any production spaces matching your current search and filter selections. Try clearing your filters."
            actionText="Reset All Filters"
            onActionClick={handleResetFilters}
          />
        ) : (
          <div>
            <div className="mb-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Showing {studios.length} verified creative {studios.length === 1 ? 'workspace' : 'workspaces'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {studios.map((studio) => (
                <StudioCard
                  key={studio._id}
                  studio={studio}
                  isInitialSaved={savedIds.includes(studio._id)}
                  onWishlistToggle={(id, saved) => {
                    setSavedIds((prev) => (saved ? [...prev, id] : prev.filter((i) => i !== id)));
                  }}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-12 text-center">Loading studio catalog...</div>}>
      <StudiosList />
    </Suspense>
  );
}


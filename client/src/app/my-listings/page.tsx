'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { Studio } from '@/types';
import { DeleteConfirmModal } from '@/components/studios/DeleteConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  FolderKanban,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Star,
  Users,
  Sparkles,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

export default function MyListingsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [listings, setListings] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Private route: wait until isLoading finishes before redirecting
  useEffect(() => {
    if (!isLoading && !user) {
      toast.info('Please sign in to access your studio listings.');
      router.push('/login?redirect=/my-listings');
    }
  }, [user, isLoading, router]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const res = await fetchAPI('/studios/user/listings');
      if (res.success && Array.isArray(res.studios)) {
        setListings(res.studios);
      }
    } catch (err: any) {
      console.error('Failed to load user listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadListings();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Loading your studio portfolio...
        </p>
      </div>
    );
  }

  const promptDelete = (studio: Studio) => {
    setSelectedStudio(studio);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudio) return;

    try {
      setIsDeleting(true);
      const res = await fetchAPI(`/studios/${selectedStudio._id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        toast.success(res.message || 'Studio listing deleted successfully from MongoDB.');
        setListings(listings.filter((s) => s._id !== selectedStudio._id));
        setDeleteModalOpen(false);
        setSelectedStudio(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete studio listing.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-zinc-50 dark:bg-[#0c0e14] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Host Portfolio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
              My Studio Listings
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Manage your active production spaces, modify pricing, or remove inactive creative lofts.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Studio</span>
          </Link>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 animate-pulse"
              />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            icon={Building}
            title="You Have No Studio Listings Yet"
            description="Turn your production stages, podcast rooms, or soundproof suites into recurring income by listing them on StudioSpace."
            actionText="List Your First Studio"
            actionHref="/add-studio"
          />
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#151922] shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-bold">
                    <th className="py-4 px-6">Studio Workspace</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Hourly Rate</th>
                    <th className="py-4 px-4">Capacity</th>
                    <th className="py-4 px-4">Rating</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {listings.map((studio) => (
                    <tr key={studio._id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={studio.imageUrl}
                            alt={studio.title}
                            className="w-16 h-12 rounded-lg object-cover ring-1 ring-zinc-200 dark:ring-zinc-800"
                          />
                          <div>
                            <Link
                              href={`/studios/${studio._id}`}
                              className="font-bold text-zinc-900 dark:text-white hover:text-orange-500 transition-colors line-clamp-1 text-sm"
                            >
                              {studio.title}
                            </Link>
                            <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                              <MapPin className="w-3 h-3 text-orange-500" />
                              <span className="truncate max-w-xs">{studio.location}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {studio.category}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-orange-600 dark:text-orange-400 text-sm">
                        ${studio.hourlyRate}/hr
                      </td>

                      <td className="py-4 px-4 text-zinc-600 dark:text-zinc-400">
                        {studio.maxCapacity} creators
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{studio.rating ? studio.rating.toFixed(1) : '5.0'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/studios/${studio._id}`}
                            aria-label="View public page"
                            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/studios/edit/${studio._id}`}
                            aria-label="Edit listing"
                            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 text-zinc-600 dark:text-zinc-400 hover:text-orange-500 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => promptDelete(studio)}
                            aria-label="Delete listing"
                            className="p-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {listings.map((studio) => (
                <div
                  key={studio._id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#151922] p-4 space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={studio.imageUrl}
                      alt={studio.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-orange-500 uppercase">{studio.category}</span>
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate">{studio.title}</h3>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{studio.location}</p>
                      <div className="mt-1 font-bold text-orange-600 dark:text-orange-400">${studio.hourlyRate}/hr</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                    <Link
                      href={`/studios/${studio._id}`}
                      className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/studios/edit/${studio._id}`}
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5 text-orange-500" />
                        <span>Edit</span>
                      </Link>

                      <button
                        onClick={() => promptDelete(studio)}
                        className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-950/40 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {selectedStudio && (
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Studio Listing"
          itemName={selectedStudio.title}
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setSelectedStudio(null);
          }}
        />
      )}
    </div>
  );
}


'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  itemName,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 text-zinc-900 dark:text-white">
        
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Warning */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{title}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Irreversible Action</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
          Are you sure you want to permanently delete <strong className="text-zinc-900 dark:text-white">&ldquo;{itemName}&rdquo;</strong> from MongoDB? All associated data and future reservations will be purged.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isDeleting ? (
              <span>Deleting Document...</span>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Studio</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};


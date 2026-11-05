'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 p-12 text-center max-w-lg mx-auto">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 max-w-sm mx-auto">
        {description}
      </p>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-0.5"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      {actionText && onActionClick && !actionHref && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-0.5"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};


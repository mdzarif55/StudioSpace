'use client';

import React from 'react';

export const StudioCardSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#151922] p-4 space-y-4 animate-pulse h-[430px]">
    <div className="w-full h-56 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
    <div className="pt-4 flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800/80">
      <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
      <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-1/3" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <tr className="animate-pulse border-b border-zinc-100 dark:border-zinc-800">
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="space-y-1.5">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-36" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-24" />
        </div>
      </div>
    </td>
    <td className="p-4"><div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20" /></td>
    <td className="p-4"><div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16" /></td>
    <td className="p-4"><div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-20" /></td>
    <td className="p-4"><div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-24 ml-auto" /></td>
  </tr>
);


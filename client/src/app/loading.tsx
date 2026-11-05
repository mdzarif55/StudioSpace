'use client';

import React from 'react';
import { Aperture } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4 bg-zinc-50 dark:bg-[#0c0e14]">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping" />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
          <Aperture className="w-8 h-8 animate-[spin_3s_linear_infinite]" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-base font-bold text-zinc-900 dark:text-white">StudioSpace</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading creative workspace data...</p>
      </div>
    </div>
  );
}


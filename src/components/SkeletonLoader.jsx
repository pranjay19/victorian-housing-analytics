import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      
      {/* Skeleton KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 rounded bg-slate-800 animate-shimmer" />
              <div className="w-9 h-9 rounded-xl bg-slate-800 animate-shimmer" />
            </div>
            <div className="h-8 w-36 rounded bg-slate-800 animate-shimmer" />
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-slate-800/70" />
              <div className="h-4 w-16 rounded bg-slate-800/70" />
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="h-10 w-full md:w-80 rounded-xl bg-slate-800 animate-shimmer" />
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="h-10 w-36 rounded-xl bg-slate-800 animate-shimmer" />
            <div className="h-10 w-24 rounded-xl bg-slate-800 animate-shimmer" />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <div className="h-6 w-20 rounded-lg bg-slate-800 animate-shimmer" />
          <div className="h-6 w-24 rounded-lg bg-slate-800 animate-shimmer" />
          <div className="h-6 w-24 rounded-lg bg-slate-800 animate-shimmer" />
        </div>
      </div>

      {/* Skeleton Chart Box */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-56 rounded bg-slate-800 animate-shimmer" />
            <div className="h-3 w-40 rounded bg-slate-800/60" />
          </div>
          <div className="h-8 w-32 rounded-xl bg-slate-800 animate-shimmer" />
        </div>

        {/* Chart Bar Stubs */}
        <div className="h-72 w-full flex items-end justify-between gap-3 pt-6 px-4">
          {[80, 65, 55, 50, 45, 40, 35, 30, 25, 20].map((hPercent, index) => (
            <div 
              key={index}
              className="w-full bg-slate-800 rounded-t-lg animate-shimmer"
              style={{ height: `${hPercent}%` }}
            />
          ))}
        </div>
      </div>

      {/* Skeleton Data Table */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="h-5 w-48 rounded bg-slate-800 animate-shimmer mb-4" />
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex items-center justify-between py-2.5 border-b border-slate-800/50">
            <div className="h-4 w-12 rounded bg-slate-800 animate-shimmer" />
            <div className="h-4 w-32 rounded bg-slate-800 animate-shimmer" />
            <div className="h-4 w-24 rounded bg-slate-800 animate-shimmer" />
            <div className="h-4 w-40 rounded bg-slate-800/60 hidden md:block" />
            <div className="h-4 w-16 rounded bg-slate-800 animate-shimmer" />
          </div>
        ))}
      </div>

    </div>
  );
}

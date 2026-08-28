import React from "react";

export default function AssignmentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="h-4 w-20 bg-slate-800 rounded-lg" />
            <div className="h-8 w-12 bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="h-16 rounded-3xl border border-slate-800 bg-slate-900/60" />

      {/* Table Skeleton */}
      <div className="h-80 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-slate-800/60 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

import React from "react";

export default function SkillSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-900 border border-slate-800 p-5" />
        ))}
      </div>

      {/* Filter Skeleton */}
      <div className="h-24 rounded-2xl bg-slate-900 border border-slate-800 p-4" />

      {/* Skill Cards Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-56 rounded-2xl bg-slate-900 border border-slate-800 p-5" />
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";

// Reusable skeleton pulse block
const SkeletonBlock = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-slate-800 ${className}`} />
);

export default function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <SkeletonBlock className="h-28 w-28 rounded-full shrink-0" />
          <div className="flex-1 space-y-3 text-center sm:text-left w-full">
            <SkeletonBlock className="h-7 w-48 mx-auto sm:mx-0" />
            <SkeletonBlock className="h-4 w-32 mx-auto sm:mx-0" />
            <SkeletonBlock className="h-4 w-56 mx-auto sm:mx-0" />
            <SkeletonBlock className="h-3 w-full max-w-sm mt-4" />
            <SkeletonBlock className="h-3 w-3/4 max-w-xs" />
          </div>
          <SkeletonBlock className="h-10 w-36 rounded-xl shrink-0" />
        </div>
      </div>

      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <SkeletonBlock className="h-4 w-20 mb-3" />
            <SkeletonBlock className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Two-Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <SkeletonBlock className="h-5 w-40" />
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="flex gap-3">
                <SkeletonBlock className="h-4 w-28 shrink-0" />
                <SkeletonBlock className="h-4 flex-1" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Wide Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3">
        <SkeletonBlock className="h-5 w-24" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <SkeletonBlock className="h-4 w-4/6" />
      </div>

      {/* Skills & Career Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <SkeletonBlock className="h-5 w-32" />
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4].map((j) => (
                <SkeletonBlock key={j} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

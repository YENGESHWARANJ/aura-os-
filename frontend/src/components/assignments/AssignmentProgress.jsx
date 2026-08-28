import React from "react";
import { TrendingUp, CheckCircle, Clock, Target } from "lucide-react";

export default function AssignmentProgress({ stats }) {
  const submissionRate = stats?.submissionRate ?? 0;
  const onTimeRate = stats?.onTimeRate ?? 0;
  const avgScore = stats?.avgScore ?? 0;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-4">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-emerald-400" /> Assignment Progress
      </h3>

      <div className="space-y-4">
        {/* Submission Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-sky-400" /> Submission Rate
            </span>
            <span className="text-sky-400">{submissionRate}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-500"
              style={{ width: `${submissionRate}%` }}
            />
          </div>
        </div>

        {/* On-Time Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-400" /> On-Time Submission Rate
            </span>
            <span className="text-emerald-400">{onTimeRate}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${onTimeRate}%` }}
            />
          </div>
        </div>

        {/* Average Score */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-purple-400" /> Average Score
            </span>
            <span className="text-purple-400">{avgScore}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${avgScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

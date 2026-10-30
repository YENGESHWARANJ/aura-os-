import React from "react";
import { TrendingUp, TrendingDown, Minus, Briefcase } from "lucide-react";

export default function IndustrySkillComparison({ benchmarks = [] }) {
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Moderate":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === "Surging") {
      return (
        <span className="flex items-center gap-1 text-emerald-400 font-bold">
          <TrendingUp className="h-3.5 w-3.5" />
          Surging
        </span>
      );
    }
    if (trend === "Declining") {
      return (
        <span className="flex items-center gap-1 text-rose-400 font-bold">
          <TrendingDown className="h-3.5 w-3.5" />
          Declining
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-slate-400 font-bold">
        <Minus className="h-3.5 w-3.5" />
        Stable
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-5">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--aura-border)]/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Briefcase className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--aura-text)]">
              Industry Hiring Benchmarks vs Curriculum Coverage
            </h3>
          </div>
          <p className="text-xs text-[var(--aura-text-muted)] mt-1">
            Real-time divergence between employer competency expectations and current syllabus
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {benchmarks.map((b, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)]/40 p-3.5 text-xs transition-colors hover:border-indigo-500/40"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-[var(--aura-text)]">
                    {b.skillName}
                  </h4>
                  <span className="text-[10px] text-[var(--aura-text-muted)] border border-[var(--aura-border)] px-2 py-0.5 rounded-md">
                    {b.domain}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-[11px]">{getTrendIcon(b.marketDemandTrend)}</div>
                <span
                  className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${getSeverityBadge(
                    b.gapSeverity
                  )}`}
                >
                  {b.gapSeverity} Gap
                </span>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[var(--aura-border)]/40 text-[11px]">
              <div>
                <div className="flex justify-between text-[var(--aura-text-muted)] mb-1">
                  <span>Curriculum Coverage</span>
                  <span className="font-bold text-[var(--aura-text)]">
                    {b.curriculumCoveragePercent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--aura-surface)] overflow-hidden border border-[var(--aura-border)]">
                  <div
                    className="h-full rounded-full bg-cyan-500"
                    style={{ width: `${b.curriculumCoveragePercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[var(--aura-text-muted)] mb-1">
                  <span>Student Cohort Mastery</span>
                  <span className="font-bold text-indigo-400">
                    {b.studentMasteryPercent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--aura-surface)] overflow-hidden border border-[var(--aura-border)]">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${b.studentMasteryPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

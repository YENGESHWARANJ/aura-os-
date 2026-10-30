import React from "react";
import { ArrowRight, TrendingUp, ShieldAlert, Award, AlertTriangle } from "lucide-react";

export default function BeforeAfterComparison({ baseline, projected }) {
  if (!baseline || !projected) return null;

  const getRiskBadge = (level) => {
    switch (level) {
      case "Low":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Moderate":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "High":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "Critical":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  const scoreDelta = projected.netScoreImprovement || 0;
  const riskDelta = projected.netRiskReduction || 0;

  return (
    <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-5">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--aura-border)]/60 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-[var(--aura-text)]">
            Counterfactual Impact Projection
          </h3>
          <p className="text-xs text-[var(--aura-text-muted)]">
            Before-and-after contrast under selected simulated interventions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--aura-text-muted)]">Delta:</span>
          <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-400">
            +{scoreDelta} pts Score
          </span>
          <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-xs font-bold text-indigo-400">
            -{riskDelta} pts Risk
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BEFORE CARD */}
        <div className="rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)]/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--aura-text-muted)]">
              Current Baseline
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getRiskBadge(baseline.riskLevel)}`}>
              {baseline.riskLevel} Risk
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-[var(--aura-text-muted)] block">
                Weighted Score (S)
              </span>
              <span className="text-2xl font-extrabold text-[var(--aura-text)]">
                {baseline.weightedScore}
              </span>
              <span className="text-[10px] text-[var(--aura-text-muted)] block">out of 100</span>
            </div>

            <div>
              <span className="text-[11px] text-[var(--aura-text-muted)] block">
                Risk Index (RI)
              </span>
              <span className="text-2xl font-extrabold text-rose-400">
                {baseline.riskIndex}
              </span>
              <span className="text-[10px] text-[var(--aura-text-muted)] block">penalty scaled</span>
            </div>

            <div className="pt-2 border-t border-[var(--aura-border)]/40">
              <span className="text-[11px] text-[var(--aura-text-muted)] block">Attendance</span>
              <span className="text-sm font-bold text-[var(--aura-text)]">
                {baseline.attendance}%
              </span>
            </div>

            <div className="pt-2 border-t border-[var(--aura-border)]/40">
              <span className="text-[11px] text-[var(--aura-text-muted)] block">Assignments</span>
              <span className="text-sm font-bold text-[var(--aura-text)]">
                {baseline.assignmentScore}%
              </span>
            </div>
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="rounded-xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/30 via-[var(--aura-surface-2)] to-purple-950/20 p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Simulated Future
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getRiskBadge(projected.riskLevel)}`}>
              {projected.riskLevel} Risk
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-[var(--aura-text-muted)] block">
                Projected Score (S)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-emerald-400">
                  {projected.weightedScore}
                </span>
                {scoreDelta > 0 && (
                  <span className="text-xs font-bold text-emerald-400">
                    (+{scoreDelta})
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[var(--aura-text-muted)] block">expected outcome</span>
            </div>

            <div>
              <span className="text-[11px] text-[var(--aura-text-muted)] block">
                Projected Risk (RI)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-indigo-300">
                  {projected.riskIndex}
                </span>
                {riskDelta > 0 && (
                  <span className="text-xs font-bold text-indigo-400">
                    (-{riskDelta})
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[var(--aura-text-muted)] block">risk attenuated</span>
            </div>

            <div className="pt-2 border-t border-[var(--aura-border)]/40">
              <span className="text-[11px] text-[var(--aura-text-muted)] block">Attendance</span>
              <span className="text-sm font-bold text-indigo-300">
                {projected.attendance}%
              </span>
            </div>

            <div className="pt-2 border-t border-[var(--aura-border)]/40">
              <span className="text-[11px] text-[var(--aura-text-muted)] block">Assignments</span>
              <span className="text-sm font-bold text-indigo-300">
                {projected.assignmentScore}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

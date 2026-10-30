import React from "react";
import { CheckCircle2, Circle, TrendingUp, ShieldAlert, Sparkles, Zap } from "lucide-react";

export default function InterventionCard({
  scenario,
  isApplied,
  onToggle,
  isHighestImpact = false,
}) {
  const effortBadge = {
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    high: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  }[scenario.effortLevel || "medium"];

  return (
    <div
      onClick={onToggle}
      className={`relative rounded-2xl border p-5 transition-all duration-200 cursor-pointer select-none ${
        isApplied
          ? "border-indigo-500 bg-gradient-to-br from-indigo-950/40 via-[var(--aura-surface)] to-purple-950/20 shadow-lg shadow-indigo-500/10"
          : "border-[var(--aura-border)] bg-[var(--aura-surface)] hover:border-slate-600/60"
      }`}
    >
      {isHighestImpact && (
        <div className="absolute -top-3 right-4 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-0.5 text-[11px] font-extrabold text-white shadow-md">
          <Zap className="h-3 w-3" />
          <span>HIGHEST IMPACT</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="mt-0.5 shrink-0 focus:outline-none"
            aria-label="Toggle scenario"
          >
            {isApplied ? (
              <CheckCircle2 className="h-5 w-5 text-indigo-400 fill-indigo-500/20" />
            ) : (
              <Circle className="h-5 w-5 text-[var(--aura-text-muted)]" />
            )}
          </button>

          <div>
            <h4 className="text-sm font-bold text-[var(--aura-text)] flex items-center gap-2">
              {scenario.title}
            </h4>
            <p className="mt-1 text-xs text-[var(--aura-text-secondary)] leading-relaxed">
              {scenario.description}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${effortBadge}`}
        >
          {scenario.effortLevel} Effort
        </span>
      </div>

      {/* Metrics Row */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-[var(--aura-border)]/60 text-xs">
        <div className="rounded-xl bg-[var(--aura-surface-2)]/60 border border-[var(--aura-border)]/40 p-2.5">
          <span className="text-[10px] font-semibold text-[var(--aura-text-muted)] uppercase block">
            Academic Score S
          </span>
          <span className="text-sm font-extrabold text-emerald-400 flex items-center gap-1 mt-0.5">
            <TrendingUp className="h-3.5 w-3.5" />
            +{scenario.expectedDeltaScore || 0} pts
          </span>
        </div>

        <div className="rounded-xl bg-[var(--aura-surface-2)]/60 border border-[var(--aura-border)]/40 p-2.5">
          <span className="text-[10px] font-semibold text-[var(--aura-text-muted)] uppercase block">
            Risk Index RI
          </span>
          <span className="text-sm font-extrabold text-indigo-400 flex items-center gap-1 mt-0.5">
            <ShieldAlert className="h-3.5 w-3.5" />
            -{scenario.expectedDeltaRisk || 0} pts
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl bg-[var(--aura-surface-2)]/60 border border-[var(--aura-border)]/40 p-2.5">
          <span className="text-[10px] font-semibold text-[var(--aura-text-muted)] uppercase block">
            Confidence
          </span>
          <span className="text-sm font-extrabold text-cyan-400 flex items-center gap-1 mt-0.5">
            <Sparkles className="h-3.5 w-3.5" />
            {scenario.confidenceScore}%
          </span>
        </div>
      </div>

      {/* Recommendation reasoning quote */}
      {scenario.recommendationReason && (
        <div className="mt-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 px-3 py-2 text-[11px] text-[var(--aura-text-secondary)] italic">
          "{scenario.recommendationReason}"
        </div>
      )}
    </div>
  );
}

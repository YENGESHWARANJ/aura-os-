import React from "react";
import { Sparkles, BrainCircuit, AlertCircle, CheckCircle2, Zap } from "lucide-react";

export default function RecommendationExplanation({
  explanation,
  highestImpact,
  confidenceScore = 91.5,
  problemAreas = [],
}) {
  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-[var(--aura-surface)] to-[var(--aura-surface)] p-5">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--aura-border)]/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[var(--aura-text)]">
              AI Intervention Rationale & Optimization
            </h3>
            <p className="text-xs text-[var(--aura-text-muted)]">
              Algorithmic synthesis based on AURA OS Multi-Factor Decision Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-xs font-bold text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{confidenceScore}% Confidence</span>
        </div>
      </div>

      {/* Primary Explanation Box */}
      <div className="mt-4 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)]/60 p-4">
        <div className="flex items-start gap-3">
          <div className="h-6 w-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs text-[var(--aura-text)] leading-relaxed">
            {explanation ||
              "Simulating these combined interventions remediates threshold penalties and amplifies concept retention, delivering maximum risk attenuation."}
          </p>
        </div>
      </div>

      {/* Highest Impact Recommendation Banner */}
      {highestImpact && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Zap className="h-4 w-4 shrink-0" />
            <span>Highest Yield Single Intervention:</span>
            <span className="text-[var(--aura-text)] font-semibold">{highestImpact}</span>
          </div>
          <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
            Priority 1
          </span>
        </div>
      )}

      {/* Problem Areas List */}
      {problemAreas.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--aura-text-muted)] mb-2">
            Identified Problem Areas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {problemAreas.map((pa, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)]/40 p-3 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[var(--aura-text)] flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                    {pa.domain}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                      pa.severity === "Critical"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {pa.severity}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-[var(--aura-text-secondary)]">
                  {pa.issue}
                </p>
                <p className="mt-1 text-[10px] text-[var(--aura-text-muted)] italic">
                  Impact: {pa.impactFactor}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

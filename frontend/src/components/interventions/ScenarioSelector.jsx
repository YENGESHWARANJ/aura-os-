import React from "react";
import { Sliders, RotateCcw, Zap, Sparkles } from "lucide-react";

export default function ScenarioSelector({
  scenarios = [],
  activeScenarioIds = [],
  onToggleScenario,
  onSelectAll,
  onReset,
}) {
  const activeCount = activeScenarioIds.length;

  return (
    <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sliders className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--aura-text)]">
              Counterfactual Scenario Controls
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--aura-text-muted)]">
            Select what-if actions to simulate future academic outcomes and risk reduction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="inline-flex items-center gap-1.5 h-9 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 text-xs font-bold text-indigo-400 hover:bg-indigo-600 hover:text-white transition"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Optimal Bundle</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={activeCount === 0}
            className={`inline-flex items-center gap-1.5 h-9 rounded-xl border border-[var(--aura-border)] px-3 text-xs font-semibold transition ${
              activeCount === 0
                ? "opacity-50 cursor-not-allowed text-[var(--aura-text-muted)] bg-[var(--aura-surface-2)]"
                : "text-[var(--aura-text-secondary)] hover:bg-[var(--aura-surface-2)] hover:text-[var(--aura-text)]"
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Scenario chips quick toggles */}
      <div className="mt-4 flex flex-wrap gap-2">
        {scenarios.map((sc) => {
          const isActive = activeScenarioIds.includes(sc.id);
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onToggleScenario(sc.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold border transition ${
                isActive
                  ? "border-indigo-500 bg-indigo-500/15 text-indigo-300 font-bold"
                  : "border-[var(--aura-border)] bg-[var(--aura-surface-2)] text-[var(--aura-text-secondary)] hover:text-[var(--aura-text)]"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isActive ? "bg-indigo-400 animate-pulse" : "bg-slate-500"
                }`}
              />
              {sc.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

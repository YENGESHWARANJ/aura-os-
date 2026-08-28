import React from "react";
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";

export function SkillStrengths({ skills = [] }) {
  // Sort by proficiency descending
  const strengths = [...skills]
    .sort((a, b) => b.proficiencyPercentage - a.proficiencyPercentage)
    .slice(0, 4);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl flex-1 min-w-0">
      <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 mb-1">
        <Sparkles className="h-5 w-5 text-emerald-400" /> Top Strengths
      </h3>
      <p className="text-xs text-slate-400 mb-4">Highest verified competency areas in your profile</p>

      <div className="space-y-3">
        {strengths.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
            <div>
              <span className="font-bold text-white text-sm block">{item.name}</span>
              <span className="text-[11px] text-slate-400">{item.category}</span>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-bold text-sm block">{item.proficiencyPercentage}%</span>
              <span className="text-[10px] text-slate-500">{item.proficiencyLevel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillImprovement({ skills = [], onStartLearning }) {
  // Filter skills needing improvement or lowest proficiency
  const needsImp = [...skills]
    .sort((a, b) => a.proficiencyPercentage - b.proficiencyPercentage)
    .slice(0, 4);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl flex-1 min-w-0">
      <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 mb-1">
        <AlertTriangle className="h-5 w-5 text-amber-400" /> Skills To Improve
      </h3>
      <p className="text-xs text-slate-400 mb-4">Competencies requiring attention to meet target goals</p>

      <div className="space-y-3">
        {needsImp.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
            <div>
              <span className="font-bold text-white text-sm block">{item.name}</span>
              <span className="text-[11px] text-slate-400">Current: {item.proficiencyPercentage}% | Target: {item.targetProficiency || 80}%</span>
            </div>
            <button
              onClick={() => onStartLearning && onStartLearning(item)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold transition"
            >
              Start Learning <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { Layers, Award, Zap } from "lucide-react";

export default function SkillMatrix({ matrix = [] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-sky-400" /> Skill Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Category-wise competency analysis & average proficiency breakdown
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {matrix.map((cat, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-4 transition-all duration-300 hover:border-slate-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">{cat.category}</span>
              <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                {cat.avgProficiency}% Avg
              </span>
            </div>

            {/* Category Progress Bar */}
            <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800 mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${cat.avgProficiency}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Skills Count</span>
                <span className="font-semibold text-slate-200">{cat.count} active</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Strongest</span>
                <span className="font-semibold text-emerald-400 truncate block">{cat.strongestSkill}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

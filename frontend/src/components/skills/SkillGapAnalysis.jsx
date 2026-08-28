import React from "react";
import { GitCompare, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SkillGapAnalysis({ gapData }) {
  const gaps = gapData?.gaps || [];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-sky-400" /> Skill Gap Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparison of your current proficiency vs. benchmarks for <strong>{gapData?.careerRole || "Full Stack Developer"}</strong>
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {gaps.map((item, idx) => {
          const isMet = item.current >= item.target;
          return (
            <div key={idx} className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{item.skill}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">Current: <strong className="text-white">{item.current}%</strong></span>
                  <span className="text-slate-400">Target: <strong className="text-sky-400">{item.target}%</strong></span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                    isMet
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : item.gap > 15
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  }`}>
                    {isMet ? "Requirement Met" : `Gap: ${item.gap}%`}
                  </span>
                </div>
              </div>

              {/* Stacked Progress Bar */}
              <div className="relative h-2.5 w-full rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
                {/* Target Marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-sky-400 z-10"
                  style={{ left: `${item.target}%` }}
                  title={`Target: ${item.target}%`}
                />
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isMet ? "bg-emerald-500" : "bg-gradient-to-r from-sky-500 to-indigo-500"
                  }`}
                  style={{ width: `${Math.min(100, item.current)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

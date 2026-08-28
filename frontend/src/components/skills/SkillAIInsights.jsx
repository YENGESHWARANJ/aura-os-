import React from "react";
import { Sparkles, Brain, AlertCircle, ArrowUpRight } from "lucide-react";

export default function SkillAIInsights({ insightsData }) {
  const insights = insightsData?.insights || [
    {
      type: "Strength Detected",
      title: "Strong Foundation",
      message: "JavaScript and frontend development are currently among your strongest technical areas.",
      accent: "indigo"
    },
    {
      type: "Skill Gap Alert",
      title: "Career Gap Identified",
      message: "Node.js and Database skills require improvement to achieve the recommended benchmark for Full Stack Developer.",
      accent: "amber"
    },
    {
      type: "Recommendation",
      title: "Next Learning Step",
      message: "Improve Node.js and MongoDB aggregation pipelines next.",
      accent: "cyan"
    },
    {
      type: "Next Milestone",
      title: "Target Milestone",
      message: "Reach 75%+ overall proficiency in core backend technology stack this semester.",
      accent: "emerald"
    }
  ];

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 p-5 shadow-xl backdrop-blur-xl mb-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-inner">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              AURA AI Skill Insights
              <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">Autonomous intelligence analysis of skill profile & career gaps</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-purple-500/20 bg-slate-950/80 p-4 text-xs flex flex-col justify-between transition hover:border-purple-500/40"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                {item.type}
              </span>
              <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

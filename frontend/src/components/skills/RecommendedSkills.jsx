import React from "react";
import { Lightbulb, Plus, BookOpen } from "lucide-react";

export default function RecommendedSkills({ recommendations = [], onAddRecommended }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-400" /> Recommended Skills & Learning
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tailored competencies recommended for your target career role
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-sm">{item.name}</span>
                <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {item.category}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mb-3 line-clamp-2 leading-relaxed">
                {item.why}
              </p>
              <div className="text-[10px] text-slate-500 mb-3 flex items-center gap-3">
                <span>Diff: <strong className="text-slate-300">{item.difficulty}</strong></span>
                <span>Est: <strong className="text-slate-300">{item.duration}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => onAddRecommended(item)}
                className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-[11px] transition shadow"
              >
                <Plus className="h-3 w-3" /> Add Skill
              </button>
              <button
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition"
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

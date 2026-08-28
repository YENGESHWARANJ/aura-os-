import React from "react";
import { Map, CheckCircle2, Circle, Clock } from "lucide-react";

export default function SkillRoadmap({ roadmapData }) {
  const steps = roadmapData?.roadmap || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
      case "In Progress":
        return { icon: Clock, color: "text-sky-400 bg-sky-500/10 border-sky-500/30" };
      case "Next":
        return { icon: Circle, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
      default:
        return { icon: Circle, color: "text-slate-500 bg-slate-950 border-slate-800" };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Map className="h-5 w-5 text-indigo-400" /> Personal Learning Roadmap
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured skill sequence for <strong>{roadmapData?.careerGoal || "Full Stack Developer"}</strong>
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((item, idx) => {
          const statusStyle = getStatusBadge(item.status);
          const Icon = statusStyle.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5 flex flex-col justify-between text-xs transition hover:border-slate-700"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-slate-500 text-[11px]">STEP {item.step}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${statusStyle.color}`}>
                    <Icon className="h-3 w-3" /> {item.status}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{item.skill}</h4>
                <p className="text-[11px] text-slate-400">Current: {item.currentLevel} • Target: {item.target}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

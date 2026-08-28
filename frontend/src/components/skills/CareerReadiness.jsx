import React from "react";
import { Target, Award, Code2, Wrench, FolderCheck, MessageSquare } from "lucide-react";

export default function CareerReadiness({ readinessData }) {
  const score = readinessData?.readinessScore ?? 72;
  const breakdown = readinessData?.breakdown || {
    technicalSkills: 78,
    tools: 69,
    projects: 82,
    problemSolving: 65,
    communication: 74
  };

  const metrics = [
    { label: "Technical Skills", value: breakdown.technicalSkills, icon: Code2 },
    { label: "Tools & Git", value: breakdown.tools, icon: Wrench },
    { label: "Projects & Submissions", value: breakdown.projects, icon: FolderCheck },
    { label: "Problem Solving", value: breakdown.problemSolving, icon: Award },
    { label: "Communication & Soft Skills", value: breakdown.communication, icon: MessageSquare }
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl mb-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Score Gauge Circle */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="relative h-28 w-28 flex items-center justify-center rounded-full bg-slate-950 border-4 border-indigo-500/30 p-2 shadow-inner">
            <div className="text-center">
              <span className="text-3xl font-black text-white">{score}%</span>
              <span className="block text-[9px] uppercase tracking-widest text-indigo-400 font-bold">Readiness</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">
              Target Role Index
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              {readinessData?.careerRole || "Full Stack Developer"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Derived from configured competency requirements, verified project submissions, and skill evidence.
            </p>
          </div>
        </div>

        {/* Breakdown Horizontal Progress */}
        <div className="flex-1 w-full grid gap-3 sm:grid-cols-2">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Icon className="h-3.5 w-3.5 text-sky-400" /> {item.label}
                  </span>
                  <span className="font-bold text-white">{item.value}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-all duration-500"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

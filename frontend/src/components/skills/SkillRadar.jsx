import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Compass } from "lucide-react";

export default function SkillRadar({ matrix = [] }) {
  // Transform matrix into recharts radar format
  const radarData = matrix.map((item) => ({
    subject: item.category,
    A: item.avgProficiency,
    fullMark: 100
  }));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="h-5 w-5 text-indigo-400" /> Skill Distribution
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-dimensional radar visualization of technical & domain competency
          </p>
        </div>
      </div>

      <div className="h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: "#64748b", fontSize: 10 }} />
            <Radar name="Proficiency" dataKey="A" stroke="#38bdf8" fill="#0284c7" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

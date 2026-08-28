import React from "react";
import { Activity, Clock } from "lucide-react";

export default function SkillActivity({ activity = [] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-sky-400" /> Recent Activity
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Audit log of skill modifications, evidence links and goal updates</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {activity.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-sky-400" />
              <div>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="text-[11px] text-slate-400">{item.description}</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 shrink-0 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {item.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

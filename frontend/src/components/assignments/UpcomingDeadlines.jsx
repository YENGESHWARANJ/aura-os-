import React from "react";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import DeadlineBadge from "./DeadlineBadge";

export default function UpcomingDeadlines({ upcomingAssignments, onSelectAssignment }) {
  if (!upcomingAssignments || upcomingAssignments.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Calendar className="h-4 w-4 text-sky-400" /> Upcoming Deadlines
        </h3>
        <p className="text-xs text-slate-500 italic">No pending upcoming deadlines.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Calendar className="h-4 w-4 text-sky-400" /> Upcoming Deadlines
        </h3>
        <span className="text-xs text-slate-400 font-semibold">{upcomingAssignments.length} pending</span>
      </div>

      <div className="space-y-2.5">
        {upcomingAssignments.map((asm) => (
          <div
            key={asm._id}
            onClick={() => onSelectAssignment(asm)}
            className="flex items-center justify-between p-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/50 transition cursor-pointer group"
          >
            <div className="space-y-0.5 max-w-[70%]">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                {asm.subjectCode}
              </span>
              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-sky-400 transition truncate">
                {asm.title}
              </h4>
            </div>

            <div className="text-right">
              <DeadlineBadge deadline={asm.deadline} computedStatus="PENDING" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

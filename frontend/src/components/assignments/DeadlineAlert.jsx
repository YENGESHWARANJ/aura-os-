import React from "react";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react";

export default function DeadlineAlert({ urgentAssignment, onView }) {
  if (!urgentAssignment) return null;

  const deadline = new Date(urgentAssignment.deadline);
  const formattedTime = deadline.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Upcoming Deadline
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
              <Clock className="h-3 w-3" />
              Due Soon
            </span>
          </div>
          <h4 className="mt-1 text-sm sm:text-base font-semibold text-white">
            {urgentAssignment.title}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {urgentAssignment.subject} • Due {formattedTime}
          </p>
        </div>
      </div>

      <button
        onClick={() => onView(urgentAssignment)}
        className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 transition shrink-0 self-end sm:self-auto"
      >
        View Assignment
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

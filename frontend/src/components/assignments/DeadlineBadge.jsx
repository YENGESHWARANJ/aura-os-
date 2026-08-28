import React from "react";
import { Clock } from "lucide-react";

export default function DeadlineBadge({ deadline, computedStatus }) {
  if (computedStatus === "SUBMITTED" || computedStatus === "GRADED") {
    return (
      <span className="text-xs text-slate-400 font-medium">
        {computedStatus === "GRADED" ? "Graded" : "Submitted"}
      </span>
    );
  }

  if (!deadline) return null;

  const now = new Date();
  const target = new Date(deadline);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-400">
        <Clock className="h-3.5 w-3.5" />
        Overdue by {overdueDays} {overdueDays === 1 ? "day" : "days"}
      </span>
    );
  }

  if (diffDays === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
        <Clock className="h-3.5 w-3.5" />
        Due Today
      </span>
    );
  }

  if (diffDays === 1) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-300">
        <Clock className="h-3.5 w-3.5" />
        Due Tomorrow
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-300">
      <Clock className="h-3.5 w-3.5 text-slate-400" />
      {diffDays} days remaining
    </span>
  );
}

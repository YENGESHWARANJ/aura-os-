import React from "react";
import { Clock, CheckCircle2, Award, AlertTriangle } from "lucide-react";

export default function AssignmentStatusBadge({ status }) {
  const normalized = (status || "").toUpperCase();

  switch (normalized) {
    case "SUBMITTED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Submitted
        </span>
      );
    case "GRADED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          <Award className="h-3.5 w-3.5" />
          Graded
        </span>
      );
    case "OVERDUE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
          <AlertTriangle className="h-3.5 w-3.5" />
          Overdue
        </span>
      );
    case "PENDING":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
          <Clock className="h-3.5 w-3.5" />
          Pending
        </span>
      );
  }
}

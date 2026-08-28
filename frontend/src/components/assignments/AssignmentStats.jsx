import React from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Award,
  AlertTriangle,
  Calendar,
} from "lucide-react";

export default function AssignmentStats({ stats }) {
  const cards = [
    {
      label: "Total Assignments",
      value: stats?.total ?? 0,
      subtext: "Current Semester",
      icon: ClipboardList,
      color: "text-sky-600 bg-sky-50 border-sky-100",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      subtext: "Action required",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label: "Submitted",
      value: stats?.submitted ?? 0,
      subtext: "Awaiting evaluation",
      icon: CheckCircle2,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Graded",
      value: stats?.graded ?? 0,
      subtext: "Feedback available",
      icon: Award,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Overdue",
      value: stats?.overdue ?? 0,
      subtext: "Past deadline",
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      label: "Due This Week",
      value: stats?.dueThisWeek ?? 0,
      subtext: "Next 7 days",
      icon: Calendar,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-[24px] border border-slate-100 bg-white p-4.5 shadow-[0_4px_20px_rgba(30,40,90,0.03)] hover:shadow-[0_8px_25px_rgba(30,40,90,0.06)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-2.5 rounded-2xl border ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

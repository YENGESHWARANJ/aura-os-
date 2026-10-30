import React from "react";
import { Award, CheckCircle2, TrendingUp, Target } from "lucide-react";

export default function SkillOverview({ overview }) {
  const cards = [
    {
      title: "TOTAL SKILLS",
      value: overview?.totalSkills ?? 0,
      badge: "+3 this semester",
      icon: Award,
      cardClasses:
        "bg-gradient-to-br from-sky-50 to-blue-50/70 border-sky-200 text-sky-700 shadow-sky-500/5 dark:from-sky-500/15 dark:to-blue-600/15 dark:bg-slate-900/90 dark:border-sky-500/30 dark:text-sky-400 dark:shadow-slate-950/20",
      valueColor: "text-slate-900 dark:text-white",
      badgeColor: "text-sky-700 dark:text-sky-300",
      iconBoxClasses:
        "bg-sky-500/15 text-sky-600 border border-sky-300/60 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30",
    },
    {
      title: "VERIFIED SKILLS",
      value: overview?.verifiedSkills ?? 0,
      badge: "Faculty & System verified",
      icon: CheckCircle2,
      cardClasses:
        "bg-gradient-to-br from-emerald-50 to-teal-50/70 border-emerald-200 text-emerald-700 shadow-emerald-500/5 dark:from-emerald-500/15 dark:to-teal-600/15 dark:bg-slate-900/90 dark:border-emerald-500/30 dark:text-emerald-400 dark:shadow-slate-950/20",
      valueColor: "text-slate-900 dark:text-white",
      badgeColor: "text-emerald-700 dark:text-emerald-300",
      iconBoxClasses:
        "bg-emerald-500/15 text-emerald-600 border border-emerald-300/60 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
    },
    {
      title: "SKILLS IN PROGRESS",
      value: overview?.inProgressSkills ?? 0,
      badge: "Active learning path",
      icon: TrendingUp,
      cardClasses:
        "bg-gradient-to-br from-amber-50 to-orange-50/70 border-amber-200 text-amber-800 shadow-amber-500/5 dark:from-amber-500/15 dark:to-orange-600/15 dark:bg-slate-900/90 dark:border-amber-500/30 dark:text-amber-400 dark:shadow-slate-950/20",
      valueColor: "text-slate-900 dark:text-white",
      badgeColor: "text-amber-800 dark:text-amber-300",
      iconBoxClasses:
        "bg-amber-500/15 text-amber-600 border border-amber-300/60 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
    },
    {
      title: "CAREER READINESS",
      value: `${overview?.careerReadiness ?? 0}%`,
      badge: "Target role aligned",
      icon: Target,
      cardClasses:
        "bg-gradient-to-br from-indigo-50 to-purple-50/70 border-indigo-200 text-indigo-700 shadow-indigo-500/5 dark:from-indigo-500/15 dark:to-purple-600/15 dark:bg-slate-900/90 dark:border-indigo-500/30 dark:text-indigo-400 dark:shadow-slate-950/20",
      valueColor: "text-slate-900 dark:text-white",
      badgeColor: "text-indigo-700 dark:text-indigo-300",
      iconBoxClasses:
        "bg-indigo-500/15 text-indigo-600 border border-indigo-300/60 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`rounded-2xl border p-5 shadow-md backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${card.cardClasses}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.18em] opacity-90">
                {card.title}
              </span>
              <div className={`rounded-xl p-2.5 shadow-xs ${card.iconBoxClasses}`}>
                <IconComponent className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-3xl font-black tracking-tight ${card.valueColor}`}>
                {card.value}
              </span>
              <p className={`mt-1 text-xs font-semibold ${card.badgeColor}`}>
                {card.badge}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import React from "react";
import { Award, CheckCircle2, TrendingUp, Target } from "lucide-react";

export default function SkillOverview({ overview }) {
  const cards = [
    {
      title: "TOTAL SKILLS",
      value: overview?.totalSkills ?? 0,
      badge: "+3 this semester",
      icon: Award,
      color: "from-sky-500/20 to-blue-600/20 text-sky-400 border-sky-500/30"
    },
    {
      title: "VERIFIED SKILLS",
      value: overview?.verifiedSkills ?? 0,
      badge: "Faculty & System verified",
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/30"
    },
    {
      title: "SKILLS IN PROGRESS",
      value: overview?.inProgressSkills ?? 0,
      badge: "Active learning path",
      icon: TrendingUp,
      color: "from-amber-500/20 to-orange-600/20 text-amber-400 border-amber-500/30"
    },
    {
      title: "CAREER READINESS",
      value: `${overview?.careerReadiness ?? 0}%`,
      badge: "Target role aligned",
      icon: Target,
      color: "from-indigo-500/20 to-purple-600/20 text-indigo-400 border-indigo-500/30"
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`rounded-2xl border bg-slate-900/90 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-xl bg-gradient-to-br ${card.color} transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {card.title}
              </span>
              <div className="rounded-xl bg-slate-950/50 p-2.5 shadow-inner">
                <IconComponent className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-white tracking-tight">{card.value}</span>
              <p className="mt-1 text-xs text-slate-400 font-medium">{card.badge}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

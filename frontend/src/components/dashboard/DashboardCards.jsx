import { Calendar, GraduationCap, FileText, FolderGit2, TrendingUp } from "lucide-react";

export default function DashboardCards() {
  const cards = [
    {
      title: "ATTENDANCE",
      value: "86.5%",
      detail: "Safe > 75% threshold",
      icon: Calendar,
      iconColor: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-500/30",
      trend: "+2.1%",
      trendPositive: true,
    },
    {
      title: "CURRENT CGPA",
      value: "8.84",
      detail: "Top 5% in AI Section",
      icon: GraduationCap,
      iconColor: "text-indigo-400",
      bg: "bg-indigo-950/40 border-indigo-500/30",
      trend: "+0.14",
      trendPositive: true,
    },
    {
      title: "PENDING TASKS",
      value: "3",
      detail: "1 Due Tomorrow",
      icon: FileText,
      iconColor: "text-amber-400",
      bg: "bg-amber-950/40 border-amber-500/30",
      trend: "Urgent",
      trendPositive: false,
    },
    {
      title: "ACTIVE CAPSTONE",
      value: "Phase 2",
      detail: "Review in 4 days",
      icon: FolderGit2,
      iconColor: "text-cyan-400",
      bg: "bg-cyan-950/40 border-cyan-500/30",
      trend: "Milestone",
      trendPositive: true,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="flex items-center gap-3.5 rounded-2xl border border-slate-800 bg-[#0f172a] p-4.5 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 min-w-0"
          >
            {/* Left Icon Container */}
            <div
              className={`rounded-xl border p-3 shrink-0 flex items-center justify-center ${card.bg}`}
            >
              <Icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>

            {/* Right Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  {card.title}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                    card.trendPositive
                      ? "text-emerald-400 bg-emerald-950/50 border border-emerald-500/20"
                      : "text-amber-400 bg-amber-950/50 border border-amber-500/20"
                  }`}
                >
                  {card.trend}
                </span>
              </div>
              <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-white">
                {card.value}
              </p>
              <p className="text-[11px] font-medium text-slate-400 truncate">
                {card.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

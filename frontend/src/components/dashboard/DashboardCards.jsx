import { useEffect, useState } from "react";
import { Calendar, GraduationCap, FileText, FolderGit2, Wifi, WifiOff } from "lucide-react";
import api from "../../services/api";

export default function DashboardCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard/overview");
        if (isMounted && data.success) {
          setStats(data.data.stats);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Dashboard stats error:", err);
          setError("Unable to load real-time data");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    // Refresh every 60 seconds for near-real-time feel
    const interval = setInterval(fetchStats, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const cards = [
    {
      title: "ATTENDANCE",
      value: loading ? "–" : `${stats?.attendance || 0}%`,
      detail: stats?.attendance >= 75 ? "Safe › 75% threshold" : "⚠ Below threshold",
      icon: Calendar,
      iconColor: stats?.attendance >= 75 ? "text-emerald-400" : "text-amber-400",
      bg: stats?.attendance >= 75 ? "bg-emerald-950/40 border-emerald-500/30" : "bg-amber-950/40 border-amber-500/30",
      trend: stats?.attendance >= 85 ? "On Track" : stats?.attendance >= 75 ? "Borderline" : "At Risk",
      trendPositive: stats?.attendance >= 75,
    },
    {
      title: "CURRENT CGPA",
      value: loading ? "–" : (stats?.cgpa > 0 ? stats.cgpa.toFixed(2) : "N/A"),
      detail: stats?.cgpa >= 8.5 ? "Top 10% in your batch" : stats?.cgpa >= 7 ? "Good Standing" : "Needs improvement",
      icon: GraduationCap,
      iconColor: "text-[#c8f000]",
      bg: "bg-[#c8f000]/10 border-[#c8f000]/20",
      trend: stats?.cgpa > 0 ? `${stats.cgpa.toFixed(1)} / 10` : "No data",
      trendPositive: stats?.cgpa >= 7.5,
    },
    {
      title: "PENDING TASKS",
      value: loading ? "–" : `${stats?.pendingAssignments ?? 0}`,
      detail: stats?.pendingAssignments === 0 ? "All tasks cleared!" : `${stats?.pendingAssignments} awaiting submission`,
      icon: FileText,
      iconColor: stats?.pendingAssignments > 2 ? "text-red-400" : "text-amber-400",
      bg: stats?.pendingAssignments > 2 ? "bg-red-950/40 border-red-500/30" : "bg-amber-950/40 border-amber-500/30",
      trend: stats?.pendingAssignments > 0 ? "Action Needed" : "All Clear ✓",
      trendPositive: stats?.pendingAssignments === 0,
    },
    {
      title: "SKILLS EARNED",
      value: loading ? "–" : `${stats?.skillCount ?? 0}`,
      detail: `${stats?.skillCount ?? 0} verified skills in wallet`,
      icon: FolderGit2,
      iconColor: "text-[#c8f000]",
      bg: "bg-[#c8f000]/10 border-[#c8f000]/20",
      trend: stats?.skillCount >= 5 ? "Strong Profile" : "Build More",
      trendPositive: stats?.skillCount >= 5,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
      {error && (
        <div className="col-span-full flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-2 text-xs text-amber-300">
          <WifiOff className="h-3.5 w-3.5 shrink-0" />
          <span>{error} — using cached values</span>
        </div>
      )}

      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="flex items-center gap-3.5 rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c8f000]/30 hover:shadow-[0_8px_24px_rgba(200,240,0,0.08)] min-w-0 relative overflow-hidden"
          >
            {/* Live indicator */}
            {!loading && !error && (
              <span className="absolute top-2.5 right-2.5 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">Live</span>
              </span>
            )}

            {loading && (
              <span className="absolute top-2.5 right-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse block" />
              </span>
            )}

            {/* Left Icon */}
            <div className={`rounded-xl border p-3 shrink-0 flex items-center justify-center ${card.bg}`}>
              <Icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>

            {/* Right Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  {card.title}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    card.trendPositive
                      ? "text-emerald-400 bg-emerald-950/50 border border-emerald-500/20"
                      : "text-amber-400 bg-amber-950/50 border border-amber-500/20"
                  }`}
                >
                  {card.trend}
                </span>
              </div>
              <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-white">
                {loading ? (
                  <span className="h-7 w-16 bg-slate-800 rounded animate-pulse inline-block" />
                ) : (
                  card.value
                )}
              </p>
              <p className="text-[11px] font-medium text-slate-400 truncate">{card.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

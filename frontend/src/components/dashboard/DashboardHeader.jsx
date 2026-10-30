import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Calendar, FileText, Sparkles, TrendingUp, Wifi } from "lucide-react";
import api from "../../services/api";

export default function DashboardHeader() {
  const { user } = useSelector((state) => state.auth);
  const [overview, setOverview] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    let isMounted = true;
    api
      .get("/dashboard/overview")
      .then(({ data }) => {
        if (isMounted && data.success) setOverview(data.data);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const stats = overview?.stats;
  const riskData = overview?.aiRisk;
  const profileCompletion = stats?.profileCompletion ?? 0;

  return (
    <section className="grid gap-5 grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] items-center min-w-0">
      {/* Left Column: Welcome Greeting */}
      <div className="space-y-2 min-w-0">
        <div className="hub-pill">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AUTONOMOUS ACADEMIC MONITORING</span>
          {/* Live badge */}
          <span className="ml-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide">Live</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
          {getGreeting()}, {overview?.user?.name || user?.name || "Student"} 👋
        </h1>

        <p className="max-w-xl text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
          {overview?.user?.registerNumber ? (
            <>
              Roll No:{" "}
              <span className="text-indigo-300 font-bold">
                {overview.user.registerNumber}
              </span>{" "}
              •{" "}
            </>
          ) : null}
          {overview?.user?.degree || "B.Tech"}{" "}
          {overview?.user?.department || "AI & Data Science"} • Semester{" "}
          {overview?.user?.semester || user?.semester || 6}
        </p>
      </div>

      {/* Right Column: Live Academic Progress Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/80 via-slate-900 to-slate-950 p-5 text-white border border-indigo-500/30 shadow-xl min-w-0">
        {/* Live data badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5">
          <Wifi className="h-2.5 w-2.5 text-emerald-400" />
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide">Real-time</span>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                {riskData ? riskData.level : "WEEKLY PROGRESS"}
              </p>
              <p className="mt-0.5 text-3xl font-extrabold text-white tracking-tight">
                {riskData ? `${riskData.score}%` : `${stats?.attendance || 0}%`}
              </p>
            </div>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold shrink-0 ${
                riskData?.level === "LOW RISK"
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : riskData?.level === "MODERATE RISK"
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                  : "bg-red-500/20 border-red-500/40 text-red-400"
              }`}
            >
              {riskData?.level === "LOW RISK"
                ? "On Track"
                : riskData?.level === "MODERATE RISK"
                ? "Review Needed"
                : "At Risk"}
            </span>
          </div>

          <p className="mt-1.5 text-xs text-slate-300 font-medium">
            {riskData
              ? `AI Risk Score based on attendance, marks & tasks`
              : "Attendance, tasks, and performance metrics"}
          </p>

          {/* Progress Bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                riskData?.score >= 80
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                  : riskData?.score >= 60
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                  : "bg-gradient-to-r from-red-500 to-rose-400"
              }`}
              style={{ width: `${riskData?.score || stats?.attendance || 0}%` }}
            />
          </div>

          {/* Profile Completion + CGPA */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs min-w-0 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="rounded-lg bg-indigo-950/60 p-1.5 text-indigo-400 shrink-0 border border-indigo-500/30">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">Profile</p>
                <p className="text-xs font-bold text-slate-200 truncate">
                  {profileCompletion}% Complete
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <div className="rounded-lg bg-indigo-950/60 p-1.5 text-indigo-400 shrink-0 border border-indigo-500/30">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">CGPA</p>
                <p className="text-xs font-bold text-slate-200 truncate">
                  {stats?.cgpa > 0 ? `${stats.cgpa.toFixed(2)} / 10` : "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FlaskConical,
  Monitor,
  FileText,
  Bell,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import api from "../../services/api";

// ── Skeleton loader ────────────────────────────────────────────
function SkeletonLine({ className = "" }) {
  return <div className={`bg-slate-800 rounded animate-pulse ${className}`} />;
}

export default function DashboardStats() {
  const [overview, setOverview] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      try {
        const [overviewRes, notifRes] = await Promise.all([
          api.get("/dashboard/overview").catch(() => null),
          api.get("/notifications?page=1&limit=3&onlyUnread=false").catch(() => null),
        ]);

        if (isMounted) {
          if (overviewRes?.data?.success) setOverview(overviewRes.data.data);
          if (notifRes?.data?.success) setNotifications(notifRes.data.data?.notifications || []);
        }
      } catch (err) {
        console.error("Dashboard stats fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const riskData = overview?.aiRisk;
  const stats = overview?.stats;

  // Build attendance overview from real data (if available, otherwise show skeleton)
  const attendanceOverview = stats
    ? [
        {
          label: "Overall Attendance",
          value: `${stats.attendance || 0}%`,
          numericValue: stats.attendance || 0,
          icon: BookOpen,
          color: "from-[#c8f000] to-[#86a800]",
        },
        {
          label: "Pending Assignments",
          value: `${stats.pendingAssignments ?? 0} tasks`,
          numericValue: stats.pendingAssignments === 0 ? 100 : Math.max(0, 100 - stats.pendingAssignments * 15),
          icon: FileText,
          color: stats.pendingAssignments === 0 ? "from-emerald-500 to-teal-500" : "from-amber-500 to-orange-500",
        },
        {
          label: "Skills in Wallet",
          value: `${stats.skillCount ?? 0} skills`,
          numericValue: Math.min(100, (stats.skillCount / 10) * 100),
          icon: Monitor,
          color: "from-[#c8f000] to-[#86a800]",
        },
      ]
    : null;

  // Build notification items from real API
  const notificationItems = notifications.slice(0, 2).map((n, i) => ({
    id: n._id || i,
    title: n.title || "Notification",
    description: n.message || "",
    time: n.createdAt
      ? new Date(n.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      : "–",
    icon: n.type === "assignment" ? FileText : Bell,
    iconBg: i === 0
      ? "bg-[#c8f000]/10 text-[#86a800] border-[#c8f000]/25"
      : "bg-[#c8f000]/08 text-[#6d8d00] border-[#c8f000]/20",
  }));

  return (
    <section className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)] min-w-0">
      {/* LEFT COLUMN */}
      <div className="space-y-6 min-w-0">

        {/* AI Early Warning Risk Monitor — Real Data */}
        <div className="aura-card border-[#c8f000]/20 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#c8f000]" />
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                AURA AI Early Warning Risk Monitor
              </h2>
            </div>
            {loading ? (
              <SkeletonLine className="h-5 w-28 rounded-full" />
            ) : (
              <span
                className={`rounded-full border px-3 py-0.5 text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                  riskData?.level === "LOW RISK"
                    ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                    : riskData?.level === "MODERATE RISK"
                    ? "bg-amber-950/60 border-amber-500/40 text-amber-400"
                    : "bg-red-950/60 border-red-500/40 text-red-400"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full animate-pulse ${
                    riskData?.level === "LOW RISK"
                      ? "bg-emerald-400"
                      : riskData?.level === "MODERATE RISK"
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                />
                {riskData?.level
                  ? `${riskData.level} (${riskData.score}%)`
                  : "CALCULATING..."}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Continuous inference from weighted parameters:{" "}
            <span className="text-[#c8f000] font-mono">S = w₁M + w₂A + w₃AS + w₄Q</span>
          </p>

          <div className="grid grid-cols-4 gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            {["marks", "attendance", "tasks", "quizzes"].map((key, i) => {
              const labels = ["Marks (M)", "Attendance (A)", "Tasks (AS)", "Quizzes (Q)"];
              const val = loading ? null : riskData?.components?.[key] ?? 0;
              return (
                <div key={key} className={`text-center ${i > 0 ? "border-l border-slate-800" : ""}`}>
                  {loading ? (
                    <SkeletonLine className="h-4 w-10 mx-auto" />
                  ) : (
                    <p className="text-sm font-extrabold text-white">{val}%</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-0.5">{labels[i]}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                riskData?.score >= 80
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                  : riskData?.score >= 60
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                  : "bg-gradient-to-r from-red-500 to-rose-400"
              }`}
              style={{ width: loading ? "0%" : `${riskData?.score || 0}%` }}
            />
          </div>
        </div>

        {/* Academic Overview — Real Data */}
        <div className="aura-card mb-0">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-extrabold text-white tracking-tight">
              Academic Overview
            </h2>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">Live</span>
            </span>
          </div>

          <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-3 min-w-0">
            {loading || !attendanceOverview
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 min-w-0 space-y-2">
                    <SkeletonLine className="h-3 w-2/3" />
                    <SkeletonLine className="h-6 w-1/3" />
                    <SkeletonLine className="h-1.5 w-full rounded-full" />
                  </div>
                ))
              : attendanceOverview.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 min-w-0"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-300 truncate">
                          {item.label}
                        </span>
                        <div className="w-6 h-6 rounded-lg bg-[#c8f000]/10 text-[#86a800] flex items-center justify-center border border-[#c8f000]/20">
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                        </div>
                      </div>

                      <p className="mt-2 text-xl font-extrabold text-white">{item.value}</p>

                      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                          style={{ width: `${item.numericValue}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* Career Readiness */}
        {overview?.careerReadiness && (
          <div className="aura-card mb-0">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-[#c8f000]" />
              <h2 className="text-sm font-extrabold text-white tracking-tight">Career Readiness Score</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Technical Skills", value: overview.careerReadiness.technicalSkills },
                { label: "Academic Performance", value: overview.careerReadiness.academicPerformance },
                { label: "Profile Completion", value: overview.careerReadiness.profileCompletion },
                { label: "Overall Readiness", value: overview.careerReadiness.overall },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className="text-[11px] text-slate-400 font-semibold">{label}</p>
                  <p className="mt-1 text-lg font-extrabold text-white">{value}%</p>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#c8f000] to-[#86a800] transition-all duration-700"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6 min-w-0">
        {/* Quick Links Card */}
        <div className="aura-card border-[#c8f000]/15 bg-[var(--aura-surface-2)]">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Evidence Wallet",     path: "/dashboard/evidence-wallet",              color: "bg-[#c8f000]/10 border-[#c8f000]/25 text-[var(--aura-text)]" },
              { label: "Intervention Sim",    path: "/dashboard/intervention-simulator",       color: "bg-[#c8f000]/08 border-[#c8f000]/20 text-[var(--aura-text)]" },
              { label: "Study Planner",       path: "/dashboard/study-planner",               color: "bg-[var(--aura-success-bg)] border-[var(--aura-success-border)] text-[var(--aura-text)]" },
              { label: "Curriculum Intel",    path: "/dashboard/curriculum-intelligence",     color: "bg-[var(--aura-warning-bg)] border-[var(--aura-warning-border)] text-[var(--aura-text)]" },
            ].map(({ label, path, color }) => (
              <Link
                key={label}
                to={path}
                className={`rounded-xl border ${color} px-3 py-2.5 text-xs font-bold transition hover:brightness-110 hover:scale-[1.02] hover:border-[#c8f000]/40`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Notifications — Real Data */}
        <div className="aura-card mb-0">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-extrabold text-white tracking-tight">Recent Alerts</h2>
            <Link
              to="/dashboard/notifications"
              className="text-xs font-bold text-[#c8f000] hover:text-[#aed600] transition shrink-0"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                  <SkeletonLine className="h-8 w-8 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <SkeletonLine className="h-3 w-3/4" />
                    <SkeletonLine className="h-2.5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notificationItems.length > 0 ? (
            <div className="space-y-2.5">
              {notificationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/60"
                  >
                    <div className={`rounded-xl border p-2 shrink-0 ${item.iconBg}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400 leading-snug line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
              <p className="text-xs font-semibold text-emerald-300">All caught up!</p>
              <p className="text-[11px] text-slate-500 mt-0.5">No new notifications</p>
            </div>
          )}
        </div>

        {/* Profile Completion Prompt */}
        {stats && stats.profileCompletion < 80 && (
          <div className="aura-card mb-0 border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-extrabold text-white tracking-tight">Complete Your Profile</h2>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Your profile is <span className="text-amber-300 font-bold">{stats.profileCompletion}%</span> complete.
              Improve your career readiness score.
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800 mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                style={{ width: `${stats.profileCompletion}%` }}
              />
            </div>
            <Link
              to="/dashboard/profile"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
            >
              <span>Update Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

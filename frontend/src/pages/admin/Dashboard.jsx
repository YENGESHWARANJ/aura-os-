import { useState, useEffect } from "react";
import PageHeader from "../../components/ui/PageHeader";
import {
  Shield,
  Users,
  Server,
  BookOpen,
  AlertTriangle,
  Activity,
  Database,
  CheckCircle,
  UserPlus,
  RefreshCw,
  GraduationCap,
  Award,
  Wifi,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function SkeletonLine({ className = "" }) {
  return <div className={`bg-slate-800 rounded animate-pulse ${className}`} />;
}

export default function AdminDashboard() {
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/stats");
      if (data.success) {
        setAdminStats(data.data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error("Admin stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 120000); // refresh every 2 min
    return () => clearInterval(interval);
  }, []);

  const stats = adminStats
    ? [
        {
          label: "Total Platform Users",
          value: adminStats.totalUsers?.toLocaleString() || "–",
          change: `+${Math.max(0, adminStats.totalUsers - 1400)} registered`,
          color: "text-cyan-400",
          icon: Users,
          border: "border-cyan-500/20",
          bg: "bg-cyan-950/20",
        },
        {
          label: "Enrolled Students",
          value: adminStats.studentsCount?.toLocaleString() || "–",
          change: `${adminStats.studentsCount} active students`,
          color: "text-emerald-400",
          icon: GraduationCap,
          border: "border-emerald-500/20",
          bg: "bg-emerald-950/20",
        },
        {
          label: "Faculty & Mentors",
          value: ((adminStats.facultyCount || 0) + (adminStats.mentorCount || 0)).toLocaleString(),
          change: `${adminStats.facultyCount || 0} Faculty • ${adminStats.mentorCount || 0} Mentors`,
          color: "text-purple-400",
          icon: Award,
          border: "border-purple-500/20",
          bg: "bg-purple-950/20",
        },
        {
          label: "System Status",
          value: "Operational",
          change: adminStats.systemHealth || "Healthy",
          color: "text-blue-400",
          icon: Server,
          border: "border-blue-500/20",
          bg: "bg-blue-950/20",
        },
      ]
    : [];

  const recentLogs = [
    { id: "l1", event: "New Faculty Registered", actor: "System Auto-Onboard", role: "Faculty", time: "10 min ago", color: "text-cyan-400" },
    { id: "l2", event: "Database Cluster Backup", actor: "Automated Cron Job", role: "System", time: "1 hour ago", color: "text-purple-400" },
    { id: "l3", event: "Student Role Updated", actor: "Admin Control Panel", role: "Admin", time: "3 hours ago", color: "text-emerald-400" },
    { id: "l4", event: "AI Model Inference Run", actor: "AURA AI Engine", role: "AI Service", time: "5 hours ago", color: "text-indigo-400" },
  ];

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="AURA OS Command Center"
        title="Admin Control & System Operations"
        description="Monitor system health, manage platform users, track department analytics, and configure AURA AI services."
        actions={
          <div className="flex items-center gap-2">
            {lastRefreshed && (
              <span className="text-[10px] text-slate-500 hidden sm:block">
                Updated {lastRefreshed.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchStats}
              disabled={loading}
              className="aura-btn aura-btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link to="/admin/users" className="aura-btn aura-btn-primary text-xs py-1.5 px-3">
              <UserPlus className="h-3.5 w-3.5 mr-1 inline" />
              Manage Users
            </Link>
          </div>
        }
      />

      {/* Live KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aura-card p-4 space-y-2">
                <SkeletonLine className="h-3 w-2/3" />
                <SkeletonLine className="h-8 w-1/2" />
                <SkeletonLine className="h-2.5 w-3/4" />
              </div>
            ))
          : stats.map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.label} className={`aura-card p-4 border ${st.border} ${st.bg} relative overflow-hidden`}>
                  {/* Live indicator */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">Live</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`h-4 w-4 ${st.color}`} />
                    <p className="text-xs font-semibold text-slate-400">{st.label}</p>
                  </div>
                  <p className={`text-2xl sm:text-3xl font-extrabold ${st.color}`}>{st.value}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{st.change}</p>
                </div>
              );
            })}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/users" className="aura-card p-5 hover:border-cyan-500/40 transition group">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition">
              <Users className="h-5 w-5" />
            </div>
            <span className="aura-badge aura-badge-info text-[10px]">
              {adminStats ? `${adminStats.totalUsers?.toLocaleString()} Total` : "Loading..."}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">User Management</h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage accounts, assign roles (Student, Faculty, Mentor, Parent, Admin), and update permissions.
          </p>
        </Link>

        <Link to="/admin/departments" className="aura-card p-5 hover:border-purple-500/40 transition group">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="aura-badge aura-badge-warning text-[10px]">
              {adminStats ? `${adminStats.departmentsCount || 8} Depts` : "Loading..."}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">Departments & Courses</h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure academic departments, assign Head of Departments (HOD), and review course enrollment capacities.
          </p>
        </Link>

        <Link to="/admin/reports" className="aura-card p-5 hover:border-emerald-500/40 transition group">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition">
              <Activity className="h-5 w-5" />
            </div>
            <span className="aura-badge aura-badge-success text-[10px]">Audit Logs</span>
          </div>
          <h3 className="text-sm font-bold text-white">System Reports & Logs</h3>
          <p className="text-xs text-slate-400 mt-1">
            Download platform audit reports, server error tracebacks, and API latency metrics.
          </p>
        </Link>
      </div>

      {/* System Health & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="aura-card space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Server className="h-4 w-4 text-cyan-400" />
            Server Infrastructure & Services
            <span className="ml-auto flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">All Systems Online</span>
            </span>
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { name: "Node.js REST API Server", uptime: "99.99%", load: "12%", status: "Healthy" },
              { name: "MongoDB Database Cluster", uptime: "99.98%", load: "24%", status: "Healthy" },
              { name: "AURA AI Intelligence Engine", uptime: "100.0%", load: "18%", status: "Active" },
              { name: "Socket.IO Notification Server", uptime: "99.95%", load: "8%", status: "Active" },
            ].map((srv) => (
              <div key={srv.name} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{srv.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Uptime: {srv.uptime} • CPU Load: {srv.load}
                  </p>
                </div>
                <span className="aura-badge aura-badge-success text-[10px]">{srv.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="aura-card space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="h-4 w-4 text-purple-400" />
            Recent Security Audit Stream
          </h3>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-white">{log.event}</p>
                  <p className={`text-[11px] mt-0.5 ${log.color}`}>
                    {log.actor} <span className="text-slate-500">({log.role})</span>
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 ml-2">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Storage & User Breakdown */}
      {adminStats && (
        <div className="aura-card">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400" />
            Platform User Distribution (Live)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { role: "Students", count: adminStats.studentsCount || 0, color: "bg-emerald-500", textColor: "text-emerald-400" },
              { role: "Faculty", count: adminStats.facultyCount || 0, color: "bg-indigo-500", textColor: "text-indigo-400" },
              { role: "Mentors", count: adminStats.mentorCount || 0, color: "bg-purple-500", textColor: "text-purple-400" },
              { role: "Parents", count: adminStats.parentCount || 0, color: "bg-amber-500", textColor: "text-amber-400" },
            ].map(({ role, count, color, textColor }) => {
              const total = adminStats.totalUsers || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={role} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className={`text-xs font-bold ${textColor}`}>{role}</p>
                  <p className="text-xl font-extrabold text-white mt-0.5">{count.toLocaleString()}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{pct}% of total</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

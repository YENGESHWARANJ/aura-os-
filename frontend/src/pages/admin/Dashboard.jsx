import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { Shield, Users, Server, BookOpen, AlertTriangle, Activity, Database, CheckCircle, UserPlus, HardDrive, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Platform Users", value: "1,420", change: "+12% this month", color: "text-cyan-400" },
    { label: "Enrolled Students", value: "1,200", change: "Active across 8 depts", color: "text-emerald-400" },
    { label: "Active Faculty & Mentors", value: "130", change: "85 Faculty • 45 Mentors", color: "text-purple-400" },
    { label: "System Status", value: "99.98%", change: "Operational • Uptime 14d", color: "text-blue-400" },
  ];

  const recentLogs = [
    { id: "l1", event: "New Faculty Registered", actor: "Dr. Ramesh Sharma", role: "Faculty", time: "10 minutes ago" },
    { id: "l2", event: "Database Cluster Backup", actor: "System Automated Cron", role: "System", time: "1 hour ago" },
    { id: "l3", event: "Student Role Promoted to Mentor", actor: "Admin Control", role: "Admin", time: "3 hours ago" },
    { id: "l4", event: "AI Model Retrained", actor: "AURA AI Engine", role: "AI Service", time: "5 hours ago" },
  ];

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="AURA OS Command Center"
        title="Admin Control & System Operations"
        description="Monitor system health, manage platform users, track department analytics, and configure AURA AI services."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/users" className="aura-btn aura-btn-primary text-xs py-1.5 px-3">
              <UserPlus className="h-3.5 w-3.5 mr-1 inline" />
              Manage Users
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((st) => (
          <div key={st.label} className="aura-card p-4">
            <p className="text-xs font-semibold text-slate-400 mb-1">{st.label}</p>
            <p className={`text-2xl sm:text-3xl font-extrabold ${st.color}`}>{st.value}</p>
            <p className="text-[11px] text-slate-500 mt-1">{st.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/users" className="aura-card p-5 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users className="h-5 w-5" />
            </div>
            <span className="aura-badge aura-badge-info text-[10px]">1,420 Total</span>
          </div>
          <h3 className="text-sm font-bold text-white">User Management</h3>
          <p className="text-xs text-slate-400 mt-1">Manage accounts, assign roles (Student, Faculty, Mentor, Parent, Admin), and update permissions.</p>
        </Link>

        <Link to="/admin/departments" className="aura-card p-5 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="aura-badge aura-badge-warning text-[10px]">8 Depts</span>
          </div>
          <h3 className="text-sm font-bold text-white">Departments & Courses</h3>
          <p className="text-xs text-slate-400 mt-1">Configure academic departments, assign Head of Departments (HOD), and review course enrollment capacities.</p>
        </Link>

        <Link to="/admin/reports" className="aura-card p-5 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <span className="aura-badge aura-badge-success text-[10px]">Audit Logs</span>
          </div>
          <h3 className="text-sm font-bold text-white">System Reports & Logs</h3>
          <p className="text-xs text-slate-400 mt-1">Download platform audit reports, server error tracebacks, and API latency metrics.</p>
        </Link>
      </div>

      {/* System Health & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="aura-card space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Server className="h-4 w-4 text-cyan-400" />
            Server Infrastructure & Services
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { name: "Node.js REST API Server", status: "Healthy", uptime: "99.99%", load: "12%" },
              { name: "MongoDB Database Cluster", status: "Healthy", uptime: "99.98%", load: "24%" },
              { name: "AURA AI Intelligence Engine", status: "Active", uptime: "100.0%", load: "18%" },
              { name: "Notification Socket Server", status: "Active", uptime: "99.95%", load: "8%" },
            ].map((srv) => (
              <div key={srv.name} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{srv.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Uptime: {srv.uptime} • CPU Load: {srv.load}</p>
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
              <div key={log.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{log.event}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Actor: {log.actor} ({log.role})</p>
                </div>
                <span className="text-[10px] text-slate-500">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

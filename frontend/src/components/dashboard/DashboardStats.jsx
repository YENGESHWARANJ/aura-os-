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
} from "lucide-react";

export default function DashboardStats() {
  const attendanceOverview = [
    { label: "Theory Lectures", value: "88%", present: 44, total: 50, icon: BookOpen, color: "from-indigo-500 to-purple-500" },
    { label: "AI & ML Labs", value: "94%", present: 47, total: 50, icon: FlaskConical, color: "from-cyan-500 to-blue-500" },
    { label: "Tutorial Sessions", value: "82%", present: 41, total: 50, icon: Monitor, color: "from-emerald-500 to-teal-500" },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Attendance logged for Deep Learning",
      description: "Present • 88% overall course standing",
      time: "2 hours ago",
      icon: CheckCircle2,
      iconColor: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
    },
    {
      id: 2,
      title: "Neural Network Architecture Assignment",
      description: "Due in 24 hours • 100 points",
      time: "5 hours ago",
      icon: FileText,
      iconColor: "text-indigo-400 bg-indigo-950/40 border-indigo-500/30",
    },
    {
      id: 3,
      title: "Quiz 2: Transformer Models",
      description: "Score recorded: 18/20 (90%)",
      time: "1 day ago",
      icon: BookOpen,
      iconColor: "text-cyan-400 bg-cyan-950/40 border-cyan-500/30",
    },
  ];

  const notificationItems = [
    {
      id: 1,
      title: "Internal Assessment 2 Schedule",
      description: "Final timetable published for AI & Data Science.",
      time: "1 hour ago",
      icon: Bell,
      iconBg: "bg-indigo-950/40 text-indigo-400 border-indigo-500/30",
    },
    {
      id: 2,
      title: "Capstone Milestone 2 Review",
      description: "Project team review scheduled for Friday 2:00 PM.",
      time: "4 hours ago",
      icon: FileText,
      iconBg: "bg-cyan-950/40 text-cyan-400 border-cyan-500/30",
    },
  ];

  const mentorMessages = [
    {
      from: "Dr. Suresh R",
      role: "Faculty Mentor",
      message: "Great progress on your NLP project milestone. Keep your attendance above 85%.",
      time: "2h ago",
    },
  ];

  return (
    <section className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)] min-w-0">
      {/* LEFT COLUMN: AI Risk Monitor + Academic Overview + Recent Activity */}
      <div className="space-y-6 min-w-0">
        {/* AI Early Warning Risk Card */}
        <div className="aura-card border-indigo-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                AURA AI Early Warning Risk Monitor
              </h2>
            </div>
            <span className="rounded-full bg-emerald-950/60 border border-emerald-500/40 px-3 py-0.5 text-xs font-bold text-emerald-400 flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              LOW RISK (14.2%)
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Continuous inference from weighted parameters: $S = w_1 M + w_2 A + w_3 AS + w_4 Q$
          </p>

          <div className="grid grid-cols-4 gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-center">
              <p className="text-sm font-extrabold text-white">88%</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Marks (M)</p>
            </div>
            <div className="text-center border-l border-slate-800">
              <p className="text-sm font-extrabold text-white">86.5%</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Attendance (A)</p>
            </div>
            <div className="text-center border-l border-slate-800">
              <p className="text-sm font-extrabold text-white">92%</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Tasks (AS)</p>
            </div>
            <div className="text-center border-l border-slate-800">
              <p className="text-sm font-extrabold text-white">85%</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Quizzes (Q)</p>
            </div>
          </div>

          <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
              style={{ width: "85.8%" }}
            />
          </div>
        </div>

        {/* Academic Overview */}
        <div className="aura-card mb-0">
          <h2 className="text-sm font-extrabold text-white tracking-tight mb-4">
            Subject-wise Attendance Distribution
          </h2>

          <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-3 min-w-0">
            {attendanceOverview.map((item) => {
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
                    <div className="w-6 h-6 rounded-lg bg-indigo-950/60 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                    </div>
                  </div>

                  <p className="mt-2 text-xl font-extrabold text-white">
                    {item.value}
                  </p>

                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="aura-card mb-0">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-extrabold text-white tracking-tight">
              Recent Activity Feed
            </h2>
            <Link
              to="/dashboard/notifications"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition shrink-0"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 transition"
                >
                  <div className={`rounded-xl border p-2 shrink-0 ${act.iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{act.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{act.description}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 shrink-0">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Scheduled Lecture + Notifications + Mentor Messages */}
      <div className="space-y-6 min-w-0">
        {/* Next Scheduled Lecture Card */}
        <div className="aura-card border-cyan-500/30 bg-gradient-to-br from-[#0c192c] to-[#0f172a]">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Next Lecture</h2>
            </div>
            <span className="rounded-full bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
              IN 45 MIN
            </span>
          </div>

          <p className="text-base font-extrabold text-white">Deep Learning & Neural Networks</p>
          <p className="text-xs text-slate-400 mt-1">Dr. K. Raghavan • Lecture Hall 302</p>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400">10:30 AM – 11:30 AM</span>
            <Link
              to="/dashboard/attendance"
              className="text-xs font-bold text-slate-300 hover:text-white"
            >
              Attendance Roster →
            </Link>
          </div>
        </div>

        {/* Notifications */}
        <div className="aura-card mb-0">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-extrabold text-white tracking-tight">Recent Alerts</h2>
            <Link
              to="/dashboard/notifications"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition shrink-0"
            >
              View all
            </Link>
          </div>

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
                      <span className="text-[10px] text-slate-500 shrink-0 font-medium">{item.time}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400 leading-snug line-clamp-1">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mentor Advisory Message */}
        <div className="aura-card mb-0">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-400" />
              <h2 className="text-sm font-extrabold text-white tracking-tight">Mentor Advisory</h2>
            </div>
            <Link
              to="/mentor/notes"
              className="text-xs font-bold text-purple-400 hover:text-purple-300"
            >
              Notes
            </Link>
          </div>

          {mentorMessages.map((msg) => (
            <div key={msg.from} className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-950/20">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-bold text-purple-300">{msg.from}</p>
                <span className="text-[10px] text-slate-500">{msg.time}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

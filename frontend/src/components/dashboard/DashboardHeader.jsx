import { useSelector } from "react-redux";
import { Calendar, FileText, Sparkles, Shield, User } from "lucide-react";

export default function DashboardHeader() {
  const { user } = useSelector((state) => state.auth);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <section className="grid gap-5 grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] items-center min-w-0">
      {/* Left Column: Welcome Greeting */}
      <div className="space-y-2 min-w-0">
        <div className="hub-pill">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AUTONOMOUS ACADEMIC MONITORING</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
          {getGreeting()}, {user?.name || "Student"} 👋
        </h1>

        <p className="max-w-xl text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
          Roll No: <span className="text-indigo-300 font-bold">{user?.rollNumber || "22AI012"}</span> • B.Tech AI & Data Science (Semester 6)
        </p>
      </div>

      {/* Right Column: Weekly Progress Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/80 via-slate-900 to-slate-950 p-5 text-white border border-indigo-500/30 shadow-xl min-w-0">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                WEEKLY PROGRESS
              </p>
              <p className="mt-0.5 text-3xl font-extrabold text-white tracking-tight">
                84%
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 shrink-0">
              On Track
            </span>
          </div>

          <p className="mt-1.5 text-xs text-slate-300 font-medium">
            Attendance and tasks are exceeding the semester baseline.
          </p>

          {/* Progress Bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
              style={{ width: "84%" }}
            />
          </div>

          {/* Next Exam & Pending Tasks */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs min-w-0 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="rounded-lg bg-indigo-950/60 p-1.5 text-indigo-400 shrink-0 border border-indigo-500/30">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">Next Exam</p>
                <p className="text-xs font-bold text-slate-200 truncate">Deep Learning</p>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <div className="rounded-lg bg-indigo-950/60 p-1.5 text-indigo-400 shrink-0 border border-indigo-500/30">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">Pending</p>
                <p className="text-xs font-bold text-slate-200 truncate">3 Tasks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

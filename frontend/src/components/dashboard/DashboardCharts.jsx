import { getDashboardPerformanceStats } from "../../services/dashboardService";
import { Calendar } from "lucide-react";

export default function DashboardCharts() {
  const performanceStats = getDashboardPerformanceStats();

  // SVG Sparkline Curves
  const sparklines = [
    // Semester 1 Sparkline (blue)
    <svg
      key="s1"
      className="h-7 w-full text-blue-500"
      viewBox="0 0 100 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M 0,22 Q 25,18 50,24 T 100,8" />
    </svg>,
    // Semester 2 Sparkline (purple)
    <svg
      key="s2"
      className="h-7 w-full text-purple-500"
      viewBox="0 0 100 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M 0,25 Q 30,12 60,20 T 100,5" />
    </svg>,
    // Semester 3 Sparkline (indigo)
    <svg
      key="s3"
      className="h-7 w-full text-indigo-500"
      viewBox="0 0 100 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M 0,20 Q 25,25 50,12 T 100,6" />
    </svg>,
  ];

  return (
    <section className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)] min-w-0">
      {/* Attendance Summary */}
      <div className="activity-section-card mb-0">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Attendance Summary
          </h2>
          {/* GPA Improving Badge */}
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-extrabold text-emerald-600 shrink-0">
            GPA Improving
          </span>
        </div>

        <div className="mt-4 grid gap-3.5 grid-cols-1 sm:grid-cols-3 min-w-0">
          {performanceStats.map((item, index) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-100 bg-[#f8faff] p-4 min-w-0 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-500 truncate">
                  {item.label}
                </p>
                <p className="mt-1.5 text-2xl font-extrabold text-slate-900">
                  {item.value}
                </p>
              </div>

              {/* Sparkline Wave */}
              <div className="mt-3">{sparklines[index % sparklines.length]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="activity-section-card mb-0">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Upcoming Exams
          </h2>
          <span className="text-xs font-bold text-indigo-600 shrink-0 bg-indigo-50 px-2.5 py-1 rounded-xl">
            August 2026
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {performanceStats.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 bg-[#f8faff] min-w-0 hover:bg-slate-100/60 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-2.5 text-purple-600 shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {item.label}
                </p>
              </div>

              <span className="text-base font-extrabold text-indigo-600 shrink-0">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

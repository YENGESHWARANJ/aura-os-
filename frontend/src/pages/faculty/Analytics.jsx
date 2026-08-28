import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { BarChart2, TrendingUp, Users, BookOpen } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

const ATTENDANCE_DATA = [
  { week: "Wk 1", present: 92 },
  { week: "Wk 2", present: 88 },
  { week: "Wk 3", present: 79 },
  { week: "Wk 4", present: 85 },
  { week: "Wk 5", present: 91 },
  { week: "Wk 6", present: 83 },
];

const MARKS_DIST = [
  { range: "90–100", students: 8 },
  { range: "80–89", students: 14 },
  { range: "70–79", students: 18 },
  { range: "60–69", students: 10 },
  { range: "50–59", students: 7 },
  { range: "<50", students: 3 },
];

const PERFORMANCE_TREND = [
  { month: "Jun", avg: 71 },
  { month: "Jul", avg: 74 },
  { month: "Aug", avg: 78 },
];

const RISK_DATA = [
  { name: "On Track", value: 42, color: "#10b981" },
  { name: "At Risk", value: 12, color: "#f59e0b" },
  { name: "Critical", value: 4, color: "#f43f5e" },
];

export default function Analytics() {
  const [selectedCourse, setSelectedCourse] = useState("Ethics and AI");

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Course Analytics"
        description="Visual insights into attendance trends, marks distributions, and student performance across courses."
        actions={
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="aura-select text-xs">
            <option>Ethics and AI</option>
            <option>Machine Learning</option>
            <option>Data Science</option>
            <option>Natural Language Processing</option>
          </select>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Class Average", value: "74.2%", color: "text-cyan-400", icon: BarChart2 },
          { label: "Attendance Rate", value: "83.7%", color: "text-emerald-400", icon: Users },
          { label: "Pass Rate", value: "91.4%", color: "text-blue-400", icon: TrendingUp },
          { label: "At-Risk Students", value: "16", color: "text-rose-400", icon: BookOpen },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="aura-card p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-800/60 flex items-center justify-center flex-shrink-0">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className={`text-xl font-extrabold ${color}`}>{value}</p>
              <p className="text-[11px] text-slate-400 font-semibold">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance by Week */}
        <div className="aura-card p-5">
          <h3 className="text-sm font-bold text-white mb-4">Weekly Attendance Rate (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ATTENDANCE_DATA} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
              <Bar dataKey="present" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Marks Distribution */}
        <div className="aura-card p-5">
          <h3 className="text-sm font-bold text-white mb-4">Marks Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MARKS_DIST} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="range" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
              <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="aura-card p-5">
          <h3 className="text-sm font-bold text-white mb-4">Average Score Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={PERFORMANCE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[60, 90]} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
              <Line type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2} dot={{ r: 5, fill: "#10b981" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Breakdown */}
        <div className="aura-card p-5">
          <h3 className="text-sm font-bold text-white mb-4">Student Risk Breakdown</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={RISK_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {RISK_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5">
              {RISK_DATA.map((r) => (
                <div key={r.name} className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                  <span className="text-xs font-semibold text-slate-300">{r.name}</span>
                  <span className="ml-auto text-xs font-extrabold text-white">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

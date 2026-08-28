import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getMentorDashboard } from "../../services/mentor/mentorApi";
import PageHeader from "../../components/ui/PageHeader";
import {
  Users,
  AlertTriangle,
  UserCheck,
  Award,
  Video,
  Sparkles,
  TrendingUp,
  Clock,
  ChevronRight,
  ShieldAlert,
  CheckCircle,
  FileCode,
  Calendar,
  MessageSquare,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock Performance Overview Data for Recharts
const PERFORMANCE_TREND = [
  { month: "Jan", academics: 7.8, attendance: 88, assignments: 92 },
  { month: "Feb", academics: 7.9, attendance: 85, assignments: 89 },
  { month: "Mar", academics: 8.0, attendance: 86, assignments: 91 },
  { month: "Apr", academics: 8.1, attendance: 84, assignments: 87 },
  { month: "May", academics: 8.1, attendance: 86, assignments: 94 },
];

const AT_RISK_STUDENTS = [
  {
    id: "s1",
    name: "Alex Johnson",
    rollNo: "22AI701",
    attendance: "68%",
    cgpa: 6.9,
    risk: "Critical",
    riskColor: "aura-badge-danger",
    primaryIssue: "Low Attendance",
    lastContact: "2 days ago",
  },
  {
    id: "s2",
    name: "Rahul Kumar",
    rollNo: "22AI704",
    attendance: "72%",
    cgpa: 7.1,
    risk: "High",
    riskColor: "aura-badge-warning",
    primaryIssue: "Academic Performance",
    lastContact: "4 days ago",
  },
  {
    id: "s3",
    name: "Priya S",
    rollNo: "22AI706",
    attendance: "76%",
    cgpa: 7.8,
    risk: "Medium",
    riskColor: "aura-badge-warning",
    primaryIssue: "Assignment Delay",
    lastContact: "1 day ago",
  },
];

const UPCOMING_MEETINGS = [
  {
    student: "Alex Johnson",
    type: "Academic Review",
    date: "Aug 20",
    time: "10:30 AM",
    status: "Scheduled",
  },
  {
    student: "Priya S",
    type: "Attendance Recovery",
    date: "Aug 21",
    time: "02:00 PM",
    status: "Confirmed",
  },
];

const RECENT_ACTIVITIES = [
  { title: "Attendance alert reviewed", student: "Alex Johnson", time: "2 hours ago", icon: AlertTriangle, color: "text-rose-400" },
  { title: "Student profile updated", student: "Rahul Kumar", time: "1 day ago", icon: CheckCircle, color: "text-cyan-400" },
  { title: "Goal milestone completed", student: "Priya S", time: "2 days ago", icon: Award, color: "text-emerald-400" },
];

export default function MentorDashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getMentorDashboard();
        if (response?.data?.data) {
          setDashboard(response.data.data);
        }
      } catch {
        // Fallback UI handles demo display gracefully
      }
    };
    fetchDashboard();
  }, []);

  const currentDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <PageHeader
        eyebrow="Mentor Command Center"
        title="Good Morning, Mentor 👋"
        description="Monitor student performance, identify academic risks, and manage your mentoring activities."
        actions={
          <div className="flex items-center gap-2">
            <span className="aura-badge aura-badge-neutral py-1.5 px-3 text-xs flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              {currentDateStr}
            </span>
          </div>
        }
      />

      {/* 1. 5 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="aura-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Students</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">48</p>
          <p className="text-[11px] text-slate-400 mt-1">Assigned S7 AIDS</p>
        </div>

        <div className="aura-card border-rose-500/30 bg-rose-950/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">At-Risk Students</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">7</p>
          <p className="text-[11px] text-rose-300 mt-1">Requires Attention</p>
        </div>

        <div className="aura-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Attendance</span>
            <UserCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">86%</p>
          <p className="text-[11px] text-emerald-400 mt-1">+2.4% this month</p>
        </div>

        <div className="aura-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average CGPA</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">8.1</p>
          <p className="text-[11px] text-slate-400 mt-1">Batch Median: 7.8</p>
        </div>

        <div className="aura-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Upcoming Meetings</span>
            <Video className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">12</p>
          <p className="text-[11px] text-purple-400 mt-1">This Week</p>
        </div>
      </div>

      {/* 2. CHART & RISK ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Performance Overview Chart */}
        <div className="aura-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Student Performance Overview</h3>
              <p className="text-xs text-slate-400">Academic CGPA, Attendance %, and Assignment completion trends</p>
            </div>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={PERFORMANCE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis domain={[60, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#071124", borderColor: "rgba(148,163,184,0.2)", borderRadius: "12px", fontSize: "12px" }}
              />
              <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#06b6d4" strokeWidth={2.5} fill="url(#perfGrad)" />
              <Area type="monotone" dataKey="assignments" name="Assignment %" stroke="#8b5cf6" strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Student Risk Analytics Section */}
        <div className="aura-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Student Risk Distribution</h3>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <span className="text-[10px] font-extrabold uppercase text-rose-400">Critical</span>
              <p className="text-2xl font-extrabold text-rose-400 mt-1">2</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-[10px] font-extrabold uppercase text-amber-400">High Risk</span>
              <p className="text-2xl font-extrabold text-amber-400 mt-1">3</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <span className="text-[10px] font-extrabold uppercase text-yellow-400">Medium</span>
              <p className="text-2xl font-extrabold text-yellow-400 mt-1">5</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-[10px] font-extrabold uppercase text-emerald-400">Low / Safe</span>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">38</p>
            </div>
          </div>

          {/* Horizontal Risk Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Risk Proportion</span>
              <span>48 Total Students</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-800">
              <div style={{ width: "4%" }} className="bg-rose-500 h-full" title="Critical: 2" />
              <div style={{ width: "6%" }} className="bg-amber-500 h-full" title="High: 3" />
              <div style={{ width: "10%" }} className="bg-yellow-500 h-full" title="Medium: 5" />
              <div style={{ width: "80%" }} className="bg-emerald-500 h-full" title="Low: 38" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. AT-RISK STUDENTS TABLE & AI MENTOR INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At-Risk Students Table */}
        <div className="aura-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Students Requiring Attention</h3>
              <p className="text-xs text-slate-400">Students flagged for low attendance or academic performance drops</p>
            </div>
            <Link to="/mentor/risk-students" className="text-xs font-bold text-cyan-400 hover:underline">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">CGPA</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                  <th className="py-2.5 px-3">Primary Issue</th>
                  <th className="py-2.5 px-3">Last Contact</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {AT_RISK_STUDENTS.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-900/60 transition">
                    <td className="py-3 px-3">
                      <p className="font-bold text-white">{st.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{st.rollNo}</p>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-rose-400">{st.attendance}</td>
                    <td className="py-3 px-3 font-bold text-slate-200">{st.cgpa}</td>
                    <td className="py-3 px-3">
                      <span className={`aura-badge ${st.riskColor}`}>{st.risk}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{st.primaryIssue}</td>
                    <td className="py-3 px-3 text-slate-500">{st.lastContact}</td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/mentor/student/${st.id}`}
                        className="aura-btn aura-btn-secondary py-1 px-2.5 text-[11px]"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Mentor Insights */}
        <div className="aura-card border-purple-500/30 bg-purple-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-400 shrink-0" />
              <h3 className="text-base font-bold text-white">AI Mentor Insights</h3>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                ⚠️ <strong>7 students</strong> require immediate attention due to attendance or internal test scores.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                📉 <strong>3 students</strong> have declining attendance trends in Big Data Analytics.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                💡 <strong>5 students</strong> may need academic intervention before upcoming end-term exams.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                🌟 <strong>12 students</strong> are progressing above expectations in Semester 7.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <Link
              to="/dashboard/ai"
              className="aura-btn aura-btn-primary w-full justify-center py-2.5 text-xs font-bold"
            >
              Open AI Mentor Assistant
            </Link>
          </div>
        </div>
      </div>

      {/* 4. UPCOMING MEETINGS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Mentoring Meetings */}
        <div className="aura-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Upcoming Mentoring Meetings</h3>
            <Link to="/mentor/meetings" className="text-xs font-bold text-cyan-400 hover:underline">
              Schedule New →
            </Link>
          </div>

          <div className="space-y-3">
            {UPCOMING_MEETINGS.map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{m.student}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{m.type}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{m.date} at {m.time}</p>
                </div>
                <span className="aura-badge aura-badge-success">{m.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Mentoring Activity */}
        <div className="aura-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Recent Activity</h3>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {RECENT_ACTIVITIES.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-950 shrink-0">
                    <Icon className={`h-4 w-4 ${act.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{act.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">Student: {act.student}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFacultyDashboard } from "../../services/facultyService";
import PageHeader from "../../components/ui/PageHeader";
import {
  BookOpen,
  Users,
  Calendar,
  UserCheck,
  FileText,
  AlertTriangle,
  Plus,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DEMO_ATTENDANCE_DATA = [
  { course: "Ethics & AI", attendance: 89 },
  { course: "Machine Learning", attendance: 92 },
  { course: "Data Science", attendance: 76 },
  { course: "NLP", attendance: 88 },
];

const TODAY_CLASSES = [
  { course: "AI Fundamentals", room: "Room A204", time: "09:00 AM – 10:00 AM", section: "Section A", students: 52, status: "Upcoming" },
  { course: "Machine Learning", room: "Lab 3", time: "11:00 AM – 01:00 PM", section: "Section B", students: 48, status: "Upcoming" },
  { course: "Data Science", room: "Room B102", time: "02:00 PM – 03:00 PM", section: "Section A", students: 50, status: "Upcoming" },
  { course: "Ethics and AI", room: "Hall 1", time: "03:30 PM – 04:30 PM", section: "Section C", students: 54, status: "Upcoming" },
];

const MY_COURSES = [
  { code: "22AI040", name: "Ethics and AI", semester: "Sem 7", section: "Sec A", students: 52, attendance: "89%", avgScore: "82%" },
  { code: "22AI041", name: "Machine Learning", semester: "Sem 7", section: "Sec B", students: 48, attendance: "92%", avgScore: "85%" },
  { code: "22AI042", name: "Data Science", semester: "Sem 7", section: "Sec A", students: 50, attendance: "76%", avgScore: "74%" },
  { code: "22AI043", name: "Natural Language Processing", semester: "Sem 7", section: "Sec C", students: 54, attendance: "88%", avgScore: "79%" },
];

const AT_RISK_STUDENTS = [
  { name: "Alex Johnson", course: "AI Fundamentals", attendance: "68%", cgpa: 6.9, avgMarks: "61%", risk: "Critical", issue: "Low attendance", lastContact: "2 days ago" },
  { name: "Rahul Kumar", course: "Machine Learning", attendance: "72%", cgpa: 7.1, avgMarks: "65%", risk: "High", issue: "Test score drop", lastContact: "4 days ago" },
  { name: "Priya S", course: "Data Science", attendance: "76%", cgpa: 7.8, avgMarks: "74%", risk: "Medium", issue: "Assignment delay", lastContact: "1 day ago" },
];

export default function FacultyDashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getFacultyDashboard();
        if (response?.data?.data) {
          setDashboardData(response.data.data);
        }
      } catch {
        // Demo fallback data loaded
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
      {/* Page Header */}
      <PageHeader
        eyebrow="Faculty Command Center"
        title="Good Morning, Professor 👋"
        description="Monitor your classes, students, attendance, and academic performance."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span className="aura-badge aura-badge-neutral py-1.5 px-3 text-xs flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              {currentDateStr}
            </span>
            <Link to="/faculty/assignments" className="aura-btn aura-btn-primary py-1.5 px-3 text-xs flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" />
              Create Assignment
            </Link>
            <Link to="/faculty/attendance" className="aura-btn aura-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-cyan-400" />
              Mark Attendance
            </Link>
          </div>
        }
      />

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="aura-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Courses</span>
            <BookOpen className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{dashboardData?.assignedSubjects ?? 6}</p>
          <p className="text-[11px] text-slate-400 mt-1">Assigned courses</p>
        </div>

        <div className="aura-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Students</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{dashboardData?.totalStudents ?? 248}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across 4 sections</p>
        </div>

        <div className="aura-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Classes Today</span>
            <Calendar className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{dashboardData?.todaysClasses ?? 4}</p>
          <p className="text-[11px] text-purple-400 mt-1">Scheduled today</p>
        </div>

        <div className="aura-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Attendance</span>
            <UserCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">87%</p>
          <p className="text-[11px] text-slate-400 mt-1">Batch Average</p>
        </div>

        <div className="aura-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Eval.</span>
            <FileText className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">{dashboardData?.pendingEvaluations ?? 18}</p>
          <p className="text-[11px] text-slate-400 mt-1">Assignments pending</p>
        </div>

        <div className="aura-card border-rose-500/30 bg-rose-950/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">At-Risk Students</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">12</p>
          <p className="text-[11px] text-rose-300 mt-1">Require attention</p>
        </div>
      </div>

      {/* TODAY'S SCHEDULE & ATTENDANCE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="aura-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Today's Class Schedule</h3>
              <p className="text-xs text-slate-400">4 lectures scheduled for today across Lab & Classrooms</p>
            </div>
            <Link to="/faculty/classes" className="text-xs font-bold text-blue-400 hover:underline">
              Full Schedule →
            </Link>
          </div>

          <div className="space-y-3">
            {TODAY_CLASSES.map((cls, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-950/50 border border-blue-500/30 text-blue-400 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{cls.course}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {cls.room} · {cls.section} · {cls.students} Students
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-cyan-400 block">{cls.time}</span>
                  <span className="aura-badge aura-badge-success text-[10px] mt-1 inline-block">{cls.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance by Course Chart */}
        <div className="aura-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Attendance by Course</h3>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={DEMO_ATTENDANCE_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="course" tick={{ fill: "#64748b", fontSize: 10 }} />
              <YAxis domain={[60, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#071124", borderColor: "rgba(148,163,184,0.2)", borderRadius: "12px", fontSize: "11px" }} />
              <Bar dataKey="attendance" name="Attendance %" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MY COURSES CARDS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">My Assigned Courses</h3>
          <Link to="/faculty/classes" className="text-xs font-bold text-blue-400 hover:underline">
            View All Classes →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MY_COURSES.map((crs) => (
            <div key={crs.code} className="aura-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="aura-badge aura-badge-neutral text-[10px]">{crs.code}</span>
                  <span className="text-[10px] font-bold text-slate-400">{crs.semester} · {crs.section}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{crs.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{crs.students} Enrolled Students</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Attendance:</span>
                  <strong className="text-emerald-400">{crs.attendance}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Avg Marks:</span>
                  <strong className="text-cyan-400">{crs.avgScore}</strong>
                </div>
                <Link to="/faculty/classes" className="aura-btn aura-btn-secondary w-full justify-center text-[11px] py-1.5 mt-2">
                  Open Course Workspace
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AT-RISK STUDENTS TABLE */}
      <div className="aura-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Students Requiring Attention</h3>
            <p className="text-xs text-slate-400">Students flagged for attendance deficit or internal test drops</p>
          </div>
          <Link to="/faculty/risk-students" className="text-xs font-bold text-blue-400 hover:underline">
            Manage All Risk Students →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Course</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3">CGPA</th>
                <th className="py-2.5 px-3">Avg Marks</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Primary Issue</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {AT_RISK_STUDENTS.map((st, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60 transition">
                  <td className="py-3 px-3 font-bold text-white">{st.name}</td>
                  <td className="py-3 px-3 text-slate-400">{st.course}</td>
                  <td className="py-3 px-3 font-extrabold text-rose-400">{st.attendance}</td>
                  <td className="py-3 px-3 text-slate-200">{st.cgpa}</td>
                  <td className="py-3 px-3 text-slate-200">{st.avgMarks}</td>
                  <td className="py-3 px-3">
                    <span className={`aura-badge ${st.risk === "Critical" ? "aura-badge-danger" : "aura-badge-warning"}`}>
                      {st.risk}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{st.issue}</td>
                  <td className="py-3 px-3 text-right">
                    <Link to="/faculty/students" className="aura-btn aura-btn-secondary py-1 px-2.5 text-[11px]">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

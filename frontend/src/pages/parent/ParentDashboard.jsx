import React, { useState } from "react";
import {
  UserCheck,
  BookOpen,
  AlertTriangle,
  Calendar,
  Award,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Phone,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";

const MOCK_CHILD = {
  name: "Alex Johnson",
  rollNo: "22AI701",
  department: "Artificial Intelligence & Data Science",
  semester: "Semester 7",
  section: "Section A",
  cgpa: 8.8,
  attendancePct: 84,
  totalPresent: 185,
  totalClasses: 220,
  mentor: "Dr. Suresh R",
  mentorContact: "+91 98765 43210",
  riskLevel: "Safe",
};

const SUBJECT_PERFORMANCE = [
  { name: "Data Visualisation", code: "22AI701", attendance: 88, marks: 42, total: 50, grade: "A+" },
  { name: "Natural Language Processing", code: "22AI702", attendance: 92, marks: 45, total: 50, grade: "O" },
  { name: "Computer Vision", code: "22AI703", attendance: 78, marks: 38, total: 50, grade: "A" },
  { name: "Reinforcement Learning", code: "22AI704", attendance: 82, marks: 40, total: 50, grade: "A+" },
  { name: "Big Data Analytics", code: "22AI705", attendance: 71, marks: 32, total: 50, grade: "B+" },
];

const RECENT_NOTIFICATIONS = [
  { id: 1, title: "Mid-Term Results Published", time: "2 hours ago", type: "Academic", desc: "Alex scored 88% overall in Mid-Term Examinations." },
  { id: 2, title: "Mentor Meeting Scheduled", time: "1 day ago", type: "Meeting", desc: "Scheduled meeting with Dr. Suresh R on Friday at 3:00 PM." },
  { id: 3, title: "Low Attendance Alert (BDA)", time: "3 days ago", type: "Warning", desc: "Big Data Analytics attendance fell to 71%." },
];

export default function ParentDashboard() {
  const [child] = useState(MOCK_CHILD);

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Parent Portal"
        title="Parent Academic Dashboard"
        description={`Real-time academic performance, attendance, and mentor updates for ${child.name}.`}
        actions={
          <div className="flex items-center gap-2">
            <span className="aura-badge aura-badge-success flex items-center gap-1.5 py-1 px-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Parent Account
            </span>
          </div>
        }
      />

      {/* Student Profile Card */}
      <div className="aura-card mb-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-extrabold text-cyan-400 text-2xl">
              {child.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{child.name}</h2>
                <span className="aura-badge aura-badge-info">{child.rollNo}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {child.department} · {child.semester} ({child.section})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Assigned Mentor</p>
              <p className="text-xs font-bold text-cyan-400 mt-0.5">{child.mentor}</p>
            </div>
            <a
              href={`tel:${child.mentorContact}`}
              className="aura-btn aura-btn-secondary py-2 text-xs flex items-center gap-2"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-400" />
              Contact Mentor
            </a>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="attendance-stats mb-6">
        <div className="attendance-stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Current CGPA</span>
            <TrendingUp className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{child.cgpa}</p>
          <p className="text-xs text-emerald-400 mt-1">Top 10% of Batch</p>
        </div>

        <div className="attendance-stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Overall Attendance</span>
            <UserCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{child.attendancePct}%</p>
          <p className="text-xs text-slate-400 mt-1">{child.totalPresent} of {child.totalClasses} classes</p>
        </div>

        <div className="attendance-stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Academic Status</span>
            <Award className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">{child.riskLevel}</p>
          <p className="text-xs text-slate-400 mt-1">No Academic Risk</p>
        </div>

        <div className="attendance-stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Enrolled Subjects</span>
            <BookOpen className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{SUBJECT_PERFORMANCE.length}</p>
          <p className="text-xs text-slate-400 mt-1">Semester 7 Courses</p>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="attendance-main-grid mb-6">
        {/* Subject Breakdown */}
        <div className="aura-card">
          <h3 className="text-base font-bold text-white mb-4">Subject-wise Academic Performance</h3>
          <div className="space-y-4">
            {SUBJECT_PERFORMANCE.map((sub) => (
              <div key={sub.code} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-white">{sub.name}</p>
                    <p className="text-xs text-slate-400">{sub.code}</p>
                  </div>
                  <span className="aura-badge aura-badge-success">{sub.grade} Grade</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                  <span>Marks: <strong className="text-white">{sub.marks}/{sub.total}</strong></span>
                  <span>Attendance: <strong className={sub.attendance < 75 ? "text-rose-400" : "text-emerald-400"}>{sub.attendance}%</strong></span>
                </div>
                <div className="subject-progress-bar mt-2">
                  <div
                    className="subject-progress-fill"
                    style={{
                      width: `${(sub.marks / sub.total) * 100}%`,
                      background: sub.attendance < 75 ? "#f43f5e" : "#06b6d4",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight & Notifications Column */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div className="aura-card border-cyan-500/30 bg-cyan-950/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">AI Academic Advisory</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Alex is demonstrating exceptional performance in Natural Language Processing and Data Visualisation. However, attendance in Big Data Analytics is currently at <strong>71%</strong>, which is below the mandatory 75% requirement.
            </p>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              💡 <strong>Parent Recommendation:</strong> Encourage Alex to attend the next 3 consecutive Big Data Analytics lectures to reach the 75% threshold.
            </div>
          </div>

          {/* Recent Parent Alerts */}
          <div className="aura-card">
            <h3 className="text-base font-bold text-white mb-4">Recent Updates & Alerts</h3>
            <div className="space-y-3">
              {RECENT_NOTIFICATIONS.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] text-slate-500">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

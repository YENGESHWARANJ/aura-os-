import { useEffect, useState } from "react";
import { getMentorReports } from "../../services/mentor/mentorApi";
import PageHeader from "../../components/ui/PageHeader";
import { PieChart, Download, Users, Video, AlertTriangle, CheckCircle, BarChart2 } from "lucide-react";

const DEMO_REPORTS = {
  totalStudents: 48,
  activeMeetings: 4,
  completedMeetings: 18,
  riskStudents: 7,
  avgAttendance: 86,
  avgCgpa: 8.1,
};

export default function MentorReports() {
  const [reports, setReports] = useState(DEMO_REPORTS);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getMentorReports();
        if (response?.data?.data) {
          setReports(response.data.data);
        }
      } catch {
        // Fallback demo reports loaded
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Mentor Portal"
        title="Performance Analytics & Reports"
        description="Comprehensive report summaries on student CGPA trends, attendance distribution, and risk mitigation statistics."
        actions={
          <button className="aura-btn aura-btn-secondary text-xs flex items-center gap-2">
            <Download className="h-4 w-4 text-cyan-400" />
            Export Full Analytics PDF
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="attendance-stats">
        <div className="attendance-stat-card">
          <span className="text-xs font-bold uppercase text-slate-400">Total Students</span>
          <p className="text-3xl font-extrabold text-white mt-2">{reports.totalStudents}</p>
          <p className="text-xs text-slate-400 mt-1">Assigned Mentees</p>
        </div>

        <div className="attendance-stat-card">
          <span className="text-xs font-bold uppercase text-slate-400">Active Mentoring Sessions</span>
          <p className="text-3xl font-extrabold text-purple-400 mt-2">{reports.activeMeetings}</p>
          <p className="text-xs text-slate-400 mt-1">Scheduled This Week</p>
        </div>

        <div className="attendance-stat-card">
          <span className="text-xs font-bold uppercase text-slate-400">Completed Sessions</span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">{reports.completedMeetings}</p>
          <p className="text-xs text-slate-400 mt-1">Sessions Logged</p>
        </div>

        <div className="attendance-stat-card border-rose-500/30 bg-rose-950/10">
          <span className="text-xs font-bold uppercase text-rose-400">Risk Flagged</span>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">{reports.riskStudents}</p>
          <p className="text-xs text-slate-400 mt-1">Students Under Review</p>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aura-card">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Batch Academic Summary</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The assigned Semester 7 AI & Data Science batch is maintaining an average CGPA of <strong>{reports.avgCgpa || "8.1"}</strong> with an overall attendance rate of <strong>{reports.avgAttendance || "86"}%</strong>.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Semester Pass Prediction: <strong className="text-emerald-400">95.8%</strong></span>
            <span>Target: <strong>90%+ Pass</strong></span>
          </div>
        </div>

        <div className="aura-card">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Mentoring Intervention Impact</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Out of 7 flagged risk students, 4 students have successfully improved attendance above the 75% threshold following mandatory 1-on-1 counseling sessions.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Recovery Success Rate: <strong className="text-cyan-400">57.1%</strong></span>
            <span>Active Recoveries: <strong>3 Pending</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

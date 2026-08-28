import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMentorRiskStudents } from "../../services/mentor/mentorApi";
import PageHeader from "../../components/ui/PageHeader";
import { AlertTriangle, ShieldAlert, Phone, Video, Eye, Calendar, Sparkles } from "lucide-react";

const DEMO_RISK_STUDENTS = [
  {
    _id: "s1",
    name: "Alex Johnson",
    rollNo: "22AI701",
    email: "alex@aura.edu",
    semester: "Semester 7",
    cgpa: 6.9,
    attendance: 68,
    riskLevel: "Critical",
    reason: "Attendance below 70% & Mid-term mark drop in Data Viz.",
    lastContact: "2 days ago",
    recommendedAction: "Schedule urgent 1-on-1 counseling session.",
  },
  {
    _id: "s2",
    name: "Rahul Kumar",
    rollNo: "22AI704",
    email: "rahul@aura.edu",
    semester: "Semester 7",
    cgpa: 7.1,
    attendance: 72,
    riskLevel: "High",
    reason: "Low internal marks in NLP & 3 pending assignments.",
    lastContact: "4 days ago",
    recommendedAction: "Issue assignment extension & academic tutoring.",
  },
  {
    _id: "s3",
    name: "Priya S",
    rollNo: "22AI706",
    email: "priya@aura.edu",
    semester: "Semester 7",
    cgpa: 7.8,
    attendance: 76,
    riskLevel: "Medium",
    reason: "Attendance approaching mandatory 75% threshold in BDA.",
    lastContact: "1 day ago",
    recommendedAction: "Notify student to attend upcoming 3 consecutive sessions.",
  },
];

export default function RiskStudents() {
  const [students, setStudents] = useState(DEMO_RISK_STUDENTS);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const response = await getMentorRiskStudents();
        if (response?.data?.data?.length) {
          setStudents(response.data.data);
        }
      } catch {
        // Fallback demo risk students loaded
      }
    };
    fetchRisk();
  }, []);

  const criticalCount = students.filter((s) => s.riskLevel === "Critical").length;
  const highCount = students.filter((s) => s.riskLevel === "High").length;
  const mediumCount = students.filter((s) => s.riskLevel === "Medium").length;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Mentor Portal"
        title="At-Risk Students Management"
        description="Identify students requiring academic intervention, attendance recovery, or specialized counseling."
        actions={
          <span className="aura-badge aura-badge-danger py-1.5 px-3">
            <ShieldAlert className="h-3.5 w-3.5 mr-1 inline" />
            {criticalCount + highCount + mediumCount} At-Risk Students Identified
          </span>
        }
      />

      {/* KPI Risk Tier Cards */}
      <div className="attendance-stats">
        <div className="attendance-stat-card border-rose-500/30 bg-rose-950/10">
          <span className="text-xs font-bold uppercase text-rose-400">Critical Risk</span>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">{criticalCount}</p>
          <p className="text-xs text-slate-400 mt-1">Requires Immediate Action</p>
        </div>

        <div className="attendance-stat-card border-amber-500/30 bg-amber-950/10">
          <span className="text-xs font-bold uppercase text-amber-400">High Risk</span>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">{highCount}</p>
          <p className="text-xs text-slate-400 mt-1">Attendance & Score Drops</p>
        </div>

        <div className="attendance-stat-card border-yellow-500/30 bg-yellow-950/10">
          <span className="text-xs font-bold uppercase text-yellow-400">Medium Risk</span>
          <p className="text-3xl font-extrabold text-yellow-400 mt-2">{mediumCount}</p>
          <p className="text-xs text-slate-400 mt-1">Approaching Threshold</p>
        </div>

        <div className="attendance-stat-card border-emerald-500/30 bg-emerald-950/10">
          <span className="text-xs font-bold uppercase text-emerald-400">Safe / On Track</span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">41</p>
          <p className="text-xs text-slate-400 mt-1">Normal Trajectory</p>
        </div>
      </div>

      {/* Risk Student Cards */}
      <div className="space-y-4">
        {students.map((st) => (
          <div
            key={st._id}
            className={`aura-card border-l-4 ${
              st.riskLevel === "Critical"
                ? "border-l-rose-500 bg-rose-950/10"
                : st.riskLevel === "High"
                ? "border-l-amber-500 bg-amber-950/10"
                : "border-l-yellow-500 bg-yellow-950/10"
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
                  <AlertTriangle
                    className={`h-6 w-6 ${
                      st.riskLevel === "Critical" ? "text-rose-400" : "text-amber-400"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{st.name}</h3>
                    <span className="text-xs font-mono text-slate-400">({st.rollNo || st.email})</span>
                    <span
                      className={`aura-badge ${
                        st.riskLevel === "Critical" ? "aura-badge-danger" : "aura-badge-warning"
                      }`}
                    >
                      {st.riskLevel} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    <strong>Primary Reason:</strong> {st.reason}
                  </p>
                  <p className="text-xs text-cyan-400 mt-1">
                    💡 <strong>Recommended Action:</strong> {st.recommendedAction}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="text-right px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hidden sm:block">
                  <p className="text-[10px] text-slate-400">Attendance / CGPA</p>
                  <p className="text-xs font-bold text-white">
                    <span className={st.attendance < 75 ? "text-rose-400" : "text-emerald-400"}>
                      {st.attendance}%
                    </span>{" "}
                    · {st.cgpa} CGPA
                  </p>
                </div>

                <Link
                  to={`/mentor/student/${st._id}`}
                  className="aura-btn aura-btn-secondary py-2 text-xs flex items-center gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5 text-cyan-400" />
                  View Progress
                </Link>

                <Link
                  to="/mentor/meetings"
                  className="aura-btn aura-btn-primary py-2 text-xs flex items-center gap-1.5"
                >
                  <Video className="h-3.5 w-3.5" />
                  Schedule Meeting
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

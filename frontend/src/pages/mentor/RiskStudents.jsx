import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMentorRiskStudents } from "../../services/mentor/mentorApi";
import PageHeader from "../../components/ui/PageHeader";
import { AlertTriangle, ShieldAlert, Eye, Video } from "lucide-react";
import { SAMPLE_STUDENTS } from "../../data/mockStudents";

const MAPPED_RISK_STUDENTS = SAMPLE_STUDENTS.filter((s) => s.risk !== "Low").map((s) => ({
  _id: s._id,
  name: s.name,
  rollNo: s.rollNo,
  email: s.email,
  semester: s.semester || "Semester 7",
  cgpa: s.cgpa,
  attendance: s.attendance,
  riskLevel: s.risk,
  reason: s.riskReason,
  recommendedAction: s.recommendedAction,
}));

export default function RiskStudents() {
  const [students, setStudents] = useState(MAPPED_RISK_STUDENTS);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const response = await getMentorRiskStudents();
        if (response?.data?.data?.length) {
          setStudents(response.data.data);
        }
      } catch {
        // Fallback to MAPPED_RISK_STUDENTS from 50 students dataset
        setStudents(MAPPED_RISK_STUDENTS);
      }
    };
    fetchRisk();
  }, []);

  const criticalCount = students.filter((s) => s.riskLevel === "Critical").length;
  const highCount = students.filter((s) => s.riskLevel === "High").length;
  const mediumCount = students.filter((s) => s.riskLevel === "Medium").length;
  const safeCount = SAMPLE_STUDENTS.filter((s) => s.risk === "Low").length;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Mentor Portal"
        title="At-Risk Students Management"
        description="Identify and support cohort students requiring academic intervention, attendance recovery, or specialized counseling."
        actions={
          <span className="aura-badge aura-badge-danger py-1.5 px-3">
            <ShieldAlert className="h-3.5 w-3.5 mr-1 inline" />
            {criticalCount + highCount + mediumCount} At-Risk Students Identified
          </span>
        }
      />

      {/* KPI Risk Tier Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="aura-card border-rose-500/30 bg-rose-950/10 p-4 text-center">
          <span className="text-xs font-bold uppercase text-rose-400">Critical Risk</span>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">{criticalCount}</p>
          <p className="text-xs text-slate-400 mt-1">Attendance &lt; 70% / Urgent Action</p>
        </div>

        <div className="aura-card border-amber-500/30 bg-amber-950/10 p-4 text-center">
          <span className="text-xs font-bold uppercase text-amber-400">High Risk</span>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">{highCount}</p>
          <p className="text-xs text-slate-400 mt-1">Attendance 70-74% / Score Drops</p>
        </div>

        <div className="aura-card border-yellow-500/30 bg-yellow-950/10 p-4 text-center">
          <span className="text-xs font-bold uppercase text-yellow-400">Medium Risk</span>
          <p className="text-3xl font-extrabold text-yellow-400 mt-2">{mediumCount}</p>
          <p className="text-xs text-slate-400 mt-1">Approaching 75% Threshold</p>
        </div>

        <div className="aura-card border-emerald-500/30 bg-emerald-950/10 p-4 text-center">
          <span className="text-xs font-bold uppercase text-emerald-400">Safe / On Track</span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">{safeCount}</p>
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

import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { AlertTriangle, TrendingDown, Eye, ShieldAlert } from "lucide-react";
import { SAMPLE_STUDENTS } from "../../data/mockStudents";

const RISK_COLORS = {
  Critical: "text-rose-400 bg-rose-950/40 border-rose-500/30",
  High: "text-orange-400 bg-orange-950/40 border-orange-500/30",
  Medium: "text-amber-400 bg-amber-950/40 border-amber-500/30",
  Low: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
};

export default function RiskStudents() {
  const atRiskStudents = SAMPLE_STUDENTS.filter((s) => s.risk !== "Low");
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? atRiskStudents : atRiskStudents.filter((s) => s.risk === filter);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="At-Risk Students"
        description="AI-identified students requiring immediate academic intervention, counseling, or attendance recovery."
        actions={
          <span className="aura-badge aura-badge-danger py-1.5 px-3">
            <ShieldAlert className="h-3.5 w-3.5 mr-1 inline" />
            {atRiskStudents.length} Students At Risk Identified
          </span>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {["Critical", "High", "Medium", "All"].map((level) => {
          const count =
            level === "All"
              ? atRiskStudents.length
              : atRiskStudents.filter((s) => s.risk === level).length;
          return (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`aura-card p-4 text-center transition hover:scale-[1.02] border ${
                filter === level ? RISK_COLORS[level === "All" ? "Low" : level] : ""
              }`}
            >
              <p
                className={`text-2xl font-extrabold ${
                  level === "Critical"
                    ? "text-rose-400"
                    : level === "High"
                    ? "text-orange-400"
                    : level === "Medium"
                    ? "text-amber-400"
                    : "text-cyan-400"
                }`}
              >
                {count}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">
                {level === "All" ? "Total At Risk" : `${level} Risk`}
              </p>
            </button>
          );
        })}
      </div>

      {/* At-Risk Table */}
      <div className="aura-card">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white">
            {filter === "All" ? "All At-Risk Cohort Students" : `${filter} Risk Students`}
          </h3>
          <span className="ml-auto text-xs text-slate-400 font-semibold">{filtered.length} students</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Risk Reason</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filtered.map((s) => (
                <tr key={s._id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-400">{s.rollNo}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{s.name}</p>
                    <p className="text-[10px] text-slate-500">{s.department}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{s.course}</td>
                  <td className="py-3.5 px-4 font-extrabold text-rose-400">{s.attendance}%</td>
                  <td className="py-3.5 px-4 font-extrabold text-amber-400">{s.cgpa}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${RISK_COLORS[s.risk]}`}>
                      {s.risk}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs">{s.riskReason}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="aura-btn aura-btn-secondary py-1 px-2.5 text-[11px]">
                      <Eye className="h-3 w-3 mr-1 inline text-cyan-400" /> Action Plan
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 text-xs">
                    No students found in this risk category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

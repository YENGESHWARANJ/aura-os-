import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { FileBarChart, Download, Eye } from "lucide-react";

const REPORTS = [
  { _id: "r1", title: "Monthly Attendance Report — August 2026", course: "Ethics and AI", type: "Attendance", generated: "2026-08-01", format: "PDF" },
  { _id: "r2", title: "Mid-Semester Marks Report", course: "Machine Learning", type: "Marks", generated: "2026-08-16", format: "Excel" },
  { _id: "r3", title: "At-Risk Students Summary", course: "All Courses", type: "AI Report", generated: "2026-08-18", format: "PDF" },
  { _id: "r4", title: "Course Performance Analytics", course: "Data Science", type: "Analytics", generated: "2026-08-17", format: "PDF" },
  { _id: "r5", title: "Assignment Submission Statistics", course: "NLP", type: "Assignments", generated: "2026-08-15", format: "Excel" },
];

const TYPE_COLORS = {
  Attendance: "text-cyan-400",
  Marks: "text-purple-400",
  "AI Report": "text-rose-400",
  Analytics: "text-amber-400",
  Assignments: "text-blue-400",
};

export default function Reports() {
  const [reports] = useState(REPORTS);

  const generateReport = (type) => {
    alert(`Generating ${type} report...`);
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Reports"
        description="Generate and download attendance, marks, performance, and AI-powered analytical reports."
      />

      {/* Quick Generate Buttons */}
      <div className="aura-card p-5">
        <h3 className="text-sm font-bold text-white mb-4">Quick Generate Reports</h3>
        <div className="flex flex-wrap gap-3">
          {["Attendance Report", "Marks Report", "At-Risk Report", "Analytics Report", "Assignment Report"].map((r) => (
            <button key={r} onClick={() => generateReport(r)} className="aura-btn aura-btn-secondary text-xs flex items-center gap-1.5">
              <FileBarChart className="h-3.5 w-3.5 text-cyan-400" />
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="aura-card">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <FileBarChart className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Recent Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Report Title</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Generated On</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {reports.map((r) => (
                <tr key={r._id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4 font-bold text-white">{r.title}</td>
                  <td className="py-3.5 px-4 text-slate-400">{r.course}</td>
                  <td className="py-3.5 px-4">
                    <span className={`font-semibold ${TYPE_COLORS[r.type] || "text-slate-300"}`}>{r.type}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{r.generated}</td>
                  <td className="py-3.5 px-4">
                    <span className={`aura-badge ${r.format === "PDF" ? "aura-badge-danger" : "aura-badge-success"}`}>{r.format}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right flex gap-2 justify-end">
                    <button className="aura-btn aura-btn-secondary py-1 px-2.5 text-[11px]">
                      <Eye className="h-3 w-3 mr-1 inline" /> View
                    </button>
                    <button className="aura-btn aura-btn-primary py-1 px-2.5 text-[11px]">
                      <Download className="h-3 w-3 mr-1 inline" /> Download
                    </button>
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

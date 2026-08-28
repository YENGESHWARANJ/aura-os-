import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { Users, Eye, Search } from "lucide-react";

const DEMO_STUDENTS = [
  { _id: "s1", rollNo: "22AI701", name: "Alex Johnson", course: "Ethics and AI", section: "Sec A", attendance: 68, cgpa: 7.2, risk: "High" },
  { _id: "s2", rollNo: "22AI702", name: "Anjali Reddy", course: "Machine Learning", section: "Sec B", attendance: 88, cgpa: 8.6, risk: "Low" },
  { _id: "s3", rollNo: "22AI703", name: "Brian Thomas", course: "Data Science", section: "Sec A", attendance: 91, cgpa: 9.1, risk: "Low" },
  { _id: "s4", rollNo: "22AI704", name: "Rahul Kumar", course: "Machine Learning", section: "Sec B", attendance: 72, cgpa: 6.9, risk: "Medium" },
  { _id: "s5", rollNo: "22AI705", name: "Priya S", course: "NLP", section: "Sec C", attendance: 76, cgpa: 7.8, risk: "Medium" },
  { _id: "s6", rollNo: "22AI706", name: "Ananya Sharma", course: "Ethics and AI", section: "Sec A", attendance: 94, cgpa: 9.4, risk: "Low" },
  { _id: "s7", rollNo: "22AI707", name: "Karthik Raja", course: "Machine Learning", section: "Sec B", attendance: 88, cgpa: 8.2, risk: "Low" },
  { _id: "s8", rollNo: "22AI708", name: "Meera Nair", course: "Data Science", section: "Sec A", attendance: 82, cgpa: 8.0, risk: "Low" },
];

const RISK_COLORS = { High: "aura-badge-danger", Medium: "aura-badge-warning", Low: "aura-badge-success" };

export default function Students() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");

  const students = DEMO_STUDENTS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.includes(search);
    const matchCourse = courseFilter === "All" || s.course === courseFilter;
    return matchSearch && matchCourse;
  });

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="My Students"
        description="View and manage all students enrolled in your courses and sections."
      />

      {/* Filters */}
      <div className="aura-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="aura-input pl-9 text-xs"
            placeholder="Search by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="aura-select text-xs">
          <option value="All">All Courses</option>
          <option>Ethics and AI</option>
          <option>Machine Learning</option>
          <option>Data Science</option>
          <option>Natural Language Processing</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: DEMO_STUDENTS.length, color: "text-cyan-400" },
          { label: "On Track", value: DEMO_STUDENTS.filter(s => s.risk === "Low").length, color: "text-emerald-400" },
          { label: "At Risk", value: DEMO_STUDENTS.filter(s => s.risk === "Medium").length, color: "text-amber-400" },
          { label: "High Risk", value: DEMO_STUDENTS.filter(s => s.risk === "High").length, color: "text-rose-400" },
        ].map((s) => (
          <div key={s.label} className="aura-card p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Students Table */}
      <div className="aura-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {students.map((s) => (
                <tr key={s._id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-400">{s.rollNo}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{s.name}</td>
                  <td className="py-3.5 px-4 text-slate-400">{s.course}</td>
                  <td className="py-3.5 px-4 text-slate-400">{s.section}</td>
                  <td className="py-3.5 px-4 font-extrabold">
                    <span className={s.attendance < 75 ? "text-rose-400" : "text-emerald-400"}>{s.attendance}%</span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-cyan-400">{s.cgpa}</td>
                  <td className="py-3.5 px-4">
                    <span className={`aura-badge ${RISK_COLORS[s.risk]}`}>{s.risk === "Low" ? "On Track" : s.risk + " Risk"}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="aura-btn aura-btn-secondary py-1 px-2.5 text-[11px]">
                      <Eye className="h-3 w-3 mr-1 inline" /> Profile
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 text-xs">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

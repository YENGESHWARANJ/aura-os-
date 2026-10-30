import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { Users, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { SAMPLE_STUDENTS, getRiskBadgeClass } from "../../data/mockStudents";

export default function Students() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = SAMPLE_STUDENTS.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === "All" || s.course === courseFilter;
    return matchSearch && matchCourse;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStudents = filtered.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="My Students"
        description="View and manage all 50 cohort students enrolled in your courses and sections."
        actions={
          <span className="aura-badge aura-badge-neutral py-1.5 px-3">
            <Users className="h-3.5 w-3.5 mr-1 inline text-cyan-400" />
            {filtered.length} Students Listed
          </span>
        }
      />

      {/* Filters */}
      <div className="aura-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="aura-input pl-9 text-xs"
            placeholder="Search by name, roll number, or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => {
            setCourseFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="aura-select text-xs"
        >
          <option value="All">All Courses (50 Students)</option>
          <option>Ethics and AI</option>
          <option>Machine Learning</option>
          <option>Data Science</option>
          <option>Natural Language Processing</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Cohort", value: SAMPLE_STUDENTS.length, color: "text-cyan-400" },
          { label: "On Track", value: SAMPLE_STUDENTS.filter((s) => s.risk === "Low").length, color: "text-emerald-400" },
          { label: "At Risk (Med/High)", value: SAMPLE_STUDENTS.filter((s) => s.risk === "Medium" || s.risk === "High").length, color: "text-amber-400" },
          { label: "Critical Risk", value: SAMPLE_STUDENTS.filter((s) => s.risk === "Critical").length, color: "text-rose-400" },
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
              {paginatedStudents.map((s) => (
                <tr key={s._id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-400">{s.rollNo}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{s.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{s.email}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{s.course}</td>
                  <td className="py-3.5 px-4 text-slate-400">{s.section}</td>
                  <td className="py-3.5 px-4 font-extrabold">
                    <span className={s.attendance < 75 ? "text-rose-400" : "text-emerald-400"}>{s.attendance}%</span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-cyan-400">{s.cgpa}</td>
                  <td className="py-3.5 px-4">
                    <span className={`aura-badge ${getRiskBadgeClass(s.risk)}`}>
                      {s.risk === "Low" ? "On Track" : s.risk + " Risk"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="aura-btn aura-btn-secondary py-1 px-2.5 text-[11px]">
                      <Eye className="h-3 w-3 mr-1 inline text-cyan-400" /> Profile
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedStudents.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 text-xs">No students found matching your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filtered.length > pageSize && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filtered.length)} of {filtered.length} students
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="aura-btn aura-btn-secondary py-1 px-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5 inline mr-0.5" /> Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      currentPage === page
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "hover:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="aura-btn aura-btn-secondary py-1 px-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="h-3.5 w-3.5 inline ml-0.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

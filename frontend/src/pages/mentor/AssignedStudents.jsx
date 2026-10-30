import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMentorAssignedStudents } from "../../services/mentor/mentorApi";
import PageHeader from "../../components/ui/PageHeader";
import { Search, Filter, Users, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { SAMPLE_STUDENTS } from "../../data/mockStudents";

export default function AssignedStudents() {
  const [students, setStudents] = useState(SAMPLE_STUDENTS);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getMentorAssignedStudents();
        if (response?.data?.data?.length) {
          setStudents(response.data.data);
        }
      } catch {
        // Fallback to SAMPLE_STUDENTS (50 students)
        setStudents(SAMPLE_STUDENTS);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter((st) => {
    const matchSearch =
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      (st.email && st.email.toLowerCase().includes(search.toLowerCase())) ||
      (st.rollNo && st.rollNo.toLowerCase().includes(search.toLowerCase()));
    
    const riskStatus = st.risk === "Low" ? "Safe" : st.risk || "Safe";
    const matchRisk = riskFilter === "All" || riskStatus === riskFilter;
    return matchSearch && matchRisk;
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
        eyebrow="Mentor Portal"
        title="My Assigned Students"
        description="Comprehensive list of all 50 cohort students assigned under your mentorship for Semester 7."
        actions={
          <span className="aura-badge aura-badge-neutral py-1.5 px-3">
            <Users className="h-3.5 w-3.5 mr-1 inline text-cyan-400" />
            {filtered.length} Students Listed
          </span>
        }
      />

      {/* Filter Controls */}
      <div className="aura-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student name, email, or roll no..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="aura-input pl-9 text-xs py-2"
          />
        </div>

        {/* Risk Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          {["All", "Critical", "High", "Medium", "Safe"].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRiskFilter(r);
                setCurrentPage(1);
              }}
              className={`aura-tab ${riskFilter === r ? "active" : ""}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="aura-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Risk Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {paginatedStudents.length ? (
                paginatedStudents.map((st) => {
                  const riskLevel = st.risk === "Low" ? "Safe" : st.risk || "Safe";
                  return (
                    <tr key={st._id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-400">{st.rollNo}</td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {st.name}
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {st.department || "AI & Data Science"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{st.email}</td>
                      <td className="py-3.5 px-4 text-slate-300">{st.semester || "Sem 7"}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{st.cgpa ?? "8.1"}</td>
                      <td className="py-3.5 px-4 font-extrabold">
                        <span className={(st.attendance ?? 84) < 75 ? "text-rose-400" : "text-emerald-400"}>
                          {st.attendance ?? 84}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`aura-badge ${
                            riskLevel === "Critical"
                              ? "aura-badge-danger"
                              : riskLevel === "High" || riskLevel === "Medium"
                              ? "aura-badge-warning"
                              : "aura-badge-success"
                          }`}
                        >
                          {riskLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/mentor/student/${st._id}`}
                          className="aura-btn aura-btn-secondary py-1.5 px-3 text-xs inline-flex items-center gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5 text-cyan-400" />
                          View Progress
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No assigned students match your filter.
                  </td>
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

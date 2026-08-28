import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMentorAssignedStudents } from "../../services/mentor/mentorApi";
import PageHeader from "../../components/ui/PageHeader";
import { Search, Filter, Users, UserCheck, Eye, MessageSquare } from "lucide-react";

const DEMO_STUDENTS = [
  { _id: "s1", name: "Alex Johnson", email: "alex@aura.edu", semester: "Sem 7", cgpa: 6.9, attendance: 68, risk: "Critical", department: "AI & Data Science" },
  { _id: "s2", name: "Rahul Kumar", email: "rahul@aura.edu", semester: "Sem 7", cgpa: 7.1, attendance: 72, risk: "High", department: "AI & Data Science" },
  { _id: "s3", name: "Priya S", email: "priya@aura.edu", semester: "Sem 7", cgpa: 7.8, attendance: 76, risk: "Medium", department: "AI & Data Science" },
  { _id: "s4", name: "Ananya Sharma", email: "ananya@aura.edu", semester: "Sem 7", cgpa: 9.1, attendance: 94, risk: "Safe", department: "AI & Data Science" },
  { _id: "s5", name: "Karthik Raja", email: "karthik@aura.edu", semester: "Sem 7", cgpa: 8.5, attendance: 88, risk: "Safe", department: "AI & Data Science" },
];

export default function AssignedStudents() {
  const [students, setStudents] = useState(DEMO_STUDENTS);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getMentorAssignedStudents();
        if (response?.data?.data?.length) {
          setStudents(response.data.data);
        }
      } catch {
        // Fallback demo students loaded
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter((st) => {
    const matchSearch =
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      st.email.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "All" || (st.risk || "Safe") === riskFilter;
    return matchSearch && matchRisk;
  });

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Mentor Portal"
        title="My Assigned Students"
        description="Comprehensive list of students assigned under your mentorship for Semester 7."
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
            placeholder="Search student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="aura-input pl-9 text-xs py-2"
          />
        </div>

        {/* Risk Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          {["All", "Critical", "High", "Medium", "Safe"].map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
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
              {filtered.length ? (
                filtered.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {st.name}
                      <span className="block text-[10px] text-slate-500 font-normal">{st.department || "AI & Data Science"}</span>
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
                          st.risk === "Critical"
                            ? "aura-badge-danger"
                            : st.risk === "High" || st.risk === "Medium"
                            ? "aura-badge-warning"
                            : "aura-badge-success"
                        }`}
                      >
                        {st.risk || "Safe"}
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No assigned students match your filter.
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

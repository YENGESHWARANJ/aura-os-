import { useState, useMemo } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { UserCheck, Save, CheckSquare, Square, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { SAMPLE_STUDENTS } from "../../data/mockStudents";

export default function FacultyAttendance() {
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [attendanceState, setAttendanceState] = useState(() =>
    SAMPLE_STUDENTS.reduce((acc, s) => {
      acc[s._id] = s.present ?? true;
      return acc;
    }, {})
  );

  const displayedStudents = useMemo(() => {
    return SAMPLE_STUDENTS.filter((s) => {
      const matchCourse = selectedCourse === "All" || s.course === selectedCourse;
      const matchSection = selectedSection === "All" || s.section === selectedSection;
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase());
      return matchCourse && matchSection && matchSearch;
    });
  }, [selectedCourse, selectedSection, search]);

  const togglePresence = (id) => {
    setAttendanceState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const markAllPresent = () => {
    setAttendanceState((prev) => {
      const updated = { ...prev };
      displayedStudents.forEach((s) => {
        updated[s._id] = true;
      });
      return updated;
    });
    toast.success(`Marked all ${displayedStudents.length} students as Present.`);
  };

  const saveAttendance = () => {
    const presentCount = displayedStudents.filter((s) => attendanceState[s._id]).length;
    toast.success(
      `Attendance saved for ${selectedDate}: ${presentCount}/${displayedStudents.length} present.`
    );
  };

  const presentCount = displayedStudents.filter((s) => attendanceState[s._id]).length;
  const absentCount = displayedStudents.length - presentCount;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Attendance Management"
        description="Mark and manage daily class attendance for your 50 cohort students."
        actions={
          <div className="flex gap-2">
            <button onClick={markAllPresent} className="aura-btn aura-btn-secondary text-xs py-1.5 px-3">
              <CheckSquare className="h-3.5 w-3.5 mr-1 inline text-emerald-400" />
              Mark All Present
            </button>
            <button onClick={saveAttendance} className="aura-btn aura-btn-primary text-xs py-1.5 px-3">
              <Save className="h-3.5 w-3.5 mr-1 inline" />
              Save Attendance
            </button>
          </div>
        }
      />

      {/* Session Controls */}
      <div className="aura-card p-4 grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="aura-select text-xs"
          >
            <option value="All">All Courses ({SAMPLE_STUDENTS.length})</option>
            <option>Ethics and AI</option>
            <option>Machine Learning</option>
            <option>Data Science</option>
            <option>Natural Language Processing</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="aura-select text-xs"
          >
            <option value="All">All Sections</option>
            <option>Sec A</option>
            <option>Sec B</option>
            <option>Sec C</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="aura-input text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Search Student</label>
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Name or Roll No..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="aura-input pl-8 text-xs py-2"
            />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1 p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
            <span className="text-[10px] font-bold uppercase text-emerald-400">Present</span>
            <p className="text-xl font-extrabold text-emerald-400">{presentCount}</p>
          </div>
          <div className="flex-1 p-2 rounded-xl bg-rose-950/30 border border-rose-500/30 text-center">
            <span className="text-[10px] font-bold uppercase text-rose-400">Absent</span>
            <p className="text-xl font-extrabold text-rose-400">{absentCount}</p>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="aura-card">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 z-10">
              <tr className="text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Course & Section</th>
                <th className="py-3 px-4">Overall Attendance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Mark Today</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {displayedStudents.map((st) => {
                const isPresent = !!attendanceState[st._id];
                return (
                  <tr key={st._id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-400">{st.rollNo}</td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {st.name}
                      <span className="block text-[10px] text-slate-500 font-mono">{st.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {st.course} <span className="text-slate-500 font-semibold">({st.section})</span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold">
                      <span className={st.attendance < 75 ? "text-rose-400" : "text-emerald-400"}>
                        {st.attendance}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`aura-badge ${
                          st.attendance < 75 ? "aura-badge-danger" : "aura-badge-success"
                        }`}
                      >
                        {st.attendance < 75 ? "At Risk" : "Regular"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => togglePresence(st._id)}
                        className="focus:outline-none p-1 hover:scale-110 transition"
                      >
                        {isPresent ? (
                          <CheckSquare className="h-5 w-5 text-emerald-400 mx-auto" />
                        ) : (
                          <Square className="h-5 w-5 text-slate-500 mx-auto" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {displayedStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
          <span>Showing {displayedStudents.length} of {SAMPLE_STUDENTS.length} total students</span>
          <span>Click checkboxes to toggle individual attendance status</span>
        </div>
      </div>
    </div>
  );
}

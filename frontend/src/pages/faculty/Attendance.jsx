import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { UserCheck, Save, CheckSquare, Square } from "lucide-react";
import { toast } from "react-hot-toast";

const DEMO_STUDENTS = [
  { _id: "s1", rollNo: "22AI701", name: "Alex Johnson", attendance: 68, present: false },
  { _id: "s2", rollNo: "22AI704", name: "Rahul Kumar", attendance: 72, present: false },
  { _id: "s3", rollNo: "22AI706", name: "Priya S", attendance: 76, present: true },
  { _id: "s4", rollNo: "22AI710", name: "Ananya Sharma", attendance: 94, present: true },
  { _id: "s5", rollNo: "22AI712", name: "Karthik Raja", attendance: 88, present: true },
  { _id: "s6", rollNo: "22AI715", name: "Meera Nair", attendance: 82, present: true },
];

export default function FacultyAttendance() {
  const [selectedCourse, setSelectedCourse] = useState("Ethics and AI");
  const [selectedSection, setSelectedSection] = useState("Sec A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState(DEMO_STUDENTS);

  const togglePresence = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, present: !s.present } : s))
    );
  };

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, present: true })));
    toast.success("All students marked as Present.");
  };

  const saveAttendance = () => {
    const presentCount = students.filter((s) => s.present).length;
    toast.success(`Attendance saved: ${presentCount}/${students.length} present.`);
  };

  const presentCount = students.filter((s) => s.present).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Attendance Management"
        description="Mark and manage daily class attendance for your assigned sections."
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
      <div className="aura-card p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Course</label>
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="aura-select text-xs">
            <option>Ethics and AI</option>
            <option>Machine Learning</option>
            <option>Data Science</option>
            <option>Natural Language Processing</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
          <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="aura-select text-xs">
            <option>Sec A</option>
            <option>Sec B</option>
            <option>Sec C</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="aura-input text-xs" />
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
            <span className="text-[10px] font-bold uppercase text-emerald-400">Present</span>
            <p className="text-xl font-extrabold text-emerald-400">{presentCount}</p>
          </div>
          <div className="flex-1 p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-center">
            <span className="text-[10px] font-bold uppercase text-rose-400">Absent</span>
            <p className="text-xl font-extrabold text-rose-400">{absentCount}</p>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="aura-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Overall Attendance %</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Mark Today</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {students.map((st) => (
                <tr key={st._id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-400">{st.rollNo}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{st.name}</td>
                  <td className="py-3.5 px-4 font-extrabold">
                    <span className={st.attendance < 75 ? "text-rose-400" : "text-emerald-400"}>{st.attendance}%</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`aura-badge ${st.attendance < 75 ? "aura-badge-danger" : "aura-badge-success"}`}>
                      {st.attendance < 75 ? "At Risk" : "Regular"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button onClick={() => togglePresence(st._id)} className="focus:outline-none">
                      {st.present ? (
                        <CheckSquare className="h-5 w-5 text-emerald-400 mx-auto" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-500 mx-auto" />
                      )}
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

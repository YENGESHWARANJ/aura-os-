import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { Award, Save, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

const DEMO_STUDENTS = [
  { _id: "s1", rollNo: "22AI701", name: "Alex Johnson", internal: 68, mid: 30, final: 58 },
  { _id: "s2", rollNo: "22AI704", name: "Rahul Kumar", internal: 72, mid: 32, final: 62 },
  { _id: "s3", rollNo: "22AI706", name: "Priya S", internal: 76, mid: 34, final: 68 },
  { _id: "s4", rollNo: "22AI710", name: "Ananya Sharma", internal: 94, mid: 45, final: 85 },
  { _id: "s5", rollNo: "22AI712", name: "Karthik Raja", internal: 88, mid: 42, final: 78 },
  { _id: "s6", rollNo: "22AI715", name: "Meera Nair", internal: 82, mid: 38, final: 71 },
];

export default function Marks() {
  const [students, setStudents] = useState(DEMO_STUDENTS);
  const [selectedCourse, setSelectedCourse] = useState("Ethics and AI");
  const [selectedSection, setSelectedSection] = useState("Sec A");

  const updateMark = (id, field, value) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, [field]: Number(value) } : s))
    );
  };

  const totalMark = (s) => ((s.internal * 0.4 + s.mid * 0.2 + s.final * 0.4)).toFixed(1);
  const grade = (total) => {
    if (total >= 90) return { g: "S", c: "text-emerald-400" };
    if (total >= 80) return { g: "A+", c: "text-cyan-400" };
    if (total >= 70) return { g: "A", c: "text-blue-400" };
    if (total >= 60) return { g: "B+", c: "text-purple-400" };
    if (total >= 50) return { g: "B", c: "text-amber-400" };
    return { g: "F", c: "text-rose-400" };
  };

  const saveMarks = () => toast.success("Marks saved successfully!");

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Marks Management"
        description="Enter and manage internal, mid-semester, and final examination marks."
        actions={
          <button onClick={saveMarks} className="aura-btn aura-btn-primary text-xs flex items-center gap-1.5">
            <Save className="h-3.5 w-3.5" />
            Save Marks
          </button>
        }
      />

      {/* Filter Row */}
      <div className="aura-card p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
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
            <option>Sec A</option><option>Sec B</option><option>Sec C</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Assessment</label>
          <select className="aura-select text-xs">
            <option>All Components</option>
            <option>Internal (40%)</option>
            <option>Mid-Semester (20%)</option>
            <option>End-Semester (40%)</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[11px] font-semibold text-slate-400">
        <span>IA = Internal Assessment (max 100)</span>
        <span>·</span>
        <span>MID = Mid-Semester (max 50)</span>
        <span>·</span>
        <span>FINAL = End-Semester (max 100)</span>
      </div>

      {/* Marks Table */}
      <div className="aura-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Internal (IA)</th>
                <th className="py-3 px-4">Mid-Sem</th>
                <th className="py-3 px-4">End-Sem</th>
                <th className="py-3 px-4">Total Score</th>
                <th className="py-3 px-4 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {students.map((s) => {
                const total = parseFloat(totalMark(s));
                const { g, c } = grade(total);
                return (
                  <tr key={s._id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-400">{s.rollNo}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{s.name}</td>
                    <td className="py-3.5 px-4">
                      <input type="number" min="0" max="100" value={s.internal} onChange={(e) => updateMark(s._id, "internal", e.target.value)} className="aura-input text-xs w-20" />
                    </td>
                    <td className="py-3.5 px-4">
                      <input type="number" min="0" max="50" value={s.mid} onChange={(e) => updateMark(s._id, "mid", e.target.value)} className="aura-input text-xs w-20" />
                    </td>
                    <td className="py-3.5 px-4">
                      <input type="number" min="0" max="100" value={s.final} onChange={(e) => updateMark(s._id, "final", e.target.value)} className="aura-input text-xs w-20" />
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-white text-sm">{total}</td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-base">
                      <span className={c}>{g}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

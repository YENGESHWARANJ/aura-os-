import { useState, useMemo } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { Award, Save, Upload, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { SAMPLE_STUDENTS } from "../../data/mockStudents";

export default function Marks() {
  const [studentsMarks, setStudentsMarks] = useState(() =>
    SAMPLE_STUDENTS.map((s) => ({
      _id: s._id,
      rollNo: s.rollNo,
      name: s.name,
      course: s.course,
      section: s.section,
      internal: s.internal ?? 75,
      mid: s.mid ?? 35,
      final: s.final ?? 75,
    }))
  );

  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [search, setSearch] = useState("");

  const updateMark = (id, field, value) => {
    setStudentsMarks((prev) =>
      prev.map((s) => (s._id === id ? { ...s, [field]: Number(value) } : s))
    );
  };

  const displayedStudents = useMemo(() => {
    return studentsMarks.filter((s) => {
      const matchCourse = selectedCourse === "All" || s.course === selectedCourse;
      const matchSection = selectedSection === "All" || s.section === selectedSection;
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase());
      return matchCourse && matchSection && matchSearch;
    });
  }, [studentsMarks, selectedCourse, selectedSection, search]);

  const totalMark = (s) => (s.internal * 0.4 + s.mid * 0.2 + s.final * 0.4).toFixed(1);

  const grade = (total) => {
    if (total >= 90) return { g: "S", c: "text-emerald-400" };
    if (total >= 80) return { g: "A+", c: "text-cyan-400" };
    if (total >= 70) return { g: "A", c: "text-blue-400" };
    if (total >= 60) return { g: "B+", c: "text-purple-400" };
    if (total >= 50) return { g: "B", c: "text-amber-400" };
    return { g: "F", c: "text-rose-400" };
  };

  const saveMarks = () => toast.success(`Marks saved successfully for ${displayedStudents.length} students!`);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Marks Management"
        description="Enter and manage internal, mid-semester, and final examination marks for all 50 students."
        actions={
          <button onClick={saveMarks} className="aura-btn aura-btn-primary text-xs flex items-center gap-1.5">
            <Save className="h-3.5 w-3.5" />
            Save All Marks
          </button>
        }
      />

      {/* Filter Row */}
      <div className="aura-card p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="aura-select text-xs"
          >
            <option value="All">All Courses ({SAMPLE_STUDENTS.length} Students)</option>
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
          <label className="block text-xs font-semibold text-slate-300 mb-1">Search Student</label>
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name or roll no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="aura-input pl-8 text-xs py-2"
            />
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Filter Count</span>
            <p className="text-base font-extrabold text-white">{displayedStudents.length} Students</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-slate-400">
        <span>IA = Internal Assessment (weight 40%)</span>
        <span>·</span>
        <span>MID = Mid-Semester (weight 20%)</span>
        <span>·</span>
        <span>FINAL = End-Semester (weight 40%)</span>
      </div>

      {/* Marks Table */}
      <div className="aura-card">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 z-10">
              <tr className="text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Internal (40%)</th>
                <th className="py-3 px-4">Mid-Sem (20%)</th>
                <th className="py-3 px-4">End-Sem (40%)</th>
                <th className="py-3 px-4">Total Score</th>
                <th className="py-3 px-4 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {displayedStudents.map((s) => {
                const total = parseFloat(totalMark(s));
                const { g, c } = grade(total);
                return (
                  <tr key={s._id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-400">{s.rollNo}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{s.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{s.course}</td>
                    <td className="py-3.5 px-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.internal}
                        onChange={(e) => updateMark(s._id, "internal", e.target.value)}
                        className="aura-input text-xs w-20 py-1"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={s.mid}
                        onChange={(e) => updateMark(s._id, "mid", e.target.value)}
                        className="aura-input text-xs w-20 py-1"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.final}
                        onChange={(e) => updateMark(s._id, "final", e.target.value)}
                        className="aura-input text-xs w-20 py-1"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-white text-sm">{total}</td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-base">
                      <span className={c}>{g}</span>
                    </td>
                  </tr>
                );
              })}
              {displayedStudents.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No students match your filter.
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

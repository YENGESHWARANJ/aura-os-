import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { ClipboardList, Plus, Edit3, Eye } from "lucide-react";

const DEMO_ASSESSMENTS = [
  { _id: "q1", title: "Ethics in AI — Midterm Quiz", course: "Ethics and AI", section: "Sec A", type: "Quiz", date: "2026-08-18", totalMarks: 20, avgScore: 15.4, status: "Completed" },
  { _id: "q2", title: "ML Algorithms Test", course: "Machine Learning", section: "Sec B", type: "Test", date: "2026-08-22", totalMarks: 50, avgScore: null, status: "Upcoming" },
  { _id: "q3", title: "Data Analysis Practical", course: "Data Science", section: "Sec A", type: "Practical", date: "2026-08-15", totalMarks: 30, avgScore: 22.1, status: "Graded" },
  { _id: "q4", title: "NLP Concepts Review", course: "NLP", section: "Sec C", type: "Quiz", date: "2026-08-30", totalMarks: 15, avgScore: null, status: "Upcoming" },
];

export default function Assessments() {
  const [assessments] = useState(DEMO_ASSESSMENTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", course: "", section: "Sec A", type: "Quiz", date: "", totalMarks: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = (e) => {
    e.preventDefault();
    setShowForm(false);
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Assessments & Quizzes"
        description="Create and manage quizzes, tests, and practical assessments for your courses."
        actions={
          <button onClick={() => setShowForm(!showForm)} className="aura-btn aura-btn-primary text-xs flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Create Assessment
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Assessments", value: assessments.length, color: "text-cyan-400" },
          { label: "Completed", value: assessments.filter(a => a.status === "Completed" || a.status === "Graded").length, color: "text-emerald-400" },
          { label: "Upcoming", value: assessments.filter(a => a.status === "Upcoming").length, color: "text-amber-400" },
          { label: "Graded", value: assessments.filter(a => a.status === "Graded").length, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="aura-card p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Create Assessment Form */}
      {showForm && (
        <div className="aura-card border-purple-500/30 bg-purple-950/20">
          <h3 className="text-base font-bold text-white mb-4">New Assessment</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="aura-input text-xs" placeholder="e.g. Midterm Quiz" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Course</label>
              <select name="course" value={form.course} onChange={handleChange} className="aura-select text-xs" required>
                <option value="">Select course...</option>
                <option>Ethics and AI</option>
                <option>Machine Learning</option>
                <option>Data Science</option>
                <option>Natural Language Processing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="aura-select text-xs">
                <option>Quiz</option><option>Test</option><option>Practical</option><option>Viva</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
              <select name="section" value={form.section} onChange={handleChange} className="aura-select text-xs">
                <option>Sec A</option><option>Sec B</option><option>Sec C</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Scheduled Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} className="aura-input text-xs" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Marks</label>
              <input name="totalMarks" type="number" value={form.totalMarks} onChange={handleChange} className="aura-input text-xs" placeholder="e.g. 20" />
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="aura-btn aura-btn-secondary text-xs py-2 px-4">Cancel</button>
              <button type="submit" className="aura-btn aura-btn-primary text-xs py-2 px-4">Create Assessment</button>
            </div>
          </form>
        </div>
      )}

      {/* Assessments List */}
      <div className="aura-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Course · Section</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total Marks</th>
                <th className="py-3 px-4">Avg Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {assessments.map((a) => (
                <tr key={a._id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4 font-bold text-white">{a.title}</td>
                  <td className="py-3.5 px-4 text-slate-400">{a.course} · {a.section}</td>
                  <td className="py-3.5 px-4 text-purple-400">{a.type}</td>
                  <td className="py-3.5 px-4 text-slate-300">{a.date}</td>
                  <td className="py-3.5 px-4 text-slate-300">{a.totalMarks}</td>
                  <td className="py-3.5 px-4 text-cyan-400 font-bold">{a.avgScore ? a.avgScore.toFixed(1) : "—"}</td>
                  <td className="py-3.5 px-4">
                    <span className={`aura-badge ${a.status === "Graded" ? "aura-badge-success" : a.status === "Upcoming" ? "aura-badge-warning" : "aura-badge-info"}`}>{a.status}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="aura-btn aura-btn-secondary py-1 px-2.5 text-[11px]">
                      <Eye className="h-3 w-3 mr-1 inline" /> Results
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

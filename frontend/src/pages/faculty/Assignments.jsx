import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { FileText, Plus, Eye, Edit3, Trash2, Calendar } from "lucide-react";

const DEMO_ASSIGNMENTS = [
  { _id: "a1", title: "Ethics Case Study Report", course: "Ethics and AI", section: "Sec A", dueDate: "2026-08-25", submitted: 38, pending: 14, avgScore: "82%", status: "Active" },
  { _id: "a2", title: "ML Model Implementation", course: "Machine Learning", section: "Sec B", dueDate: "2026-08-28", submitted: 30, pending: 18, avgScore: "N/A", status: "Active" },
  { _id: "a3", title: "Data Cleaning & EDA Report", course: "Data Science", section: "Sec A", dueDate: "2026-08-20", submitted: 50, pending: 0, avgScore: "74%", status: "Graded" },
  { _id: "a4", title: "Transformer Model Analysis", course: "NLP", section: "Sec C", dueDate: "2026-09-02", submitted: 12, pending: 42, avgScore: "N/A", status: "Active" },
];

export default function Assignments() {
  const [assignments] = useState(DEMO_ASSIGNMENTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", course: "", section: "Sec A", description: "", dueDate: "", maxMarks: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePublish = (e) => {
    e.preventDefault();
    setShowForm(false);
    setForm({ title: "", course: "", section: "Sec A", description: "", dueDate: "", maxMarks: "" });
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Assignment Management"
        description="Create, publish, track submissions, and grade assignments across your courses."
        actions={
          <button onClick={() => setShowForm(!showForm)} className="aura-btn aura-btn-primary text-xs flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Create Assignment
          </button>
        }
      />

      {/* Create Assignment Form */}
      {showForm && (
        <div className="aura-card border-blue-500/30 bg-blue-950/20">
          <h3 className="text-base font-bold text-white mb-4">New Assignment</h3>
          <form onSubmit={handlePublish} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assignment Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="aura-input text-xs" placeholder="e.g. Ethics Case Study Report" required />
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
              <select name="section" value={form.section} onChange={handleChange} className="aura-select text-xs">
                <option>Sec A</option><option>Sec B</option><option>Sec C</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
              <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="aura-input text-xs" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Maximum Marks</label>
              <input name="maxMarks" type="number" value={form.maxMarks} onChange={handleChange} className="aura-input text-xs" placeholder="e.g. 50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Submission Type</label>
              <select name="type" className="aura-select text-xs">
                <option>PDF Upload</option><option>Online Text</option><option>Link Submission</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Instructions</label>
              <textarea name="description" rows="3" className="aura-textarea text-xs min-h-[80px]" placeholder="Assignment instructions and evaluation criteria..." />
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="aura-btn aura-btn-secondary text-xs py-2 px-4">Cancel</button>
              <button type="submit" className="aura-btn aura-btn-primary text-xs py-2 px-4">Publish Assignment</button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments Table */}
      <div className="aura-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Assignment Title</th>
                <th className="py-3 px-4">Course & Section</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Pending</th>
                <th className="py-3 px-4">Avg Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {assignments.map((a) => (
                <tr key={a._id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4 font-bold text-white">{a.title}</td>
                  <td className="py-3.5 px-4 text-slate-400">{a.course} · {a.section}</td>
                  <td className="py-3.5 px-4 text-slate-300">{a.dueDate}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">{a.submitted}</td>
                  <td className="py-3.5 px-4 text-rose-400 font-bold">{a.pending}</td>
                  <td className="py-3.5 px-4 text-cyan-400 font-bold">{a.avgScore}</td>
                  <td className="py-3.5 px-4">
                    <span className={`aura-badge ${a.status === "Graded" ? "aura-badge-success" : "aura-badge-info"}`}>{a.status}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="aura-btn aura-btn-secondary py-1 px-2.5 text-[11px]">
                      <Eye className="h-3 w-3 mr-1 inline" /> View
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

import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { BookOpen, Upload, Link, Trash2, Plus, ExternalLink } from "lucide-react";

const DEMO_MATERIALS = [
  { _id: "m1", title: "Introduction to AI Ethics — Lecture Slides", course: "Ethics and AI", type: "Slides", size: "2.4 MB", uploaded: "2026-08-10", url: "#" },
  { _id: "m2", title: "Machine Learning Fundamentals Notes", course: "Machine Learning", type: "PDF", size: "3.8 MB", uploaded: "2026-08-12", url: "#" },
  { _id: "m3", title: "Data Science Python Notebook", course: "Data Science", type: "Notebook", size: "1.1 MB", uploaded: "2026-08-14", url: "#" },
  { _id: "m4", title: "NLP Reference Textbook Chapter 4", course: "NLP", type: "PDF", size: "5.2 MB", uploaded: "2026-08-15", url: "#" },
  { _id: "m5", title: "Bias and Fairness Video Tutorial", course: "Ethics and AI", type: "Video Link", size: "—", uploaded: "2026-08-16", url: "#" },
];

const TYPE_COLORS = {
  Slides: "text-blue-400",
  PDF: "text-rose-400",
  Notebook: "text-amber-400",
  "Video Link": "text-purple-400",
};

export default function Materials() {
  const [materials] = useState(DEMO_MATERIALS);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Course Materials"
        description="Upload and manage lecture slides, notes, notebooks, and reference materials for your courses."
        actions={
          <button onClick={() => setShowForm(!showForm)} className="aura-btn aura-btn-primary text-xs flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Upload Material
          </button>
        }
      />

      {/* Upload Form */}
      {showForm && (
        <div className="aura-card border-cyan-500/30 bg-cyan-950/20">
          <h3 className="text-base font-bold text-white mb-4">Upload New Material</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
              <input className="aura-input text-xs" placeholder="e.g. Lecture 5 — Neural Networks" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Course</label>
              <select className="aura-select text-xs">
                <option>Ethics and AI</option>
                <option>Machine Learning</option>
                <option>Data Science</option>
                <option>Natural Language Processing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Material Type</label>
              <select className="aura-select text-xs">
                <option>PDF</option><option>Slides</option><option>Notebook</option><option>Video Link</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">External URL (optional)</label>
              <input className="aura-input text-xs" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Upload File</label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-cyan-500/50 transition bg-slate-900/40">
                <Upload className="h-6 w-6 text-slate-500 mb-1" />
                <span className="text-xs text-slate-400">Drag & drop or click to upload</span>
                <input type="file" className="hidden" />
              </label>
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="aura-btn aura-btn-secondary text-xs py-2 px-4">Cancel</button>
              <button className="aura-btn aura-btn-primary text-xs py-2 px-4">Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materials.map((m) => (
          <div key={m._id} className="aura-card p-4 flex gap-3 hover:border-slate-600/60 transition">
            <div className="h-10 w-10 rounded-xl bg-slate-800/60 flex items-center justify-center flex-shrink-0">
              <BookOpen className={`h-5 w-5 ${TYPE_COLORS[m.type] || "text-slate-400"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">{m.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{m.course}</p>
              <div className="flex gap-3 mt-2 text-[11px] text-slate-500">
                <span className={`font-semibold ${TYPE_COLORS[m.type] || "text-slate-400"}`}>{m.type}</span>
                <span>·</span>
                <span>{m.size}</span>
                <span>·</span>
                <span>{m.uploaded}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href={m.url} className="h-7 w-7 rounded-lg bg-slate-800/50 flex items-center justify-center hover:bg-cyan-900/40 transition">
                <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
              </a>
              <button className="h-7 w-7 rounded-lg bg-slate-800/50 flex items-center justify-center hover:bg-rose-900/40 transition">
                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { ShieldCheck, Layers, Plus, ExternalLink, FileText, CheckCircle, X } from "lucide-react";

export default function SkillEvidence({ evidence = [], onAddEvidence }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    skillName: "",
    type: "Project",
    title: "",
    description: "",
    url: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.skillName.trim() || !formData.title.trim()) return;
    onAddEvidence(formData);
    setIsModalOpen(false);
    setFormData({ skillName: "", type: "Project", title: "", description: "", url: "" });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" /> Evidence & Verification
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified proof, project artifacts, and code repositories backing your skills
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3.5 py-2 text-xs font-semibold text-white transition shadow-md shadow-emerald-500/20"
        >
          <Plus className="h-4 w-4" /> Add Evidence
        </button>
      </div>

      {evidence.length === 0 ? (
        <div className="text-center p-8 bg-slate-950/60 rounded-xl border border-slate-800">
          <FileText className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No skill evidence added yet</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">Link a project, assignment or repository to verify your skills.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs font-semibold transition"
          >
            + Add First Evidence
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {evidence.map((ev) => (
            <div key={ev._id || ev.title} className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sky-400 text-xs">{ev.skillName}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    ev.verificationStatus === "Faculty Verified" || ev.verificationStatus === "System Verified"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                  }`}>
                    <ShieldCheck className="h-3 w-3" /> {ev.verificationStatus}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm mb-1">{ev.title}</h4>
                <p className="text-[11px] text-slate-400 mb-2">Type: <strong className="text-slate-200">{ev.type}</strong></p>
                {ev.description && <p className="text-slate-400 text-[11px] mb-3 line-clamp-2">{ev.description}</p>}
              </div>

              {ev.url && (
                <div className="pt-2 border-t border-slate-800/80">
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold text-[11px]"
                  >
                    View Evidence <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Evidence Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Add Skill Evidence</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Associated Skill *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React.js"
                  value={formData.skillName}
                  onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Evidence Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
                  >
                    <option value="Project" className="bg-slate-900">Project</option>
                    <option value="Assignment" className="bg-slate-900">Assignment</option>
                    <option value="Assessment" className="bg-slate-900">Assessment</option>
                    <option value="GitHub Repository" className="bg-slate-900">GitHub Repository</option>
                    <option value="Coding Profile" className="bg-slate-900">Coding Profile</option>
                    <option value="Course" className="bg-slate-900">Course</option>
                    <option value="Hackathon" className="bg-slate-900">Hackathon</option>
                    <option value="Internship" className="bg-slate-900">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Title of project or repository"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">URL (GitHub / Project link)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Role played or skills demonstrated..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20"
                >
                  Add Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

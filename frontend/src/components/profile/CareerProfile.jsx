import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, X, Plus } from "lucide-react";

const ROLES = [
  "Software Engineer", "Full Stack Developer", "AI Engineer",
  "Data Scientist", "ML Engineer", "Frontend Developer",
  "Backend Developer", "DevOps Engineer", "Cybersecurity Analyst",
  "Cloud Architect", "Mobile Developer", "Research Scientist",
];

const DOMAINS = [
  "Web Development", "Artificial Intelligence", "Machine Learning",
  "Data Science", "Cloud Computing", "Cybersecurity",
  "Mobile Development", "IoT", "Blockchain", "DevOps",
];

const TECHNOLOGIES = [
  "Python", "JavaScript", "React.js", "Node.js", "MongoDB",
  "TensorFlow", "PyTorch", "Docker", "Kubernetes", "AWS",
  "Flutter", "SQL", "GraphQL", "Redis", "FastAPI",
];

function ChipGroup({ items = [], onRemove, editMode }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
            bg-indigo-500/10 text-indigo-300 border-indigo-500/25`}
        >
          {item}
          {editMode && onRemove && (
            <button onClick={() => onRemove(item)} className="text-indigo-400/60 hover:text-rose-400 transition-colors">
              <X size={10} />
            </button>
          )}
        </span>
      ))}
      {items.length === 0 && !editMode && (
        <span className="text-xs text-slate-600 italic">Not set</span>
      )}
    </div>
  );
}

function TagInput({ options, selected = [], onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const available = options.filter((o) => !selected.includes(o));

  return (
    <div className="relative">
      <ChipGroup items={selected} onRemove={(item) => onChange(selected.filter((s) => s !== item))} editMode />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-2 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        <Plus size={11} /> Add
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 max-h-44 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl z-20">
          {available.length === 0 ? (
            <p className="text-xs text-slate-600 p-3">All options selected</p>
          ) : (
            available.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange([...selected, opt]); setOpen(false); }}
                className="block w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function CareerProfile({ user, editMode, formData, onChange }) {
  if (!editMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 h-full"
      >
        <div className="flex items-center gap-2 mb-5">
          <Briefcase size={16} className="text-emerald-400" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Career Profile</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Career Goal</p>
            <p className="text-sm text-slate-300">{user?.careerGoal || <span className="text-slate-600 italic">Not set</span>}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Preferred Role</p>
            <p className="text-sm text-slate-300">{user?.preferredRole || <span className="text-slate-600 italic">Not set</span>}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Interested Domains</p>
            <ChipGroup items={user?.interestedDomains || []} editMode={false} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Preferred Technologies</p>
            <ChipGroup items={user?.preferredTechnologies || []} editMode={false} />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-indigo-500/20 bg-slate-900 p-5 sm:p-6 h-full ring-1 ring-indigo-500/10"
    >
      <div className="flex items-center gap-2 mb-5">
        <Briefcase size={16} className="text-emerald-400" />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Career Profile</h3>
        <span className="ml-auto text-xs text-indigo-400 font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">Editing</span>
      </div>
      <div className="space-y-5">
        <div>
          <label htmlFor="career-goal" className="text-xs font-medium text-slate-500 block mb-1.5">Career Goal</label>
          <textarea
            id="career-goal"
            rows={2}
            value={formData?.careerGoal || ""}
            onChange={(e) => onChange("careerGoal", e.target.value)}
            placeholder="e.g., Build AI-powered products that solve real-world problems..."
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors resize-none placeholder:text-slate-600"
          />
        </div>
        <div>
          <label htmlFor="pref-role" className="text-xs font-medium text-slate-500 block mb-1.5">Preferred Role</label>
          <select
            id="pref-role"
            value={formData?.preferredRole || ""}
            onChange={(e) => onChange("preferredRole", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">Select preferred role</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">Interested Domains</p>
          <TagInput
            options={DOMAINS}
            selected={formData?.interestedDomains || []}
            onChange={(v) => onChange("interestedDomains", v)}
          />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">Preferred Technologies</p>
          <TagInput
            options={TECHNOLOGIES}
            selected={formData?.preferredTechnologies || []}
            onChange={(v) => onChange("preferredTechnologies", v)}
          />
        </div>
      </div>
    </motion.div>
  );
}

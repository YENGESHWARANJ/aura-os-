import React from "react";
import { motion } from "framer-motion";
import { Zap, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LEVEL_COLORS = {
  Expert: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  Advanced: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  Intermediate: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Beginner: "bg-slate-500/15 text-slate-400 border-slate-600/30",
};

const CATEGORY_ICONS = {
  "Programming": "💻",
  "Frameworks": "⚙️",
  "Database": "🗄️",
  "AI / ML": "🤖",
  "Tools": "🛠️",
  "Soft Skills": "🤝",
  "Technical": "⚡",
  "Domain Skills": "🎯",
};

export default function SkillsPreview({ skills = [] }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Top Skills</h3>
        </div>
        <button
          onClick={() => navigate("/dashboard/skills")}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          Manage Skills <ChevronRight size={12} />
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
            <Zap size={20} className="text-slate-600" />
          </div>
          <p className="text-sm text-slate-500 mb-1">No skills added yet</p>
          <p className="text-xs text-slate-600 mb-4">Showcase your technical abilities</p>
          <button
            onClick={() => navigate("/dashboard/skills")}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
          >
            <Plus size={12} /> Add Skills
          </button>
        </div>
      ) : (
        <div className="flex-1 space-y-3">
          {skills.map((skill, i) => (
            <motion.div
              key={skill._id || i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className="flex items-center gap-3"
            >
              <span className="text-base shrink-0">
                {CATEGORY_ICONS[skill.category] || "💡"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-200 truncate">{skill.name}</span>
                  <span className={`ml-2 shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${LEVEL_COLORS[skill.proficiencyLevel] || LEVEL_COLORS.Intermediate}`}>
                    {skill.proficiencyLevel}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiencyPercentage || 50}%` }}
                    transition={{ duration: 0.6, delay: 0.05 * i }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"
                  />
                </div>
              </div>
              <span className="shrink-0 text-xs text-slate-500 tabular-nums w-8 text-right">
                {skill.proficiencyPercentage || 50}%
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

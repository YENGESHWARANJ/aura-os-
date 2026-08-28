import React from "react";
import { motion } from "framer-motion";
import { Target, ChevronRight, Plus, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "In Progress": "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Planned: "bg-slate-500/15 text-slate-400 border-slate-600/30",
  Pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const DOMAIN_COLORS = {
  "Web Development": "from-sky-600/20 to-blue-600/10",
  "Artificial Intelligence": "from-purple-600/20 to-indigo-600/10",
  "Machine Learning": "from-indigo-600/20 to-purple-600/10",
  "Data Science": "from-teal-600/20 to-cyan-600/10",
  "Mobile Development": "from-green-600/20 to-emerald-600/10",
  "IoT": "from-orange-600/20 to-amber-600/10",
  "Cyber Security": "from-red-600/20 to-rose-600/10",
  "Cloud Computing": "from-sky-600/20 to-cyan-600/10",
  default: "from-slate-700/40 to-slate-800/20",
};

export default function ProjectsPreview({ projects = [] }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-sky-400" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Featured Projects</h3>
        </div>
        <button
          onClick={() => navigate("/dashboard/projects")}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          View All <ChevronRight size={12} />
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
            <Target size={20} className="text-slate-600" />
          </div>
          <p className="text-sm text-slate-500 mb-1">No projects available</p>
          <p className="text-xs text-slate-600 mb-4">Join a project batch to get started</p>
          <button
            onClick={() => navigate("/dashboard/projects")}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
          >
            <Plus size={12} /> Add Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.slice(0, 3).map((project, i) => {
            const gradClass = DOMAIN_COLORS[project.domain] || DOMAIN_COLORS.default;
            const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES["Planned"];
            return (
              <motion.div
                key={project._id || i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className={`relative rounded-xl border border-slate-800 bg-gradient-to-br ${gradClass} p-4 hover:border-slate-700 transition-colors group cursor-pointer`}
                onClick={() => navigate("/dashboard/projects")}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-200 leading-snug pr-2 line-clamp-2">{project.title}</h4>
                  <span className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${statusStyle}`}>
                    {project.status || "Active"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2 font-medium">{project.domain}</p>
                {project.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{project.description}</p>
                )}
                {project.technologyStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologyStack.slice(0, 3).map((tech, j) => (
                      <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {tech}
                      </span>
                    ))}
                    {project.technologyStack.length > 3 && (
                      <span className="text-[10px] text-slate-600">+{project.technologyStack.length - 3}</span>
                    )}
                  </div>
                )}
                <ExternalLink size={12} className="absolute top-3 right-3 text-slate-700 group-hover:text-slate-500 transition-colors" />
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

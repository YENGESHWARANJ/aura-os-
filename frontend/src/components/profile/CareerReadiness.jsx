import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

function ReadinessBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="text-xs font-bold text-slate-300 tabular-nums">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export default function CareerReadiness({ readiness }) {
  if (!readiness) return null;

  const overallColor =
    readiness.overall >= 75 ? "text-emerald-400" :
    readiness.overall >= 50 ? "text-sky-400" :
    readiness.overall >= 25 ? "text-amber-400" : "text-slate-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-400" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Career Readiness</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Overall</span>
          <span className={`text-lg font-bold ${overallColor}`}>{readiness.overall}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        <ReadinessBar label="Technical Skills" value={readiness.technicalSkills} color="bg-gradient-to-r from-indigo-500 to-sky-500" />
        <ReadinessBar label="Projects" value={readiness.projects} color="bg-gradient-to-r from-sky-500 to-teal-500" />
        <ReadinessBar label="Academic Performance" value={readiness.academicPerformance} color="bg-gradient-to-r from-emerald-500 to-green-500" />
        <ReadinessBar label="Profile Completion" value={readiness.profileCompletion} color="bg-gradient-to-r from-purple-500 to-indigo-500" />
      </div>

      <p className="text-xs text-slate-600 mt-4">
        * Career readiness is calculated deterministically from your skills, projects, CGPA, and profile data.
      </p>
    </motion.div>
  );
}

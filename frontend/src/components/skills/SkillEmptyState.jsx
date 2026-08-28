import React from "react";
import { Award, Plus } from "lucide-react";

export default function SkillEmptyState({ onAddFirstSkill }) {
  return (
    <div className="text-center p-12 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-xl my-6">
      <div className="h-16 w-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mx-auto mb-4 shadow-lg shadow-sky-500/10">
        <Award className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Build your skill profile</h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
        Add your first skill to start tracking your learning progress, career gaps, and academic readiness.
      </p>
      <button
        onClick={onAddFirstSkill}
        className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 px-5 py-3 text-sm font-semibold text-white transition shadow-xl shadow-sky-500/25"
      >
        <Plus className="h-4 w-4" /> + Add First Skill
      </button>
    </div>
  );
}

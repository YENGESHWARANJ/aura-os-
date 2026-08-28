import React, { useState } from "react";
import { X, ShieldCheck, Trash2, Edit3, Award, ExternalLink, Calendar, BookOpen, Layers } from "lucide-react";

export default function SkillDetailsDrawer({ skill, onClose, onEdit, onDelete }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-lg">
                {skill.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{skill.name}</h2>
                <p className="text-xs text-slate-400">{skill.category}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 font-medium">Proficiency</span>
              <p className="text-lg font-bold text-white mt-0.5">{skill.proficiencyPercentage}%</p>
              <span className="text-[11px] text-sky-400 font-medium">{skill.proficiencyLevel}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 font-medium">Target Level</span>
              <p className="text-lg font-bold text-indigo-400 mt-0.5">{skill.targetProficiency || 85}%</p>
              <span className="text-[11px] text-slate-400 font-medium">Target Goal</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase text-slate-500 font-medium">Status</span>
              <p className="text-xs font-semibold text-emerald-400 mt-1">{skill.learningStatus}</p>
              <span className="text-[10px] text-slate-500">{skill.experienceLevel || "1 year"} exp</span>
            </div>
          </div>

          {/* Verification Badge Details */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Verification Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <ShieldCheck className="h-4 w-4" /> {skill.verificationStatus}
              </span>
            </div>
            {skill.verifiedBy && (
              <p className="text-xs text-slate-400 mt-2">
                Verified by <strong className="text-slate-200">{skill.verifiedBy}</strong>
              </p>
            )}
          </div>

          {/* Description */}
          {skill.description && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</h4>
              <p className="text-sm text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                {skill.description}
              </p>
            </div>
          )}

          {/* Linked Evidence */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-sky-400" /> Evidence & References
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <p className="font-semibold text-slate-200">Placement Portal Project</p>
                  <p className="text-slate-500 text-[11px]">Type: Project • Verified</p>
                </div>
                <span className="text-sky-400 text-xs flex items-center gap-1">
                  View <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-4 mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => onEdit(skill)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white px-4 py-2.5 text-xs font-semibold transition shadow-lg shadow-sky-500/20"
          >
            <Edit3 className="h-4 w-4" /> Edit Skill
          </button>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
            title="Remove Skill"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Delete Confirmation Overlay */}
        {showConfirmDelete && (
          <div className="fixed inset-0 z-60 bg-slate-950/90 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2">Remove Skill?</h3>
              <p className="text-xs text-slate-400 mb-6">
                This will remove <strong>{skill.name}</strong> from your skill profile.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmDelete(false);
                    onDelete(skill._id);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition shadow-lg shadow-rose-500/20"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

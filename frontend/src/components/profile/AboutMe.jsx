import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const MAX_CHARS = 500;

export default function AboutMe({ user, editMode, formData, onChange }) {
  const bio = editMode ? (formData?.bio ?? "") : (user?.bio ?? "");
  const remaining = MAX_CHARS - (formData?.bio?.length || 0);

  if (!editMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} className="text-purple-400" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">About Me</h3>
        </div>
        {bio ? (
          <p className="text-sm text-slate-300 leading-relaxed">{bio}</p>
        ) : (
          <p className="text-sm text-slate-600 italic">No bio added yet. Click "Edit Profile" to add your professional summary.</p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-indigo-500/20 bg-slate-900 p-5 sm:p-6 ring-1 ring-indigo-500/10"
    >
      <div className="flex items-center gap-2 mb-4">
        <FileText size={16} className="text-purple-400" />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">About Me</h3>
        <span className="ml-auto text-xs text-indigo-400 font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">Editing</span>
      </div>
      <textarea
        id="pf-bio"
        value={bio}
        onChange={(e) => onChange("bio", e.target.value.slice(0, MAX_CHARS))}
        rows={4}
        placeholder="Write a short professional or academic bio (max 500 characters)..."
        className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors resize-none placeholder:text-slate-600"
      />
      <p className={`text-right text-xs mt-1.5 ${remaining < 50 ? "text-amber-400" : "text-slate-600"}`}>
        {remaining} characters remaining
      </p>
    </motion.div>
  );
}

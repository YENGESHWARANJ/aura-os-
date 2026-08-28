import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Eye, Trash2, RefreshCw, Calendar, File } from "lucide-react";

const BACKEND_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api/v1", "")
  : `${window.location.protocol}//${window.location.hostname}:5000`;

function formatDate(date) {
  if (!date) return null;
  try {
    return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return null; }
}

export default function ResumeCard({ user, onUpload, onDelete }) {
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  const resume = user?.resume;
  const hasResume = !!(resume?.url && resume?.fileName);
  const resumeUrl = hasResume
    ? resume.url.startsWith("http") ? resume.url : `${BACKEND_BASE}${resume.url}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <FileText size={16} className="text-rose-400" />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Resume</h3>
      </div>

      {hasResume ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* File info */}
          <div className="flex items-center gap-3 flex-1 min-w-0 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <div className="shrink-0 h-11 w-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <File size={20} className="text-rose-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{resume.fileName}</p>
              {resume.updatedAt && (
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Calendar size={10} />
                  Updated {formatDate(resume.updatedAt)}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition-colors"
            >
              <Eye size={12} /> View
            </a>
            <button
              onClick={() => replaceInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RefreshCw size={12} /> Replace
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>

          <input
            ref={replaceInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed border-slate-800 bg-slate-800/20 py-10 px-6">
          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
            <FileText size={22} className="text-slate-600" />
          </div>
          <p className="text-sm text-slate-400 font-medium mb-1">No resume uploaded</p>
          <p className="text-xs text-slate-600 mb-4">Upload your resume to complete your career profile</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-900/30"
          >
            <Upload size={14} /> Upload Resume
          </button>
          <p className="text-xs text-slate-600 mt-3">Supported: PDF, DOC, DOCX (max 10MB)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }}
          />
        </div>
      )}
    </motion.div>
  );
}

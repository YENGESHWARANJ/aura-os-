import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Trash2, Upload, User, Star, Building, BookOpen, Hash, Edit3 } from "lucide-react";

const BACKEND_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api/v1", "")
  : `${window.location.protocol}//${window.location.hostname}:5000`;

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getStrengthColor(strength) {
  if (strength === "Excellent") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
  if (strength === "Strong") return "text-sky-400 bg-sky-400/10 border-sky-400/30";
  if (strength === "Intermediate") return "text-amber-400 bg-amber-400/10 border-amber-400/30";
  return "text-slate-400 bg-slate-400/10 border-slate-400/30";
}

function getYearLabel(semester) {
  if (!semester) return null;
  const yr = Math.ceil(semester / 2);
  const suffixes = ["st", "nd", "rd", "th"];
  const suffix = suffixes[Math.min(yr - 1, 3)];
  return `${yr}${suffix} Year`;
}

export default function ProfileHero({ user, completion, editMode, onEditToggle, onCancelEdit, onSaveEdit, onAvatarUpload, onAvatarRemove }) {
  const fileInputRef = useRef(null);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${BACKEND_BASE}${user.avatar}`
    : null;

  const yearLabel = getYearLabel(user?.semester);
  const strengthClass = getStrengthColor(completion?.strength);
  const pct = completion?.percentage ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 sm:p-8 shadow-xl"
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-sky-500/8 blur-2xl" />

      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        {/* Avatar */}
        <div className="relative shrink-0 group">
          <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full ring-4 ring-indigo-500/30 overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-900/40">
            {avatarSrc ? (
              <img src={avatarSrc} alt={user?.name} className="h-full w-full object-cover" />
            ) : (
              <span>{getInitials(user?.name)}</span>
            )}
          </div>
          {/* Camera overlay */}
          <button
            onClick={() => setAvatarMenuOpen((v) => !v)}
            className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Camera size={20} className="text-white" />
          </button>

          {/* Avatar action menu */}
          <AnimatePresence>
            {avatarMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl z-30 overflow-hidden"
              >
                <button
                  onClick={() => { fileInputRef.current?.click(); setAvatarMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <Upload size={14} /> Upload Photo
                </button>
                {user?.avatar && (
                  <button
                    onClick={() => { onAvatarRemove(); setAvatarMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-400 hover:bg-slate-800 transition-colors border-t border-slate-800"
                  >
                    <Trash2 size={14} /> Remove Photo
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) { onAvatarUpload(file); setAvatarMenuOpen(false); }
              e.target.value = "";
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
            {user?.name || "Student"}
          </h1>
          <p className="text-indigo-400 font-medium text-sm">
            {user?.degree || "Degree"} {user?.specialization ? `— ${user.specialization}` : ""}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1 mt-1 text-slate-400 text-sm">
            {user?.college && (
              <span className="flex items-center gap-1.5">
                <Building size={13} className="text-slate-500" />
                {user.college}
              </span>
            )}
            {user?.department && (
              <span className="flex items-center gap-1.5">
                <BookOpen size={13} className="text-slate-500" />
                {user.department}
              </span>
            )}
            {yearLabel && user?.semester && (
              <span className="flex items-center gap-1.5">
                <Star size={13} className="text-slate-500" />
                {yearLabel} · Semester {user.semester}
              </span>
            )}
            {user?.registerNumber && (
              <span className="flex items-center gap-1.5">
                <Hash size={13} className="text-slate-500" />
                {user.registerNumber}
              </span>
            )}
          </div>

          {/* Profile Strength Badge */}
          {completion?.strength && (
            <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${strengthClass}`}>
              <Star size={10} fill="currentColor" />
              {completion.strength} Profile
            </span>
          )}

          {/* Completion Bar */}
          <div className="mt-4 max-w-xs mx-auto sm:mx-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-400">Profile Completion</span>
              <span className="text-xs font-bold text-indigo-400">{pct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="shrink-0">
          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={onCancelEdit}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSaveEdit}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-900/40"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={onEditToggle}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 hover:text-indigo-200 transition-all"
            >
              <Edit3 size={14} />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Hash, Calendar, Lock } from "lucide-react";

const DEGREES = ["B.Tech", "B.E.", "B.Sc", "BCA", "MBA", "M.Tech", "M.Sc", "MCA", "Ph.D"];
const DEPARTMENTS = [
  "Computer Science Engineering",
  "Artificial Intelligence",
  "Information Technology",
  "Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Data Science",
  "Cyber Security",
];

function ViewField({ label, value, icon: Icon, readOnly }) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <div className="mt-0.5 shrink-0 text-slate-600">
        {readOnly ? <Lock size={13} className="text-amber-600/60" /> : <Icon size={14} />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 mb-0.5">
          {label} {readOnly && <span className="text-amber-700/70 text-[10px]">(protected)</span>}
        </p>
        <p className="text-sm text-slate-200 break-words">{value || <span className="text-slate-600 italic">Not set</span>}</p>
      </div>
    </div>
  );
}

function EditInput({ id, label, value, onChange, icon: Icon, children, readOnly }) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <div className="mt-0.5 shrink-0 text-slate-600">
        {readOnly ? <Lock size={13} className="text-amber-600/60" /> : <Icon size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="text-xs font-medium text-slate-500 mb-0.5 block">
          {label} {readOnly && <span className="text-amber-700/70 text-[10px]">(read-only)</span>}
        </label>
        {children ? children : (
          <input
            id={id}
            value={value || ""}
            readOnly={readOnly}
            onChange={(e) => !readOnly && onChange(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-200 outline-none transition-colors ${
              readOnly
                ? "border-slate-800 bg-slate-800/30 text-slate-500 cursor-not-allowed"
                : "border-slate-700 bg-slate-800/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
            }`}
          />
        )}
      </div>
    </div>
  );
}

export default function AcademicInfo({ user, editMode, formData, onChange }) {
  if (!editMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 h-full"
      >
        <div className="flex items-center gap-2 mb-5">
          <GraduationCap size={16} className="text-sky-400" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Academic Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <ViewField label="College / Institution" value={user?.college} icon={BookOpen} />
          <ViewField label="Degree" value={user?.degree} icon={GraduationCap} />
          <ViewField label="Department" value={user?.department} icon={BookOpen} />
          <ViewField label="Specialization" value={user?.specialization} icon={BookOpen} />
          <ViewField label="Register Number" value={user?.registerNumber} icon={Hash} />
          <ViewField label="Batch" value={user?.batch} icon={Calendar} />
          <ViewField label="Current Semester" value={user?.semester} icon={Calendar} />
          <ViewField label="Expected Graduation" value={user?.graduationYear} icon={Calendar} />
          <ViewField label="CGPA" value={user?.cgpa?.toFixed(2)} icon={GraduationCap} readOnly />
          <ViewField label="Attendance" value={user?.attendance ? `${user.attendance}%` : null} icon={BookOpen} readOnly />
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
        <GraduationCap size={16} className="text-sky-400" />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Academic Information</h3>
        <span className="ml-auto text-xs text-indigo-400 font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">Editing</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <EditInput id="ac-college" label="College / Institution" value={formData?.college} onChange={(v) => onChange("college", v)} icon={BookOpen} />
        <EditInput id="ac-degree" label="Degree" value={formData?.degree} onChange={(v) => onChange("degree", v)} icon={GraduationCap}>
          <select
            id="ac-degree"
            value={formData?.degree || ""}
            onChange={(e) => onChange("degree", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">Select degree</option>
            {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </EditInput>
        <EditInput id="ac-dept" label="Department" value={formData?.department} onChange={(v) => onChange("department", v)} icon={BookOpen}>
          <select
            id="ac-dept"
            value={formData?.department || ""}
            onChange={(e) => onChange("department", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </EditInput>
        <EditInput id="ac-spec" label="Specialization" value={formData?.specialization} onChange={(v) => onChange("specialization", v)} icon={BookOpen} />
        <EditInput id="ac-regno" label="Register Number" value={formData?.registerNumber} onChange={(v) => onChange("registerNumber", v)} icon={Hash} />
        <EditInput id="ac-batch" label="Batch (e.g. 2023–2027)" value={formData?.batch} onChange={(v) => onChange("batch", v)} icon={Calendar} />
        <EditInput id="ac-sem" label="Current Semester" value={formData?.semester} onChange={(v) => onChange("semester", Number(v))} icon={Calendar}>
          <select
            id="ac-sem"
            value={formData?.semester || ""}
            onChange={(e) => onChange("semester", Number(e.target.value))}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">Select semester</option>
            {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </EditInput>
        <EditInput id="ac-grad" label="Expected Graduation Year" value={formData?.graduationYear} onChange={(v) => onChange("graduationYear", Number(v))} icon={Calendar} />
        {/* Protected fields */}
        <EditInput id="ac-cgpa" label="CGPA" value={user?.cgpa?.toFixed(2)} icon={GraduationCap} readOnly />
        <EditInput id="ac-att" label="Attendance" value={user?.attendance ? `${user.attendance}%` : ""} icon={BookOpen} readOnly />
      </div>
    </motion.div>
  );
}

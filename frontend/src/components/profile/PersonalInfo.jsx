import React from "react";
import { motion } from "framer-motion";
import { User, Calendar, Phone, Mail, Globe, MapPin } from "lucide-react";

const GENDERS = ["", "Male", "Female", "Non-binary", "Prefer not to say"];
const COUNTRIES = ["India", "USA", "UK", "Canada", "Australia", "Germany", "Other"];

function Field({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <div className="mt-0.5 shrink-0 text-slate-600">
        <Icon size={14} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm text-slate-200 break-words">{value || <span className="text-slate-600 italic">Not set</span>}</p>
      </div>
    </div>
  );
}

function EditField({ label, id, type = "text", value, onChange, icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <div className="mt-0.5 shrink-0 text-slate-600">
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="text-xs font-medium text-slate-500 mb-0.5 block">{label}</label>
        {children ? children : (
          <input
            id={id}
            type={type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors placeholder:text-slate-600"
          />
        )}
      </div>
    </div>
  );
}

export default function PersonalInfo({ user, editMode, formData, onChange }) {
  const formatDob = (dob) => {
    if (!dob) return null;
    try { return new Date(dob).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }); }
    catch { return dob; }
  };

  if (!editMode) {
    return (
      <motion.div
        id="personal-info-section"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 h-full"
      >
        <div className="flex items-center gap-2 mb-5">
          <User size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Field label="Full Name" value={user?.name} icon={User} />
          <Field label="Date of Birth" value={formatDob(user?.dob)} icon={Calendar} />
          <Field label="Gender" value={user?.gender} icon={User} />
          <Field label="Phone Number" value={user?.phone} icon={Phone} />
          <Field label="Email" value={user?.email} icon={Mail} />
          <Field label="Alternate Email" value={user?.alternateEmail} icon={Mail} />
          <Field label="City" value={user?.city} icon={MapPin} />
          <Field label="State" value={user?.state} icon={MapPin} />
          <Field label="Country" value={user?.country} icon={Globe} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      id="personal-info-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-indigo-500/20 bg-slate-900 p-5 sm:p-6 h-full ring-1 ring-indigo-500/10"
    >
      <div className="flex items-center gap-2 mb-5">
        <User size={16} className="text-indigo-400" />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Personal Information</h3>
        <span className="ml-auto text-xs text-indigo-400 font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">Editing</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <EditField id="pf-name" label="Full Name" value={formData?.name} onChange={(v) => onChange("name", v)} icon={User} />
        <EditField id="pf-dob" label="Date of Birth" type="date" value={formData?.dob ? new Date(formData.dob).toISOString().split("T")[0] : ""} onChange={(v) => onChange("dob", v)} icon={Calendar} />
        <EditField id="pf-gender" label="Gender" value={formData?.gender} onChange={(v) => onChange("gender", v)} icon={User}>
          <select
            id="pf-gender"
            value={formData?.gender || ""}
            onChange={(e) => onChange("gender", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
          >
            {GENDERS.map((g) => <option key={g} value={g}>{g || "Select gender"}</option>)}
          </select>
        </EditField>
        <EditField id="pf-phone" label="Phone Number" type="tel" value={formData?.phone} onChange={(v) => onChange("phone", v)} icon={Phone} />
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 shrink-0 text-slate-600"><Mail size={14} /></div>
          <div className="flex-1 min-w-0">
            <label className="text-xs font-medium text-slate-500 mb-0.5 block">Email <span className="text-slate-600">(login email, read-only)</span></label>
            <input value={user?.email || ""} readOnly className="w-full rounded-lg border border-slate-800 bg-slate-800/30 px-3 py-2 text-sm text-slate-500 cursor-not-allowed" />
          </div>
        </div>
        <EditField id="pf-alt-email" label="Alternate Email" type="email" value={formData?.alternateEmail} onChange={(v) => onChange("alternateEmail", v)} icon={Mail} />
        <EditField id="pf-city" label="City" value={formData?.city} onChange={(v) => onChange("city", v)} icon={MapPin} />
        <EditField id="pf-state" label="State" value={formData?.state} onChange={(v) => onChange("state", v)} icon={MapPin} />
        <EditField id="pf-country" label="Country" value={formData?.country} onChange={(v) => onChange("country", v)} icon={Globe}>
          <select
            id="pf-country"
            value={formData?.country || "India"}
            onChange={(e) => onChange("country", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
          >
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </EditField>
      </div>
    </motion.div>
  );
}

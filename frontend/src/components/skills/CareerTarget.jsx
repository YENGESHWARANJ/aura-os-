import React from "react";
import { Briefcase } from "lucide-react";

export const CAREER_ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "AI Engineer",
  "ML Engineer",
  "Mobile App Developer",
  "Cloud Engineer",
  "DevOps Engineer",
  "Cyber Security Engineer",
  "IoT Engineer",
  "Software Engineer"
];

export default function CareerTarget({ selectedRole, onSelectRole }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/10 p-3 border border-indigo-500/30 text-indigo-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Career Target Role
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">{selectedRole}</h3>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Change Target Goal
          </label>
          <select
            value={selectedRole}
            onChange={(e) => onSelectRole(e.target.value)}
            className="w-full sm:w-64 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-200 outline-none focus:border-sky-500 cursor-pointer"
          >
            {CAREER_ROLES.map((role) => (
              <option key={role} value={role} className="bg-slate-900">
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

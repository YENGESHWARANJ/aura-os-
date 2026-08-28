import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Activity, BookOpen, BarChart2 } from "lucide-react";

const Stat = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={`flex flex-col items-center justify-center rounded-2xl border bg-slate-900 p-5 text-center relative overflow-hidden group hover:border-${color}-500/40 transition-colors`}
    style={{ borderColor: "rgb(30 41 59)" }}
  >
    <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-500/10 text-${color}-400`}>
      <Icon size={18} />
    </div>
    <p className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">
      {value !== null && value !== undefined && value !== "" ? value : "--"}
    </p>
  </motion.div>
);

export default function AcademicSummary({ user }) {
  const cgpa = user?.cgpa;
  const attendance = user?.attendance;
  const semester = user?.semester;
  const credits = user?.completedCredits;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Stat
        icon={GraduationCap}
        label="CGPA"
        value={cgpa ? cgpa.toFixed(1) : null}
        color="indigo"
        delay={0.1}
      />
      <Stat
        icon={Activity}
        label="Attendance"
        value={attendance ? `${attendance}%` : null}
        color="emerald"
        delay={0.15}
      />
      <Stat
        icon={BookOpen}
        label="Semester"
        value={semester || null}
        color="sky"
        delay={0.2}
      />
      <Stat
        icon={BarChart2}
        label="Credits"
        value={credits || null}
        color="amber"
        delay={0.25}
      />
    </div>
  );
}

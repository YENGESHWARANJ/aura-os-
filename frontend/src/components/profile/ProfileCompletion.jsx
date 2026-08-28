import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileCompletion({ completion }) {
  const navigate = useNavigate();
  const pct = completion?.percentage ?? 0;
  const missing = completion?.missingChecklist ?? [];
  const strength = completion?.strength ?? "Beginner";

  const strengthColor =
    strength === "Excellent" ? "#10b981" :
    strength === "Strong" ? "#38bdf8" :
    strength === "Intermediate" ? "#f59e0b" : "#64748b";

  // SVG circle props
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 h-full"
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4">Profile Completion</h3>

      <div className="flex items-center gap-5 mb-5">
        {/* Circular progress */}
        <div className="relative shrink-0">
          <svg width={100} height={100} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={radius} fill="none" stroke="#1e293b" strokeWidth={10} />
            <motion.circle
              cx={50} cy={50} r={radius}
              fill="none"
              stroke={strengthColor}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white">{pct}%</span>
            <span className="text-[10px] text-slate-500">{strength}</span>
          </div>
        </div>

        {/* Missing items */}
        {missing.length > 0 ? (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-400 mb-2">Complete your profile</p>
            <ul className="space-y-1.5">
              {missing.slice(0, 4).map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <Circle size={10} className="text-slate-600 shrink-0" />
                  {item}
                </li>
              ))}
              {missing.length > 4 && (
                <li className="text-xs text-slate-500">+{missing.length - 4} more</li>
              )}
            </ul>
          </div>
        ) : (
          <div className="flex-1">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">Profile complete!</span>
            </div>
          </div>
        )}
      </div>

      {missing.length > 0 && (
        <button
          onClick={() => document.getElementById("personal-info-section")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Complete Profile <ArrowRight size={12} />
        </button>
      )}
    </motion.div>
  );
}

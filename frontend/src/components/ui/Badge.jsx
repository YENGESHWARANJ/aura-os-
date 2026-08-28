import React from "react";

export default function Badge({ children, variant = "info", className = "" }) {
  const variantStyles = {
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    danger: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    info: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    neutral: "bg-slate-800/80 border-slate-700/60 text-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold shrink-0 ${
        variantStyles[variant] || variantStyles.info
      } ${className}`}
    >
      {children}
    </span>
  );
}

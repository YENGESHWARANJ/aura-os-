import React from "react";

export function Card({ children, className = "", variant = "standard", onClick, ...props }) {
  const baseStyles = "rounded-2xl border transition-all duration-200 min-w-0";

  const variantStyles = {
    standard: "border-slate-800/80 bg-[#071124] shadow-xl shadow-black/40",
    glass: "border-indigo-500/20 bg-gradient-to-br from-indigo-950/80 via-[#0b1226] to-purple-950/60 shadow-xl backdrop-blur-md",
    gradient: "border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 via-[#071124] to-blue-950/40 shadow-xl",
    interactive: "border-slate-800/80 bg-[#071124] hover:border-slate-700 hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-black/30",
  };

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.standard} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`flex items-center justify-between gap-3 p-5 border-b border-slate-800/60 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-base font-bold text-white tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }) {
  return <p className={`text-xs text-slate-400 mt-0.5 ${className}`}>{children}</p>;
}

export default Card;

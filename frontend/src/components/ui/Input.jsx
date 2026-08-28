import React from "react";

export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  type = "text",
  className = "",
  containerClassName = "",
  ...props
}) {
  return (
    <div className={`space-y-1.5 w-full ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
        )}

        <input
          type={type}
          style={Icon ? { paddingLeft: "2.6rem" } : undefined}
          className={`w-full h-10 px-3.5 rounded-xl border text-xs text-slate-200 bg-[#091224] placeholder:text-slate-500 outline-none transition duration-200 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-50 ${
            error ? "border-rose-500/80 focus:border-rose-500" : "border-slate-800/80"
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-[11px] font-medium text-rose-400 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] font-medium text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}

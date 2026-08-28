import React from "react";
import { FolderOpen } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = "No items found",
  description = "There are no records available for your current filter criteria.",
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-[#071124]/50 ${className}`}
    >
      <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-4 text-cyan-400 mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-400 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

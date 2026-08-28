import React from "react";
import { FolderOpen, RotateCcw } from "lucide-react";

export default function AssignmentEmptyState({ hasFilters, onClearFilters }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center backdrop-blur-xl space-y-4">
      <div className="p-4 rounded-full bg-slate-800/80 text-slate-400 inline-block mx-auto">
        <FolderOpen className="h-10 w-10" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-base font-bold text-white">
          {hasFilters ? "No matching assignments" : "No assignments available"}
        </h3>
        <p className="text-xs text-slate-400">
          {hasFilters
            ? "Try adjusting your search query, status, or filters to find what you are looking for."
            : "Your assignments will appear here when faculty publishes coursework."}
        </p>
      </div>

      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition shadow-lg shadow-sky-600/20"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All Filters
        </button>
      )}
    </div>
  );
}

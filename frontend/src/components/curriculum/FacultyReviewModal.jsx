import React, { useState } from "react";
import { X, CheckCircle, RotateCcw, AlertTriangle, FileText } from "lucide-react";

export default function FacultyReviewModal({
  isOpen,
  onClose,
  suggestion,
  onSubmitReview,
  isSubmitting = false,
}) {
  const [decision, setDecision] = useState("Approved");
  const [feedback, setFeedback] = useState("");

  if (!isOpen || !suggestion) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview({
      suggestionId: suggestion.id,
      decision,
      feedback,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--aura-border)]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[var(--aura-text)]">
                Faculty Curriculum Endorsement
              </h3>
              <p className="text-xs text-[var(--aura-text-muted)]">
                Review and record departmental resolution
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-[var(--aura-surface-2)] flex items-center justify-center text-[var(--aura-text-muted)] hover:text-[var(--aura-text)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)]/50 p-3.5">
            <div className="flex items-center gap-2 font-mono text-cyan-400 font-bold text-[11px]">
              {suggestion.courseCode}
            </div>
            <h4 className="mt-1 font-bold text-[var(--aura-text)] text-sm">
              {suggestion.title}
            </h4>
            <p className="mt-1 text-[var(--aura-text-secondary)] leading-relaxed">
              {suggestion.description}
            </p>
          </div>

          {/* Decision selection */}
          <div>
            <label className="block font-bold text-[var(--aura-text)] mb-2">
              Departmental Decision
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "Approved", label: "Approve Proposal", icon: CheckCircle, color: "text-emerald-400" },
                { val: "Needs Revision", label: "Request Revision", icon: RotateCcw, color: "text-amber-400" },
                { val: "Rejected", label: "Reject Proposal", icon: AlertTriangle, color: "text-rose-400" },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = decision === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setDecision(opt.val)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-center transition ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/10 text-[var(--aura-text)] font-extrabold shadow-sm"
                        : "border-[var(--aura-border)] bg-[var(--aura-surface-2)] text-[var(--aura-text-muted)] hover:text-[var(--aura-text)]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${opt.color}`} />
                    <span className="text-[11px] leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback textarea */}
          <div>
            <label className="block font-bold text-[var(--aura-text)] mb-1.5">
              Reviewer Notes / Academic Council Minutes
            </label>
            <textarea
              required
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Detail reasons, syllabus module mapping, or prerequisites..."
              className="w-full rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] p-3 text-xs text-[var(--aura-text)] placeholder:text-[var(--aura-text-muted)] outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--aura-border)]">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl border border-[var(--aura-border)] text-xs font-semibold text-[var(--aura-text-muted)] hover:text-[var(--aura-text)] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold hover:opacity-90 transition shadow-md"
            >
              {isSubmitting ? "Recording..." : "Submit Academic Decision"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

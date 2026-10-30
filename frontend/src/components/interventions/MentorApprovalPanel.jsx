import React, { useState } from "react";
import { UserCheck, Clock, CheckCircle, RotateCcw, MessageSquare, Send } from "lucide-react";

export default function MentorApprovalPanel({
  isMentor = false,
  approvalStatus = "draft",
  mentorFeedback = {},
  onSubmitPlan,
  onReviewPlan,
  isSubmitting = false,
}) {
  const [comment, setComment] = useState("");

  const statusBadge = {
    draft: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    submitted_to_mentor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    revision_requested: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  }[approvalStatus] || "bg-slate-500/10 text-slate-400 border-slate-500/30";

  const statusLabel = {
    draft: "Draft — Not Submitted",
    submitted_to_mentor: "Under Mentor Review",
    approved: "Mentor Approved Plan",
    revision_requested: "Revision Requested",
  }[approvalStatus] || approvalStatus;

  return (
    <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--aura-border)]/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[var(--aura-text)]">
              Human-in-the-Loop Mentor Governance
            </h3>
            <p className="text-xs text-[var(--aura-text-muted)]">
              Faculty and mentor validation of proposed counterfactual action plan
            </p>
          </div>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold self-start sm:self-auto ${statusBadge}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Existing Feedback Note */}
      {mentorFeedback?.comment && (
        <div className="mt-4 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)]/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--aura-text)]">
            <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
            <span>Mentor Feedback & Notes:</span>
          </div>
          <p className="mt-1.5 text-xs text-[var(--aura-text-secondary)] italic">
            "{mentorFeedback.comment}"
          </p>
          {mentorFeedback.reviewedAt && (
            <span className="mt-2 block text-[10px] text-[var(--aura-text-muted)]">
              Reviewed on {new Date(mentorFeedback.reviewedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Controls based on role */}
      <div className="mt-5 pt-4 border-t border-[var(--aura-border)]/60">
        {!isMentor ? (
          // Student action
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-[var(--aura-text-muted)]">
              Lock in your selected counterfactual scenario bundle and request mentor endorsement.
            </p>
            <button
              type="button"
              onClick={onSubmitPlan}
              disabled={isSubmitting || approvalStatus === "submitted_to_mentor"}
              className={`inline-flex items-center justify-center gap-2 h-10 rounded-xl px-4 text-xs font-bold transition shadow-md ${
                approvalStatus === "submitted_to_mentor"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-default"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>
                {approvalStatus === "submitted_to_mentor"
                  ? "Submitted for Endorsement"
                  : "Submit Plan to Mentor"}
              </span>
            </button>
          </div>
        ) : (
          // Mentor review controls
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--aura-text-secondary)] mb-1.5">
                Mentor Evaluation / Guidance Remarks
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add specific advice, milestone deadlines, or expectations..."
                rows={2}
                className="w-full rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] p-3 text-xs text-[var(--aura-text)] placeholder:text-[var(--aura-text-muted)] outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => onReviewPlan("revision_requested", comment)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 h-9 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 text-xs font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Request Revision</span>
              </button>

              <button
                type="button"
                onClick={() => onReviewPlan("approved", comment)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 h-9 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 text-xs font-bold text-emerald-400 hover:bg-emerald-600 hover:text-white transition shadow-sm"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Approve Action Plan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

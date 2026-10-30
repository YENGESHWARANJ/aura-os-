import React from "react";
import { Lightbulb, FileText, CheckCircle2, Clock, AlertCircle, ArrowUpRight } from "lucide-react";

export default function CurriculumSuggestions({
  suggestions = [],
  onOpenReview,
  isFaculty = false,
}) {
  const getPriorityBadge = (p) => {
    switch (p) {
      case "High":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "under_faculty_review":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-5">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--aura-border)]/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--aura-text)]">
              Curriculum Improvement Proposals & Evidence Base
            </h3>
          </div>
          <p className="text-xs text-[var(--aura-text-muted)] mt-1">
            Actionable revisions supported by exam analytics, survey insights, and hiring signals
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {suggestions.map((sug) => (
          <div
            key={sug.id}
            className="rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)]/30 p-4.5 text-xs transition-colors hover:border-indigo-500/40"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-cyan-400 font-extrabold">{sug.courseCode}</span>
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getPriorityBadge(sug.priority)}`}>
                    {sug.priority} Priority
                  </span>
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(sug.status)}`}>
                    {sug.status.replace(/_/g, " ")}
                  </span>
                </div>
                <h4 className="mt-1.5 text-sm font-bold text-[var(--aura-text)]">
                  {sug.title}
                </h4>
                <p className="mt-1 text-xs text-[var(--aura-text-secondary)] leading-relaxed">
                  {sug.description}
                </p>
              </div>

              {isFaculty && (
                <button
                  type="button"
                  onClick={() => onOpenReview(sug)}
                  className="shrink-0 inline-flex items-center gap-1.5 h-8 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-3 text-xs font-bold text-indigo-400 hover:bg-indigo-600 hover:text-white transition shadow-xs"
                >
                  <span>Review & Endorse</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Evidence pill cards */}
            <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="rounded-lg border border-[var(--aura-border)]/60 bg-[var(--aura-surface)] p-2">
                <span className="text-[10px] text-[var(--aura-text-muted)] block">Cohort Failure Rate</span>
                <span className="font-extrabold text-rose-400">{sug.evidence?.failureRate}%</span>
              </div>
              <div className="rounded-lg border border-[var(--aura-border)]/60 bg-[var(--aura-surface)] p-2">
                <span className="text-[10px] text-[var(--aura-text-muted)] block">Industry Demand</span>
                <span className="font-extrabold text-emerald-400">{sug.evidence?.industryDemandIncrease}</span>
              </div>
              <div className="rounded-lg border border-[var(--aura-border)]/60 bg-[var(--aura-surface)] p-2">
                <span className="text-[10px] text-[var(--aura-text-muted)] block">Job Postings Index</span>
                <span className="font-extrabold text-indigo-400">{sug.evidence?.sampleJobPostingsCount}+ Roles</span>
              </div>
              <div className="rounded-lg border border-[var(--aura-border)]/60 bg-[var(--aura-surface)] p-2">
                <span className="text-[10px] text-[var(--aura-text-muted)] block">Student Sentiment</span>
                <span className="font-semibold text-[var(--aura-text)] truncate block" title={sug.evidence?.studentSurveyGap}>
                  {sug.evidence?.studentSurveyGap}
                </span>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="mt-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-2.5 text-[11px] text-[var(--aura-text)]">
              <span className="font-bold text-indigo-400 mr-1.5">Action Plan:</span>
              {sug.recommendedAction}
            </div>

            {/* Recent Faculty Endorsements */}
            {sug.facultyReviews && sug.facultyReviews.length > 0 && (
              <div className="mt-2.5 pt-2 border-t border-[var(--aura-border)]/40 flex items-center gap-2 text-[11px] text-[var(--aura-text-muted)]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>
                  Endorsed by {sug.facultyReviews[0].reviewerName}: "{sug.facultyReviews[0].feedback}"
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

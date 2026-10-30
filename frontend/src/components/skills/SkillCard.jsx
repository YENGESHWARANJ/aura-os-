import React from "react";
import { CheckCircle2, ShieldCheck, Clock, ExternalLink, Edit3 } from "lucide-react";

export default function SkillCard({ skill, onViewDetails, onEdit }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Verified":
      case "Faculty Verified":
      case "System Verified":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "Proficient":
        return "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30";
      case "Practicing":
        return "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
      case "Needs Improvement":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
      default:
        return "bg-[var(--aura-surface-2)] text-[var(--aura-text-secondary)] border-[var(--aura-border)]";
    }
  };

  const getVerificationIcon = (verifStatus) => {
    if (verifStatus === "Faculty Verified" || verifStatus === "System Verified") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="h-3 w-3" /> ✓ Verified
        </span>
      );
    }
    return null;
  };

  const formattedDate = skill.updatedAt
    ? new Date(skill.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Recently";

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-5 shadow-sm dark:shadow-slate-950/20 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-md">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[var(--aura-text)] tracking-tight">{skill.name}</h3>
              {getVerificationIcon(skill.verificationStatus)}
            </div>
            <p className="text-xs text-[var(--aura-text-muted)] mt-0.5">{skill.category}</p>
          </div>
          <span className="shrink-0 text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
            {skill.proficiencyLevel}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[var(--aura-text-muted)] font-medium">Proficiency</span>
            <span className="font-bold text-[var(--aura-text)]">{skill.proficiencyPercentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--aura-surface-2)] overflow-hidden p-0.5 border border-[var(--aura-border)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, skill.proficiencyPercentage))}%` }}
            />
          </div>
        </div>

        {/* Badges & Meta */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4 bg-[var(--aura-surface-2)] p-2.5 rounded-xl border border-[var(--aura-border)]">
          <div>
            <span className="text-[var(--aura-text-muted)] block text-[10px] font-bold uppercase tracking-wider">Evidence</span>
            <span className="font-bold text-[var(--aura-text)]">{skill.evidenceCount || 0} items</span>
          </div>
          <div>
            <span className="text-[var(--aura-text-muted)] block text-[10px] font-bold uppercase tracking-wider">Projects</span>
            <span className="font-bold text-[var(--aura-text)]">{skill.relatedProjects?.length || (skill.evidenceCount ? 1 : 0)} linked</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[var(--aura-text-muted)] mb-4">
          <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold ${getStatusBadge(skill.learningStatus)}`}>
            {skill.learningStatus}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Clock className="h-3 w-3" /> {formattedDate}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-[var(--aura-border)]">
        <button
          onClick={() => onViewDetails(skill)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--aura-surface-2)] hover:bg-[var(--aura-border)] border border-[var(--aura-border)] px-3 py-2 text-xs font-bold text-[var(--aura-text)] transition cursor-pointer"
        >
          <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
          View Details
        </button>
        <button
          onClick={() => onEdit(skill)}
          className="inline-flex items-center justify-center p-2 rounded-xl bg-[var(--aura-surface-2)] hover:bg-[var(--aura-border)] border border-[var(--aura-border)] text-[var(--aura-text-muted)] hover:text-[var(--aura-text)] transition cursor-pointer"
          title="Edit Skill"
        >
          <Edit3 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

import React from "react";
import {
  ShieldCheck,
  Clock,
  XCircle,
  QrCode,
  Sliders,
  History,
  CheckCircle2,
  ExternalLink,
  Award,
  BookOpen,
  Briefcase,
  Code2,
  Lock,
} from "lucide-react";

export default function EvidenceCard({
  evidence,
  onOpenQr,
  onOpenDisclosure,
  onOpenAudit,
  onVerify,
  isReviewer = false,
}) {
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "marks":
        return BookOpen;
      case "certificate":
      case "course_completion":
        return Award;
      case "project":
        return Code2;
      case "internship":
        return Briefcase;
      default:
        return Award;
    }
  };

  const Icon = getCategoryIcon(evidence.category);

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return {
          icon: ShieldCheck,
          label: "Digitally Verified",
          classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        };
      case "rejected":
        return {
          icon: XCircle,
          label: "Rejected",
          classes: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        };
      case "pending":
      default:
        return {
          icon: Clock,
          label: "Pending Verification",
          classes: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        };
    }
  };

  const statusMeta = getStatusBadge(evidence.status);
  const StatusIcon = statusMeta.icon;

  return (
    <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-5 transition-all hover:border-indigo-500/40 relative">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--aura-text-muted)] border border-[var(--aura-border)] px-2 py-0.5 rounded-md">
                {evidence.category.replace(/_/g, " ")}
              </span>
              <span className="text-[10px] font-mono text-indigo-400">
                {evidence.verificationId}
              </span>
            </div>
            <h4 className="mt-1 text-sm font-bold text-[var(--aura-text)]">
              {evidence.title}
            </h4>
            <p className="mt-0.5 text-xs text-[var(--aura-text-muted)]">
              Issued by {evidence.issuer?.name} · {evidence.issuer?.institution}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold ${statusMeta.classes}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            <span>{statusMeta.label}</span>
          </span>
        </div>
      </div>

      {/* Payload Highlight Details */}
      <div className="mt-4 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)]/40 p-3 text-xs space-y-2">
        {evidence.payload?.scoreOrGrade && (
          <div className="flex items-center justify-between">
            <span className="text-[var(--aura-text-muted)]">Result / Score:</span>
            <span className="font-extrabold text-emerald-400">
              {evidence.payload.scoreOrGrade}
            </span>
          </div>
        )}

        {evidence.payload?.skillsDemonstrated && evidence.payload.skillsDemonstrated.length > 0 && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-[var(--aura-text-muted)]">Competencies:</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {evidence.payload.skillsDemonstrated.map((sk, i) => (
                <span
                  key={i}
                  className="rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {evidence.payload?.projectRepository && (
          <div className="flex items-center justify-between">
            <span className="text-[var(--aura-text-muted)]">Repository:</span>
            <a
              href={evidence.payload.projectRepository}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 font-semibold flex items-center gap-1 hover:underline truncate max-w-[200px]"
            >
              <span>{evidence.payload.projectRepository}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>
        )}

        {evidence.verifierRemarks && (
          <div className="pt-1.5 border-t border-[var(--aura-border)]/40 text-[11px] text-[var(--aura-text-secondary)] italic">
            "{evidence.verifierRemarks}"
          </div>
        )}
      </div>

      {/* Cryptographic Hash Badge */}
      <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-[var(--aura-text-muted)] border-t border-[var(--aura-border)]/40 pt-2.5">
        <span className="font-mono truncate">
          SHA-256: {evidence.tamperEvidentHash?.slice(0, 24)}...
        </span>
        <span className="shrink-0 font-semibold">
          Issued {new Date(evidence.issuedDate).toLocaleDateString()}
        </span>
      </div>

      {/* Action Toolbar */}
      <div className="mt-4 flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpenQr(evidence)}
            className="inline-flex items-center gap-1.5 h-8 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] px-2.5 text-xs font-semibold text-[var(--aura-text)] hover:border-indigo-500/50 transition"
          >
            <QrCode className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Share / QR</span>
          </button>

          {!isReviewer && (
            <button
              type="button"
              onClick={() => onOpenDisclosure(evidence)}
              className="inline-flex items-center gap-1.5 h-8 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] px-2.5 text-xs font-semibold text-[var(--aura-text)] hover:border-indigo-500/50 transition"
            >
              <Sliders className="h-3.5 w-3.5 text-purple-400" />
              <span className="hidden sm:inline">Privacy</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenAudit(evidence)}
            className="inline-flex items-center gap-1.5 h-8 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] px-2.5 text-xs font-semibold text-[var(--aura-text-muted)] hover:text-[var(--aura-text)] transition"
          >
            <History className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Audit</span>
          </button>
        </div>

        {isReviewer && evidence.status === "pending" && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onVerify(evidence._id, "rejected")}
              className="h-8 px-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => onVerify(evidence._id, "verified")}
              className="h-8 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:opacity-90 transition shadow-sm"
            >
              Verify & Sign
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { X, History, CheckCircle2, Clock, ShieldCheck, Eye, Sliders } from "lucide-react";

export default function AuditHistoryDrawer({ isOpen, onClose, evidence }) {
  if (!isOpen || !evidence) return null;

  const getActionIcon = (act) => {
    switch (act) {
      case "verified":
        return { icon: ShieldCheck, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
      case "created":
      case "submitted_for_verification":
        return { icon: Clock, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" };
      case "disclosure_updated":
        return { icon: Sliders, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
      case "public_viewed":
        return { icon: Eye, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" };
      default:
        return { icon: CheckCircle2, color: "text-slate-400 bg-slate-500/10 border-slate-500/30" };
    }
  };

  const auditTrail = evidence.auditTrail || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md h-full bg-[var(--aura-surface)] border-l border-[var(--aura-border)] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--aura-border)]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[var(--aura-text)]">
                Cryptographic Audit History
              </h3>
              <p className="text-[11px] text-[var(--aura-text-muted)] font-mono truncate max-w-[240px]">
                ID: {evidence.verificationId}
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

        {/* Trail Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div className="rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)]/40 p-3">
            <span className="text-[10px] font-semibold text-[var(--aura-text-muted)] uppercase block">
              Tamper-Evident SHA-256 Digest
            </span>
            <span className="font-mono text-[11px] text-emerald-400 break-all select-all block mt-1">
              {evidence.tamperEvidentHash}
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--aura-border)]">
            {auditTrail.map((entry, idx) => {
              const meta = getActionIcon(entry.action);
              const Icon = meta.icon;
              return (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-6 top-0 h-5 w-5 rounded-full border flex items-center justify-center ${meta.color}`}
                  >
                    <Icon className="h-3 w-3" />
                  </div>

                  <div className="rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)]/30 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[var(--aura-text)] capitalize">
                        {entry.action.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-[var(--aura-text-muted)]">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-1 text-[11px] text-[var(--aura-text-secondary)]">
                      by <span className="font-semibold text-[var(--aura-text)]">{entry.actorName}</span> (
                      {entry.actorRole})
                    </div>

                    {entry.comment && (
                      <p className="mt-1 text-[11px] text-[var(--aura-text-muted)] italic">
                        "{entry.comment}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { X, ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";

export default function SelectiveDisclosureModal({
  isOpen,
  onClose,
  evidence,
  onSavePreferences,
  isSaving = false,
}) {
  const [preferences, setPreferences] = useState({
    sharePublicly: evidence?.selectiveDisclosure?.sharePublicly ?? true,
    revealStudentName: evidence?.selectiveDisclosure?.revealStudentName ?? true,
    revealRegisterNumber: evidence?.selectiveDisclosure?.revealRegisterNumber ?? false,
    revealExactScores: evidence?.selectiveDisclosure?.revealExactScores ?? true,
    revealEvaluatorNotes: evidence?.selectiveDisclosure?.revealEvaluatorNotes ?? false,
    revealSkills: evidence?.selectiveDisclosure?.revealSkills ?? true,
  });

  if (!isOpen || !evidence) return null;

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSavePreferences(evidence._id, preferences);
  };

  const toggleItems = [
    {
      key: "sharePublicly",
      label: "Enable Public External Verification",
      description: "Allow third-party employers/universities to verify this credential via unique link",
    },
    {
      key: "revealStudentName",
      label: "Display Full Student Name",
      description: "Show your real name instead of 'Verified AURA OS Scholar'",
    },
    {
      key: "revealRegisterNumber",
      label: "Display Institutional Roll / Register Number",
      description: "Expose your university registration identifier publicly",
    },
    {
      key: "revealExactScores",
      label: "Display Exact Numerical Grades & Marks",
      description: "Reveal detailed grades/marks vs only verifying credential authenticity",
    },
    {
      key: "revealEvaluatorNotes",
      label: "Display Evaluator & Mentor Private Feedback",
      description: "Make mentor internal remarks visible on the public verification page",
    },
    {
      key: "revealSkills",
      label: "Display Competencies & Skills List",
      description: "Show verified skill tags associated with this achievement",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--aura-border)]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[var(--aura-text)]">
                Selective Disclosure Privacy Controls
              </h3>
              <p className="text-xs text-[var(--aura-text-muted)]">
                Student-controlled zero-knowledge disclosure settings
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

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3 text-[11px] text-[var(--aura-text-secondary)]">
            Configure exactly which data fields are disclosed when external recruiters scan your QR code or view your public verification page.
          </div>

          <div className="divide-y divide-[var(--aura-border)]/50">
            {toggleItems.map((item) => {
              const isChecked = preferences[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => handleToggle(item.key)}
                  className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--aura-surface-2)]/30 px-2 rounded-xl transition"
                >
                  <div>
                    <span className="font-bold text-[var(--aura-text)] block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-[var(--aura-text-muted)] block mt-0.5">
                      {item.description}
                    </span>
                  </div>

                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                      isChecked ? "bg-indigo-600 justify-end" : "bg-[var(--aura-surface-2)] border border-[var(--aura-border)] justify-start"
                    }`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--aura-border)]">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl border border-[var(--aura-border)] text-xs font-semibold text-[var(--aura-text-muted)] hover:text-[var(--aura-text)] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold hover:opacity-90 transition shadow-md"
            >
              {isSaving ? "Saving..." : "Save Privacy Rules"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

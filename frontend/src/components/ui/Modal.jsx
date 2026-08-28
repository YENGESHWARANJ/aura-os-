import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Modal component
 * Props:
 *   isOpen (bool)
 *   onClose (fn)
 *   title (string)
 *   children (node)
 *   confirmLabel (string) — default "Confirm"
 *   confirmVariant (string) — "danger" | "primary"
 *   onConfirm (fn) — if undefined, no confirm button shown
 *   loading (bool)
 *   maxWidth (string) — Tailwind class, default "max-w-md"
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  onConfirm,
  loading = false,
  maxWidth = 'max-w-md',
}) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard ESC close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const confirmClass =
    confirmVariant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-500 text-white'
      : 'bg-sky-600 hover:bg-sky-500 text-white';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${maxWidth} rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 animate-[fadeInScale_0.18s_ease_both]`}
        style={{ animation: 'modalIn 0.18s ease both' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <h2 id="modal-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            onClick={!loading ? onClose : undefined}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Close modal"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {onConfirm && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-6 py-4">
            <button
              onClick={!loading ? onClose : undefined}
              disabled={loading}
              className="rounded-2xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${confirmClass}`}
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

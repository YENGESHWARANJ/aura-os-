import React, { useState } from "react";
import { X, Copy, Check, ExternalLink, ShieldCheck } from "lucide-react";

export default function QrCodeModal({ isOpen, onClose, evidence }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !evidence) return null;

  const publicUrl = `${window.location.origin}/verify/evidence/${evidence.verificationId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate a procedural SVG QR-like visual matrix pattern based on verificationId
  const generateQrCells = (idStr) => {
    const cells = [];
    const size = 15;
    let seed = 0;
    for (let i = 0; i < idStr.length; i++) {
      seed = (seed << 5) - seed + idStr.charCodeAt(i);
      seed |= 0;
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Corner locator markers
        const isTopLeft = r < 4 && c < 4;
        const isTopRight = r < 4 && c >= size - 4;
        const isBottomLeft = r >= size - 4 && c < 4;

        if (isTopLeft || isTopRight || isBottomLeft) {
          const isBorder =
            r === 0 || r === 3 || c === 0 || c === 3 ||
            r === 0 || r === 3 || c === size - 1 || c === size - 4 ||
            r === size - 1 || r === size - 4 || c === 0 || c === 3;
          const isCenter =
            (r === 1 || r === 2) && (c === 1 || c === 2) ||
            (r === 1 || r === 2) && (c === size - 3 || c === size - 2) ||
            (r === size - 3 || r === size - 2) && (c === 1 || c === 2);
          cells.push(isBorder || isCenter);
        } else {
          // pseudo-random deterministic fill
          const val = Math.abs(Math.sin(seed + r * size + c));
          cells.push(val > 0.45);
        }
      }
    }
    return cells;
  };

  const cells = generateQrCells(evidence.verificationId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] shadow-2xl overflow-hidden text-center">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--aura-border)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-extrabold text-[var(--aura-text)]">
              Verifiable Academic Credential
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 rounded-lg bg-[var(--aura-surface-2)] flex items-center justify-center text-[var(--aura-text-muted)] hover:text-[var(--aura-text)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="p-6 flex flex-col items-center">
          <div className="p-4 bg-white rounded-2xl shadow-inner inline-block">
            <svg
              viewBox="0 0 15 15"
              className="w-44 h-44 shape-rendering-crispEdges"
            >
              {cells.map((filled, idx) => {
                if (!filled) return null;
                const r = Math.floor(idx / 15);
                const c = idx % 15;
                return (
                  <rect
                    key={idx}
                    x={c}
                    y={r}
                    width={1}
                    height={1}
                    fill="#0f172a"
                  />
                );
              })}
            </svg>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-extrabold text-[var(--aura-text)] font-mono">
              {evidence.verificationId}
            </h4>
            <p className="text-[11px] text-[var(--aura-text-muted)] mt-0.5">
              {evidence.title}
            </p>
          </div>

          {/* Link box with copy */}
          <div className="mt-4 w-full flex items-center gap-1.5 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] p-1.5">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="w-full bg-transparent px-2 text-[11px] text-[var(--aura-text)] truncate outline-none font-mono"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 h-7 px-2.5 rounded-lg bg-indigo-600 text-white flex items-center gap-1 text-[11px] font-bold hover:bg-indigo-500 transition"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>Open Public Verification Page</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

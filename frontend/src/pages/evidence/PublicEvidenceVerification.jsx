import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  ExternalLink,
  Lock,
  Building,
  Calendar,
  Sparkles,
} from "lucide-react";
import evidenceService from "../../services/evidenceService";

export default function PublicEvidenceVerification() {
  const { verificationId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (verificationId) {
      resolveVerification();
    }
  }, [verificationId]);

  const resolveVerification = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await evidenceService.getPublicVerification(verificationId);
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message || "Credential not found");
      }
    } catch (err) {
      console.error("Public verification error:", err);
      setError(
        err.response?.data?.message ||
          "This verification ID could not be validated in the AURA OS registry."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--aura-bg)] text-[var(--aura-text)] flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Top Banner */}
      <div className="w-full max-w-2xl text-center mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1 text-xs font-extrabold text-indigo-400 mb-3">
          <ShieldCheck className="h-4 w-4" />
          <span>AURA OS · Official Academic Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--aura-text)]">
          Cryptographic Credential Verification
        </h1>
        <p className="text-xs text-[var(--aura-text-muted)] mt-1">
          Public verification portal with zero-knowledge selective disclosure governance
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl rounded-3xl border border-[var(--aura-border)] bg-[var(--aura-surface)] shadow-2xl p-6 sm:p-8">
        {loading ? (
          <div className="py-16 text-center">
            <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-[var(--aura-text-muted)] uppercase tracking-wider">
              Resolving SHA-256 Hash Digest on Registry...
            </p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-3">
              <XCircle className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-black text-[var(--aura-text)]">
              Verification Failed
            </h2>
            <p className="mt-2 text-xs text-[var(--aura-text-secondary)] max-w-md mx-auto">
              {error}
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:underline"
              >
                <span>Return to AURA OS Home</span>
              </Link>
            </div>
          </div>
        ) : data && !data.isShared ? (
          <div className="py-12 text-center">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-black text-[var(--aura-text)]">
              Private Credential
            </h2>
            <p className="mt-2 text-xs text-[var(--aura-text-secondary)] max-w-md mx-auto">
              {data.message}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Verification Status Header */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-emerald-400">
                    Officially Verified Credential
                  </h3>
                  <p className="text-[11px] text-[var(--aura-text-muted)] font-mono">
                    Token: {data.verificationId}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                Authentic
              </span>
            </div>

            {/* Credential Details */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--aura-text-muted)]">
                  Achievement Title
                </span>
                <h2 className="text-lg font-black text-[var(--aura-text)] mt-0.5">
                  {data.title}
                </h2>
                <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-[var(--aura-border)] text-indigo-400">
                  {data.category?.replace(/_/g, " ")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--aura-border)]">
                <div>
                  <span className="text-[10px] text-[var(--aura-text-muted)] uppercase block">
                    Credential Holder
                  </span>
                  <span className="font-extrabold text-sm text-[var(--aura-text)] block mt-0.5">
                    {data.student?.name}
                  </span>
                  <span className="text-[11px] text-[var(--aura-text-muted)] block">
                    {data.student?.department}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[var(--aura-text-muted)] uppercase block">
                    Issuing Authority
                  </span>
                  <span className="font-extrabold text-sm text-[var(--aura-text)] block mt-0.5">
                    {data.issuer?.name}
                  </span>
                  <span className="text-[11px] text-[var(--aura-text-muted)] block">
                    {data.issuer?.institution}
                  </span>
                </div>
              </div>

              {/* Payload Fields */}
              {Object.keys(data.payload || {}).length > 0 && (
                <div className="rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)]/50 p-4 space-y-2.5">
                  <span className="text-[10px] font-bold text-[var(--aura-text-muted)] uppercase tracking-wider block">
                    Verified Competencies & Performance
                  </span>

                  {data.payload.scoreOrGrade && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--aura-text-muted)]">Validated Result:</span>
                      <span className="font-black text-emerald-400">
                        {data.payload.scoreOrGrade}
                      </span>
                    </div>
                  )}

                  {data.payload.skillsDemonstrated &&
                    data.payload.skillsDemonstrated.length > 0 && (
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-[var(--aura-text-muted)]">Skills:</span>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {data.payload.skillsDemonstrated.map((sk, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {data.payload.projectRepository && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--aura-text-muted)]">Public Artifact:</span>
                      <a
                        href={data.payload.projectRepository}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>View Source Code</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {data.payload.evaluationNotes && (
                    <div className="pt-2 border-t border-[var(--aura-border)]/40 text-[11px] text-[var(--aura-text-secondary)] italic">
                      "{data.payload.evaluationNotes}"
                    </div>
                  )}
                </div>
              )}

              {/* Cryptographic Proof Details */}
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--aura-text-muted)]">Algorithm:</span>
                  <span className="font-mono text-indigo-400 font-bold">
                    {data.integrityCheck?.algorithm}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--aura-text-muted)]">Certified Timestamp:</span>
                  <span className="text-[var(--aura-text)] font-semibold">
                    {new Date(data.integrityCheck?.certifiedTimestamp).toUTCString()}
                  </span>
                </div>
                <div className="pt-1 text-[10px] text-[var(--aura-text-muted)] font-mono break-all">
                  Hash: {data.tamperEvidentHash}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-[11px] text-[var(--aura-text-muted)]">
        Powered by AURA OS Academic Cryptographic Governance Suite
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, RefreshCw, CheckCircle2, XCircle, Search, Filter, History, QrCode } from "lucide-react";
import evidenceService from "../../services/evidenceService";
import EvidenceCard from "../../components/evidence/EvidenceCard";
import QrCodeModal from "../../components/evidence/QrCodeModal";
import AuditHistoryDrawer from "../../components/evidence/AuditHistoryDrawer";

export default function EvidenceVerification() {
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await evidenceService.getPendingQueue();
      if (res.success) {
        setQueue(res.data);
      }
    } catch (err) {
      console.error("Verification queue error:", err);
      toast.error("Failed to load verification queue");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (evidenceId, status) => {
    try {
      const remarks =
        status === "verified"
          ? "Approved & digitally sealed by academic reviewer"
          : "Declined due to insufficient documentation";

      const res = await evidenceService.verifyEvidence(evidenceId, status, remarks);
      if (res.success) {
        toast.success(`Evidence marked as ${status} with cryptographic stamp!`);
        fetchQueue();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process verification");
    }
  };

  const filteredQueue = queue.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.studentName?.toLowerCase().includes(q) ||
      item.verificationId.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin mb-3" />
        <p className="text-xs text-[var(--aura-text-muted)] font-bold tracking-wider uppercase">
          Loading Academic Evidence Verification Queue...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Faculty & Mentor Registry Gateway</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--aura-text)] tracking-tight">
            Academic Evidence Verification Queue
          </h1>
          <p className="mt-1 text-xs text-[var(--aura-text-secondary)]">
            Review student submissions, attach digital credential stamps, and issue verifiable hashes.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchQueue}
          className="inline-flex items-center gap-1.5 h-9 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface)] px-3 text-xs font-semibold text-[var(--aura-text)] hover:bg-[var(--aura-surface-2)] transition self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Queue ({queue.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-4 flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--aura-text-muted)]" />
          <input
            type="text"
            placeholder="Filter by student name, roll no, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] text-xs text-[var(--aura-text)] outline-none focus:border-emerald-500 transition"
          />
        </div>

        <span className="text-xs text-[var(--aura-text-muted)] font-semibold hidden sm:inline">
          {filteredQueue.length} pending item{filteredQueue.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Queue Grid */}
      {filteredQueue.length === 0 ? (
        <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-12 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[var(--aura-text)]">
            Verification Queue Clean!
          </h3>
          <p className="text-xs text-[var(--aura-text-muted)] mt-1 max-w-sm mx-auto">
            All submitted academic evidence credentials have been reviewed and processed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQueue.map((item) => (
            <EvidenceCard
              key={item._id}
              evidence={item}
              onOpenQr={(ev) => {
                setSelectedEvidence(ev);
                setIsQrModalOpen(true);
              }}
              onOpenAudit={(ev) => {
                setSelectedEvidence(ev);
                setIsAuditDrawerOpen(true);
              }}
              onVerify={handleVerify}
              isReviewer={true}
            />
          ))}
        </div>
      )}

      {/* QR Code and Audit Drawers */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        evidence={selectedEvidence}
      />

      <AuditHistoryDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        evidence={selectedEvidence}
      />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Sliders,
  QrCode,
  Award,
  BookOpen,
  FolderGit2,
  Briefcase,
} from "lucide-react";
import evidenceService from "../../services/evidenceService";
import EvidenceCard from "../../components/evidence/EvidenceCard";
import SelectiveDisclosureModal from "../../components/evidence/SelectiveDisclosureModal";
import QrCodeModal from "../../components/evidence/QrCodeModal";
import AuditHistoryDrawer from "../../components/evidence/AuditHistoryDrawer";

export default function EvidenceWallet() {
  const [loading, setLoading] = useState(true);
  const [evidenceList, setEvidenceList] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & drawers
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isDisclosureModalOpen, setIsDisclosureModalOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New credential form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("certificate");
  const [newScore, setNewScore] = useState("");
  const [newIssuer, setNewIssuer] = useState("");
  const [newSkills, setNewSkills] = useState("");
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const res = await evidenceService.getWallet();
      if (res.success) {
        setEvidenceList(res.data);
      }
    } catch (err) {
      console.error("Wallet error:", err);
      toast.error("Failed to load academic evidence wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenQr = (evidence) => {
    setSelectedEvidence(evidence);
    setIsQrModalOpen(true);
  };

  const handleOpenDisclosure = (evidence) => {
    setSelectedEvidence(evidence);
    setIsDisclosureModalOpen(true);
  };

  const handleOpenAudit = (evidence) => {
    setSelectedEvidence(evidence);
    setIsAuditDrawerOpen(true);
  };

  const handleSaveDisclosure = async (evidenceId, preferences) => {
    try {
      const res = await evidenceService.updateDisclosure(evidenceId, preferences);
      if (res.success) {
        toast.success("Privacy preferences updated successfully!");
        setIsDisclosureModalOpen(false);
        fetchWallet();
      }
    } catch (err) {
      toast.error("Failed to update privacy settings");
    }
  };

  const handleCreateCredential = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingNew(true);
      const payload = {
        title: newTitle,
        category: newCategory,
        scoreOrGrade: newScore,
        issuerName: newIssuer,
        skillsDemonstrated: newSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await evidenceService.createEvidence(payload);
      if (res.success) {
        toast.success("Evidence submitted for faculty verification!");
        setIsSubmitModalOpen(false);
        setNewTitle("");
        setNewScore("");
        setNewIssuer("");
        setNewSkills("");
        fetchWallet();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit credential");
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesCat = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.verificationId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: "all", label: "All Records" },
    { id: "marks", label: "Examination Marks" },
    { id: "certificate", label: "Certificates" },
    { id: "project", label: "Capstone Projects" },
    { id: "internship", label: "Internships" },
    { id: "skill", label: "Skill Assessments" },
  ];

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-xs text-[var(--aura-text-muted)] font-bold tracking-wider uppercase">
          Decrypting Verifiable Evidence Wallet...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Cryptographic Academic Identity</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--aura-text)] tracking-tight">
            Verifiable Academic Evidence Wallet
          </h1>
          <p className="mt-1 text-xs text-[var(--aura-text-secondary)]">
            Tamper-evident, cryptographically hashed academic achievements with student-governed selective disclosure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 text-xs font-bold text-white hover:opacity-90 transition shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Submit Credential</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition ${
                  isActive
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-300 font-bold"
                    : "border-[var(--aura-border)] bg-[var(--aura-surface-2)] text-[var(--aura-text-secondary)] hover:text-[var(--aura-text)]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--aura-text-muted)]" />
          <input
            type="text"
            placeholder="Search credential or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] text-xs text-[var(--aura-text)] placeholder:text-[var(--aura-text-muted)] outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Evidence Cards Grid */}
      {filteredEvidence.length === 0 ? (
        <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-12 text-center">
          <ShieldCheck className="h-10 w-10 text-[var(--aura-text-muted)] mx-auto mb-2 opacity-50" />
          <h3 className="text-sm font-bold text-[var(--aura-text)]">
            No Academic Credentials Found
          </h3>
          <p className="text-xs text-[var(--aura-text-muted)] mt-1 max-w-sm mx-auto">
            No verifiable evidence items match the chosen filter. Submit your transcripts, certificates, or projects to begin building your wallet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvidence.map((item) => (
            <EvidenceCard
              key={item._id}
              evidence={item}
              onOpenQr={handleOpenQr}
              onOpenDisclosure={handleOpenDisclosure}
              onOpenAudit={handleOpenAudit}
            />
          ))}
        </div>
      )}

      {/* Modals & Drawers */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        evidence={selectedEvidence}
      />

      <SelectiveDisclosureModal
        isOpen={isDisclosureModalOpen}
        onClose={() => setIsDisclosureModalOpen(false)}
        evidence={selectedEvidence}
        onSavePreferences={handleSaveDisclosure}
      />

      <AuditHistoryDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        evidence={selectedEvidence}
      />

      {/* Submit New Credential Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] shadow-2xl p-6 text-xs">
            <h3 className="text-sm font-extrabold text-[var(--aura-text)] mb-1">
              Submit Academic Credential for Verification
            </h3>
            <p className="text-[11px] text-[var(--aura-text-muted)] mb-4">
              Enter your academic evidence record to be cryptographically signed by your faculty or mentor.
            </p>

            <form onSubmit={handleCreateCredential} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--aura-text-secondary)] mb-1">
                  Credential Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. AWS Cloud Practitioner Certificate"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-8 px-3 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] text-xs text-[var(--aura-text)] outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--aura-text-secondary)] mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-8 px-3 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] text-xs text-[var(--aura-text)] outline-none focus:border-indigo-500"
                >
                  <option value="certificate">Official Certificate</option>
                  <option value="marks">Examination Marks / Transcript</option>
                  <option value="project">Capstone Project</option>
                  <option value="internship">Internship Completion</option>
                  <option value="skill">Skill Assessment</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--aura-text-secondary)] mb-1">
                  Issuing Authority / Institution
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Amazon Web Services / AURA CoE"
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  className="w-full h-8 px-3 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] text-xs text-[var(--aura-text)] outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--aura-text-secondary)] mb-1">
                  Score / Grade / Outcome
                </label>
                <input
                  type="text"
                  placeholder="e.g. Score: 890/1000 or Grade: A+"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="w-full h-8 px-3 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] text-xs text-[var(--aura-text)] outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--aura-text-secondary)] mb-1">
                  Demonstrated Competencies (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. EC2, S3, IAM, Cloud Architecture"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full h-8 px-3 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] text-xs text-[var(--aura-text)] outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="h-8 px-3 rounded-xl border border-[var(--aura-border)] text-xs text-[var(--aura-text-muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="h-8 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                >
                  {isSubmittingNew ? "Submitting..." : "Submit to Wallet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Sparkles, BookOpen, RefreshCw, Activity, CheckCircle, BarChart2 } from "lucide-react";
import curriculumService from "../../services/curriculumService";
import SkillGapHeatmap from "../../components/curriculum/SkillGapHeatmap";
import IndustrySkillComparison from "../../components/curriculum/IndustrySkillComparison";
import CurriculumSuggestions from "../../components/curriculum/CurriculumSuggestions";
import FacultyReviewModal from "../../components/curriculum/FacultyReviewModal";

export default function CurriculumIntelligence() {
  const { user } = useSelector((state) => state.auth);
  const isFaculty = user?.role === "faculty" || user?.role === "admin";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    fetchObservatory();
  }, []);

  const fetchObservatory = async () => {
    try {
      setLoading(true);
      const res = await curriculumService.getObservatory();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Observatory error:", err);
      toast.error("Failed to load curriculum intelligence data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async ({ suggestionId, decision, feedback }) => {
    try {
      setIsSubmittingReview(true);
      const res = await curriculumService.submitFacultyReview({
        suggestionId,
        decision,
        feedback,
      });

      if (res.success) {
        toast.success(`Departmental decision recorded as ${decision}!`);
        setIsReviewModalOpen(false);
        fetchObservatory();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 text-cyan-500 animate-spin mb-3" />
        <p className="text-xs text-[var(--aura-text-muted)] font-bold tracking-wider uppercase">
          Synthesizing Curriculum & Skill Gap Observatory...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="h-4 w-4" />
            <span>Academic Governance Observatory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--aura-text)] tracking-tight">
            Self-Evolving Curriculum & Skill Gap Intelligence
          </h1>
          <p className="mt-1 text-xs text-[var(--aura-text-secondary)]">
            Continuous alignment of academic syllabi against student assessment frictions, capstone domains, and real-time industry hiring signals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchObservatory}
            className="inline-flex items-center gap-1.5 h-9 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface)] px-3 text-xs font-semibold text-[var(--aura-text)] hover:bg-[var(--aura-surface-2)] transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-4">
          <span className="text-[11px] font-semibold text-[var(--aura-text-muted)] uppercase block">
            Curriculum Health Index
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400">
              {data?.overallCurriculumHealthScore}%
            </span>
            <span className="text-xs font-bold text-emerald-400">+3.1% YoY</span>
          </div>
          <span className="text-[10px] text-[var(--aura-text-muted)] block mt-1">
            Outcome validation across 28 subjects
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-4">
          <span className="text-[11px] font-semibold text-[var(--aura-text-muted)] uppercase block">
            Institutional Skill Gap
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">
              {data?.skillGapIndex}%
            </span>
            <span className="text-xs font-bold text-rose-400">Moderate Gap</span>
          </div>
          <span className="text-[10px] text-[var(--aura-text-muted)] block mt-1">
            Industry delta in Cloud & Vector systems
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-4">
          <span className="text-[11px] font-semibold text-[var(--aura-text-muted)] uppercase block">
            Department Scope
          </span>
          <div className="mt-1">
            <span className="text-sm font-bold text-[var(--aura-text)] truncate block">
              {data?.department}
            </span>
          </div>
          <span className="text-[10px] text-[var(--aura-text-muted)] block mt-1">
            Semester {data?.semester} · Academic Year {data?.academicYear}
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-4">
          <span className="text-[11px] font-semibold text-[var(--aura-text-muted)] uppercase block">
            Actionable Proposals
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-400">
              {data?.suggestions?.length || 0}
            </span>
            <span className="text-xs font-bold text-indigo-300">Under Review</span>
          </div>
          <span className="text-[10px] text-[var(--aura-text-muted)] block mt-1">
            Faculty council voting enabled
          </span>
        </div>
      </div>

      {/* Syllabus & Concept Friction Heatmap */}
      <SkillGapHeatmap topics={data?.topics || []} />

      {/* Industry Benchmarks & Gap Analysis */}
      <IndustrySkillComparison benchmarks={data?.benchmarks || []} />

      {/* Concrete Curriculum Improvement Proposals */}
      <CurriculumSuggestions
        suggestions={data?.suggestions || []}
        onOpenReview={handleOpenReview}
        isFaculty={isFaculty}
      />

      {/* Faculty Review Modal */}
      <FacultyReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        suggestion={selectedSuggestion}
        onSubmitReview={handleSubmitReview}
        isSubmitting={isSubmittingReview}
      />
    </div>
  );
}

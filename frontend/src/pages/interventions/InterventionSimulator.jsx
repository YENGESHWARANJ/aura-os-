import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Sparkles, BrainCircuit, RefreshCw, Layers } from "lucide-react";
import interventionService from "../../services/interventionService";
import InterventionCard from "../../components/interventions/InterventionCard";
import ScenarioSelector from "../../components/interventions/ScenarioSelector";
import BeforeAfterComparison from "../../components/interventions/BeforeAfterComparison";
import ImpactPredictionChart from "../../components/interventions/ImpactPredictionChart";
import RecommendationExplanation from "../../components/interventions/RecommendationExplanation";
import MentorApprovalPanel from "../../components/interventions/MentorApprovalPanel";

export default function InterventionSimulator() {
  const { user } = useSelector((state) => state.auth);
  const isMentor = user?.role === "mentor" || user?.role === "admin";

  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [baseline, setBaseline] = useState(null);
  const [student, setStudent] = useState(null);
  const [problemAreas, setProblemAreas] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [activeScenarioIds, setActiveScenarioIds] = useState(["attendance_boost", "submit_assignments"]);
  const [projectedOutcome, setProjectedOutcome] = useState(null);
  const [highestImpact, setHighestImpact] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("draft");
  const [mentorFeedback, setMentorFeedback] = useState({});

  // Initial load
  useEffect(() => {
    loadSimulation(activeScenarioIds);
  }, []);

  const loadSimulation = async (selectedIds) => {
    try {
      setSimulating(true);
      const res = await interventionService.simulate(selectedIds);
      if (res.success) {
        setStudent(res.data.student);
        setBaseline(res.data.baseline);
        setProblemAreas(res.data.problemAreas);
        setScenarios(res.data.scenarios);
        setProjectedOutcome(res.data.projectedOutcome);
        setHighestImpact(res.data.highestImpactIntervention);
        setAiExplanation(res.data.aiExplanation);
      }
    } catch (err) {
      console.error("Simulation error:", err);
      toast.error(err.response?.data?.message || "Failed to load intervention simulation");
    } finally {
      setLoading(false);
      setSimulating(false);
    }
  };

  const handleToggleScenario = (scenarioId) => {
    let nextIds = [];
    if (activeScenarioIds.includes(scenarioId)) {
      nextIds = activeScenarioIds.filter((id) => id !== scenarioId);
    } else {
      nextIds = [...activeScenarioIds, scenarioId];
    }
    setActiveScenarioIds(nextIds);
    loadSimulation(nextIds);
  };

  const handleSelectAll = () => {
    const allIds = scenarios.map((s) => s.id);
    setActiveScenarioIds(allIds);
    loadSimulation(allIds);
    toast.success("Applied optimal multi-factor intervention bundle!");
  };

  const handleReset = () => {
    setActiveScenarioIds([]);
    loadSimulation([]);
    toast("Reset simulator to baseline", { icon: "🔄" });
  };

  const handleSubmitPlan = async () => {
    try {
      setIsSubmitting(true);
      const res = await interventionService.savePlan({
        scenarios: scenarios.filter((s) => activeScenarioIds.includes(s.id)),
        approvalStatus: "submitted_to_mentor",
      });
      if (res.success) {
        setApprovalStatus("submitted_to_mentor");
        toast.success("Intervention plan submitted for Mentor review!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewPlan = async (decision, comment) => {
    try {
      setIsSubmitting(true);
      // In demo mode or if plan ID exists
      setApprovalStatus(decision);
      setMentorFeedback({
        comment: comment || "Academic plan verified and logged.",
        reviewedAt: new Date(),
      });
      toast.success(`Intervention plan marked as ${decision}!`);
    } catch (err) {
      toast.error("Failed to record mentor review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-xs text-[var(--aura-text-muted)] font-bold tracking-wider uppercase">
          Synthesizing Multi-Factor Counterfactual Model...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Predictive Intelligence Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--aura-text)] tracking-tight">
            Counterfactual Academic Intervention Simulator
          </h1>
          <p className="mt-1 text-xs text-[var(--aura-text-secondary)]">
            Explore simulated "what-if" pedagogical interventions, quantify expected risk attenuation, and align on verified mentor roadmaps.
          </p>
        </div>

        {student && (
          <div className="shrink-0 rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {student.name.charAt(0)}
            </div>
            <div>
              <span className="font-extrabold text-xs text-[var(--aura-text)] block">
                {student.name}
              </span>
              <span className="text-[10px] text-[var(--aura-text-muted)] block">
                {student.department} · Sem {student.semester}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Before vs After Impact Projection */}
      <BeforeAfterComparison baseline={baseline} projected={projectedOutcome} />

      {/* Grid: Chart & AI Recommendation Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImpactPredictionChart baseline={baseline} projected={projectedOutcome} />
        <RecommendationExplanation
          explanation={aiExplanation}
          highestImpact={highestImpact}
          confidenceScore={projectedOutcome?.overallConfidence}
          problemAreas={problemAreas}
        />
      </div>

      {/* Interactive Scenario Controls */}
      <ScenarioSelector
        scenarios={scenarios}
        activeScenarioIds={activeScenarioIds}
        onToggleScenario={handleToggleScenario}
        onSelectAll={handleSelectAll}
        onReset={handleReset}
      />

      {/* Individual Scenario Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--aura-text-muted)] flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" />
            Available Intervention Scenarios ({scenarios.length})
          </h3>
          <span className="text-xs text-indigo-400 font-semibold">
            {activeScenarioIds.length} scenario{activeScenarioIds.length !== 1 ? "s" : ""} applied
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((sc) => {
            const isApplied = activeScenarioIds.includes(sc.id);
            const isHighest = highestImpact && highestImpact.toLowerCase().includes(sc.title.toLowerCase().slice(0, 10));
            return (
              <InterventionCard
                key={sc.id}
                scenario={sc}
                isApplied={isApplied}
                onToggle={() => handleToggleScenario(sc.id)}
                isHighestImpact={isHighest}
              />
            );
          })}
        </div>
      </div>

      {/* Human-in-the-loop Mentor Approval */}
      <MentorApprovalPanel
        isMentor={isMentor}
        approvalStatus={approvalStatus}
        mentorFeedback={mentorFeedback}
        onSubmitPlan={handleSubmitPlan}
        onReviewPlan={handleReviewPlan}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

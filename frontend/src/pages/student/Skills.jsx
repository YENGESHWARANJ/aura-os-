import React, { useState, useEffect } from "react";
import SkillOverview from "../../components/skills/SkillOverview";
import SkillFilters from "../../components/skills/SkillFilters";
import SkillCard from "../../components/skills/SkillCard";
import SkillDetailsDrawer from "../../components/skills/SkillDetailsDrawer";
import AddSkillModal from "../../components/skills/AddSkillModal";
import SkillMatrix from "../../components/skills/SkillMatrix";
import SkillRadar from "../../components/skills/SkillRadar";
import CareerTarget from "../../components/skills/CareerTarget";
import SkillGapAnalysis from "../../components/skills/SkillGapAnalysis";
import CareerReadiness from "../../components/skills/CareerReadiness";
import { SkillStrengths, SkillImprovement } from "../../components/skills/SkillStrengths";
import SkillRoadmap from "../../components/skills/SkillRoadmap";
import SkillGoals from "../../components/skills/SkillGoals";
import SkillEvidence from "../../components/skills/SkillEvidence";
import SkillAssessments from "../../components/skills/SkillAssessments";
import RecommendedSkills from "../../components/skills/RecommendedSkills";
import SkillAIInsights from "../../components/skills/SkillAIInsights";
import SkillActivity from "../../components/skills/SkillActivity";
import SkillSkeleton from "../../components/skills/SkillSkeleton";
import SkillEmptyState from "../../components/skills/SkillEmptyState";

import {
  getSkillOverview,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getSkillMatrix,
  getSkillGapAnalysis,
  getCareerReadiness,
  getLearningRoadmap,
  getSkillGoals,
  createSkillGoal,
  updateSkillGoal,
  deleteSkillGoal,
  getSkillEvidence,
  addSkillEvidence,
  getSkillAssessments,
  getAIInsights,
  getRecommendedSkills,
  getRecentActivity
} from "../../services/skillService";

import { Plus, Award, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";

export default function Skills() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State data
  const [overview, setOverview] = useState(null);
  const [skills, setSkills] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [selectedCareerRole, setSelectedCareerRole] = useState("Full Stack Developer");
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [goals, setGoals] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [activity, setActivity] = useState([]);

  // Filter controls
  const [activeCategory, setActiveCategory] = useState("All Skills");
  const [searchQuery, setSearchQuery] = useState("");
  const [proficiencyFilter, setProficiencyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("Recently Updated");

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSkillForDetails, setSelectedSkillForDetails] = useState(null);
  const [skillToEdit, setSkillToEdit] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        ovRes,
        skRes,
        matRes,
        gapRes,
        readRes,
        roadRes,
        glRes,
        evRes,
        assRes,
        recRes,
        aiRes,
        actRes
      ] = await Promise.all([
        getSkillOverview(),
        getSkills({ category: activeCategory, proficiency: proficiencyFilter, status: statusFilter, search: searchQuery, sortBy }),
        getSkillMatrix(),
        getSkillGapAnalysis(selectedCareerRole),
        getCareerReadiness(selectedCareerRole),
        getLearningRoadmap(selectedCareerRole),
        getSkillGoals(),
        getSkillEvidence(),
        getSkillAssessments(),
        getRecommendedSkills(selectedCareerRole),
        getAIInsights(selectedCareerRole),
        getRecentActivity()
      ]);

      setOverview(ovRes.data);
      setSkills(skRes.data);
      setMatrix(matRes.data);
      setGapAnalysis(gapRes.data);
      setReadiness(readRes.data);
      setRoadmap(roadRes.data);
      setGoals(glRes.data);
      setEvidence(evRes.data);
      setAssessments(assRes.data);
      setRecommendations(recRes.data);
      setAiInsights(aiRes.data);
      setActivity(actRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your session has expired or is invalid. Please log in again.");
      } else {
        console.error(err);
        setError("Unable to load skills. Please check your backend connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when category, filters, search, or career role changes
  useEffect(() => {
    fetchAllData();
  }, [activeCategory, proficiencyFilter, statusFilter, searchQuery, sortBy, selectedCareerRole]);

  // Handle Add / Edit Skill
  const handleSaveSkill = async (formData) => {
    try {
      if (skillToEdit) {
        await updateSkill(skillToEdit._id, formData);
      } else {
        await addSkill(formData);
      }
      setIsAddModalOpen(false);
      setSkillToEdit(null);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to save skill.");
    }
  };

  // Handle Delete Skill
  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      setSelectedSkillForDetails(null);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete skill.");
    }
  };

  // Handle Goal CRUD
  const handleCreateGoal = async (goalData) => {
    try {
      await createSkillGoal(goalData);
      const gl = await getSkillGoals();
      setGoals(gl.data);
    } catch (err) {
      alert(err.message || "Failed to create goal.");
    }
  };

  const handleUpdateGoal = async (id, updateData) => {
    try {
      await updateSkillGoal(id, updateData);
      const gl = await getSkillGoals();
      setGoals(gl.data);
    } catch (err) {
      alert(err.message || "Failed to update goal.");
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteSkillGoal(id);
      const gl = await getSkillGoals();
      setGoals(gl.data);
    } catch (err) {
      alert(err.message || "Failed to delete goal.");
    }
  };

  // Handle Add Evidence
  const handleAddEvidence = async (evData) => {
    try {
      await addSkillEvidence(evData);
      const ev = await getSkillEvidence();
      setEvidence(ev.data);
      fetchAllData();
    } catch (err) {
      alert(err.message || "Failed to add evidence.");
    }
  };

  // Handle Quick Add Recommended Skill
  const handleAddRecommended = async (rec) => {
    try {
      await addSkill({
        name: rec.name,
        category: rec.category,
        proficiencyPercentage: 50,
        learningStatus: "Learning",
        targetProficiency: 80,
        description: rec.why
      });
      fetchAllData();
    } catch (err) {
      alert(err.message || "Failed to add recommended skill.");
    }
  };

  return (
    <div className="min-h-screen pb-12 text-[var(--aura-text)]">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[var(--aura-text-muted)] mb-1.5 font-medium">
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">Skills & Competency</span>
          </nav>
          <h1 className="text-3xl font-black text-[var(--aura-text)] tracking-tight">Skills & Competency</h1>
          <p className="text-sm text-[var(--aura-text-secondary)] mt-1 max-w-xl">
            Build, track and strengthen the skills that shape your academic and career readiness.
          </p>
        </div>

        {/* Top-Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setSkillToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white transition shadow-md shadow-indigo-500/25 cursor-pointer text-white-force"
          >
            <Plus className="h-4 w-4" /> Add Skill
          </button>
          <button
            onClick={() => alert("Skill Assessment module initialized. Complete test to earn verified badges.")}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--aura-surface)] hover:bg-[var(--aura-surface-2)] border border-[var(--aura-border)] px-4 py-2.5 text-xs font-bold text-[var(--aura-text)] transition cursor-pointer shadow-xs"
          >
            <Award className="h-4 w-4 text-indigo-500" /> Skill Assessment
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchAllData}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-rose-200 font-semibold"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </button>
        </div>
      )}

      {loading ? (
        <SkillSkeleton />
      ) : (
        <>
          {/* 2. KPI OVERVIEW CARDS */}
          <SkillOverview overview={overview} />

          {/* 3. MY SKILL PROFILE & FILTERS */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">My Skill Profile</h2>
              <span className="text-xs text-slate-400">{skills.length} skills showing</span>
            </div>

            <SkillFilters
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              proficiencyFilter={proficiencyFilter}
              setProficiencyFilter={setProficiencyFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* 4. SKILL CARDS GRID */}
            {skills.length === 0 ? (
              <SkillEmptyState
                onAddFirstSkill={() => {
                  setSkillToEdit(null);
                  setIsAddModalOpen(true);
                }}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {skills.map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    onViewDetails={(s) => setSelectedSkillForDetails(s)}
                    onEdit={(s) => {
                      setSkillToEdit(s);
                      setIsAddModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 5. SKILL MATRIX & RADAR DISTRIBUTION */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <SkillMatrix matrix={matrix} />
            <SkillRadar matrix={matrix} />
          </div>

          {/* 6. CAREER TARGET & GAP ANALYSIS & READINESS */}
          <section className="mb-8">
            <CareerTarget selectedRole={selectedCareerRole} onSelectRole={setSelectedCareerRole} />
            <SkillGapAnalysis gapData={gapAnalysis} />
            <CareerReadiness readinessData={readiness} />
          </section>

          {/* 7. TOP STRENGTHS | SKILLS TO IMPROVE */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <SkillStrengths skills={skills} />
            <SkillImprovement
              skills={skills}
              onStartLearning={(item) => {
                setSkillToEdit(item);
                setIsAddModalOpen(true);
              }}
            />
          </div>

          {/* 8. PERSONAL LEARNING ROADMAP */}
          <SkillRoadmap roadmapData={roadmap} />

          {/* 9. SKILL GOALS */}
          <SkillGoals
            goals={goals}
            onCreateGoal={handleCreateGoal}
            onDeleteGoal={handleDeleteGoal}
            onUpdateGoal={handleUpdateGoal}
          />

          {/* 10. EVIDENCE & VERIFICATION */}
          <SkillEvidence evidence={evidence} onAddEvidence={handleAddEvidence} />

          {/* 11. SKILL ASSESSMENTS */}
          <SkillAssessments assessments={assessments} />

          {/* 12. RECOMMENDED SKILLS */}
          <RecommendedSkills recommendations={recommendations} onAddRecommended={handleAddRecommended} />

          {/* 13. AURA AI SKILL INSIGHTS */}
          <SkillAIInsights insightsData={aiInsights} />

          {/* 14. RECENT ACTIVITY */}
          <SkillActivity activity={activity} />
        </>
      )}

      {/* Add / Edit Skill Modal */}
      <AddSkillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSaveSkill}
        initialSkill={skillToEdit}
        existingSkills={skills}
      />

      {/* Skill Details Drawer */}
      {selectedSkillForDetails && (
        <SkillDetailsDrawer
          skill={selectedSkillForDetails}
          onClose={() => setSelectedSkillForDetails(null)}
          onEdit={(s) => {
            setSelectedSkillForDetails(null);
            setSkillToEdit(s);
            setIsAddModalOpen(true);
          }}
          onDelete={handleDeleteSkill}
        />
      )}
    </div>
  );
}

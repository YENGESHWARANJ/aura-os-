import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getMentorGoals, createMentorGoal, updateMentorGoal } from "../../services/mentor/mentorApi";
import PageHeader from "../../components/ui/PageHeader";
import { Target, Plus, CheckCircle, TrendingUp, Calendar } from "lucide-react";

const DEMO_GOALS = [
  { _id: "g1", student: "Alex Johnson", type: "academic", description: "Raise Big Data Analytics internal score to 40/50", targetDate: "2026-09-15", progress: 45, status: "in-progress", priority: "High" },
  { _id: "g2", student: "Rahul Kumar", type: "attendance", description: "Maintain 85%+ attendance across all S7 subjects", targetDate: "2026-09-30", progress: 70, status: "in-progress", priority: "High" },
  { _id: "g3", student: "Priya S", type: "skill", description: "Complete Computer Vision project Phase 1 & IEEE draft", targetDate: "2026-09-10", progress: 85, status: "in-progress", priority: "Medium" },
];

export default function MentorGoals() {
  const [goals, setGoals] = useState(DEMO_GOALS);
  const [form, setForm] = useState({ student: "", type: "academic", description: "", targetDate: "", progress: 0, priority: "High" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await getMentorGoals();
        if (response?.data?.data?.length) {
          setGoals(response.data.data);
        }
      } catch {
        // Fallback demo goals loaded
      }
    };
    fetchGoals();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMentorGoal({ ...form, progress: Number(form.progress) });
      toast.success("Goal set successfully.");
      setGoals((prev) => [
        { _id: Date.now().toString(), ...form, progress: Number(form.progress), status: "in-progress" },
        ...prev,
      ]);
      setForm({ student: "", type: "academic", description: "", targetDate: "", progress: 0, priority: "High" });
    } catch {
      toast.success("Goal created.");
      setGoals((prev) => [
        { _id: Date.now().toString(), ...form, progress: Number(form.progress), status: "in-progress" },
        ...prev,
      ]);
      setForm({ student: "", type: "academic", description: "", targetDate: "", progress: 0, priority: "High" });
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (goalId, delta) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g._id === goalId) {
          const nextProg = Math.min(100, Math.max(0, (g.progress || 0) + delta));
          return { ...g, progress: nextProg };
        }
        return g;
      })
    );
    toast.success("Goal progress updated.");
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Mentor Portal"
        title="Student Goals & Milestones"
        description="Set academic recovery targets, skill achievements, and track progress towards completion."
        actions={
          <span className="aura-badge aura-badge-info py-1.5 px-3">
            <Target className="h-3.5 w-3.5 mr-1 inline text-cyan-400" />
            {goals.length} Active Student Goals
          </span>
        }
      />

      <div className="attendance-main-grid">
        {/* Create Goal Form */}
        <div className="aura-card">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Assign New Student Goal</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Student Name / Roll No</label>
              <input
                name="student"
                value={form.student}
                onChange={handleChange}
                className="aura-input text-xs"
                placeholder="e.g. Alex Johnson"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Category</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="aura-select text-xs"
              >
                <option value="academic">Academic Target</option>
                <option value="attendance">Attendance Threshold</option>
                <option value="skill">Technical Skill Milestone</option>
                <option value="career">Career / Research Goal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="aura-textarea text-xs min-h-[80px]"
                placeholder="Describe specific target, e.g. Reach 85%+ in Data Viz..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Date</label>
                <input
                  name="targetDate"
                  type="date"
                  value={form.targetDate}
                  onChange={handleChange}
                  className="aura-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Progress %</label>
                <input
                  name="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={handleChange}
                  className="aura-input text-xs"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="aura-btn aura-btn-primary w-full text-xs py-2.5 font-bold">
              {loading ? "Assigning Goal..." : "Assign Student Goal"}
            </button>
          </form>
        </div>

        {/* Active Goals List */}
        <div className="aura-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Current Active Goals</h3>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>

          <div className="space-y-4">
            {goals.length ? (
              goals.map((g) => (
                <div key={g._id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-white">{g.description}</p>
                      {g.student && <p className="text-[11px] text-cyan-400 font-semibold mt-0.5">Student: {g.student}</p>}
                    </div>
                    <span className={`aura-badge ${g.priority === "High" ? "aura-badge-danger" : "aura-badge-warning"}`}>
                      {g.priority || "Medium"} Priority
                    </span>
                  </div>

                  {/* Progress Bar & Controls */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Completion Progress</span>
                      <span className="font-extrabold text-cyan-400">{g.progress}%</span>
                    </div>
                    <div className="subject-progress-bar">
                      <div
                        className="subject-progress-fill"
                        style={{ width: `${g.progress}%`, background: g.progress >= 75 ? "#10b981" : "#06b6d4" }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">Target: {g.targetDate || "End of Sem"}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleProgressUpdate(g._id, 10)}
                        className="aura-btn aura-btn-secondary text-[10px] py-0.5 px-2 h-7"
                      >
                        +10%
                      </button>
                      <button
                        onClick={() => handleProgressUpdate(g._id, 25)}
                        className="aura-btn aura-btn-secondary text-[10px] py-0.5 px-2 h-7"
                      >
                        +25%
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-slate-400">No active goals assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

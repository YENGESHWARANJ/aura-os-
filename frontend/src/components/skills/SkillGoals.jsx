import React, { useState } from "react";
import { Target, Plus, CheckCircle2, Trash2, Calendar, AlertCircle, X } from "lucide-react";

export default function SkillGoals({ goals = [], onCreateGoal, onDeleteGoal, onUpdateGoal }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    skillName: "",
    currentLevel: 50,
    targetLevel: 80,
    targetDate: "",
    priority: "Medium",
    notes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.skillName.trim() || !formData.targetDate) return;
    onCreateGoal(formData);
    setIsModalOpen(false);
    setFormData({ skillName: "", currentLevel: 50, targetLevel: 80, targetDate: "", priority: "Medium", notes: "" });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="h-5 w-5 text-sky-400" /> Skill Goals
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Active target benchmarks and deadlines set for your competencies
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 px-3.5 py-2 text-xs font-semibold text-white transition shadow-md shadow-sky-500/20"
        >
          <Plus className="h-4 w-4" /> Create Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center p-8 bg-slate-950/60 rounded-xl border border-slate-800">
          <Target className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No active skill goals</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">Set a target benchmark and deadline to accelerate your progress.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-xl text-xs font-semibold transition"
          >
            + Create First Goal
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {goals.map((goal) => {
            const formattedDate = goal.targetDate
              ? new Date(goal.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "No deadline";

            return (
              <div key={goal._id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">{goal.skillName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      goal.priority === "High"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-sky-500/10 text-sky-400 border-sky-500/30"
                    }`}>
                      {goal.priority} Priority
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 mb-1.5">
                    <span>Current: <strong className="text-white">{goal.currentLevel}%</strong></span>
                    <span>Target: <strong className="text-sky-400">{goal.targetLevel}%</strong></span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800 mb-3">
                    <div
                      className="h-full rounded-full bg-sky-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, (goal.currentLevel / goal.targetLevel) * 100))}%` }}
                    />
                  </div>

                  {goal.notes && (
                    <p className="text-[11px] text-slate-400 mb-3 line-clamp-1 italic bg-slate-900/50 p-2 rounded">
                      "{goal.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {formattedDate}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateGoal(goal._id, { status: "Completed", currentLevel: goal.targetLevel })}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => onDeleteGoal(goal._id)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Create Skill Goal</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Node.js"
                  value={formData.skillName}
                  onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Current Level (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.currentLevel}
                    onChange={(e) => setFormData({ ...formData, currentLevel: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Level (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.targetLevel}
                    onChange={(e) => setFormData({ ...formData, targetLevel: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
                  >
                    <option value="Low" className="bg-slate-900">Low</option>
                    <option value="Medium" className="bg-slate-900">Medium</option>
                    <option value="High" className="bg-slate-900">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes</label>
                <textarea
                  rows="2"
                  placeholder="Target details or study goals..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/20"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

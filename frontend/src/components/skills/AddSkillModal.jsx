import React, { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle } from "lucide-react";
import { CATEGORIES } from "./SkillFilters";

const AUTOCOMPLETE_CATALOG = [
  "JavaScript", "React", "React Native", "TypeScript", "Node.js", "Express.js",
  "MongoDB", "Python", "Java", "C++", "HTML5", "CSS3", "TailwindCSS", "SQL",
  "PostgreSQL", "Docker", "Git & GitHub", "REST APIs", "Machine Learning",
  "Data Structures & Algorithms", "System Design", "Problem Solving", "UI/UX Design"
];

export default function AddSkillModal({ isOpen, onClose, onSubmit, initialSkill, existingSkills = [] }) {
  const isEdit = Boolean(initialSkill);

  const [formData, setFormData] = useState({
    name: "",
    category: "Programming",
    proficiencyPercentage: 60,
    learningStatus: "Learning",
    experienceLevel: "1 year",
    targetProficiency: 85,
    targetDate: "",
    description: "",
    evidence: "",
    githubUrl: "",
    portfolioUrl: ""
  });

  const [duplicateWarning, setDuplicateWarning] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (initialSkill) {
      setFormData({
        name: initialSkill.name || "",
        category: initialSkill.category || "Programming",
        proficiencyPercentage: initialSkill.proficiencyPercentage || 60,
        learningStatus: initialSkill.learningStatus || "Learning",
        experienceLevel: initialSkill.experienceLevel || "1 year",
        targetProficiency: initialSkill.targetProficiency || 85,
        targetDate: initialSkill.targetDate ? initialSkill.targetDate.split("T")[0] : "",
        description: initialSkill.description || "",
        evidence: "",
        githubUrl: "",
        portfolioUrl: ""
      });
    } else {
      setFormData({
        name: "",
        category: "Programming",
        proficiencyPercentage: 60,
        learningStatus: "Learning",
        experienceLevel: "1 year",
        targetProficiency: 85,
        targetDate: "",
        description: "",
        evidence: "",
        githubUrl: "",
        portfolioUrl: ""
      });
    }
    setDuplicateWarning("");
  }, [initialSkill, isOpen]);

  const handleNameChange = (val) => {
    setFormData((prev) => ({ ...prev, name: val }));

    if (val.trim() && !isEdit) {
      // Check duplicate
      const isDup = existingSkills.some((s) => s.name.toLowerCase() === val.trim().toLowerCase());
      if (isDup) {
        setDuplicateWarning("This skill is already in your profile.");
      } else {
        setDuplicateWarning("");
      }

      // Filter autocomplete suggestions
      const matches = AUTOCOMPLETE_CATALOG.filter((item) =>
        item.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setDuplicateWarning("");
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (item) => {
    handleNameChange(item);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    if (duplicateWarning) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white">
              {isEdit ? "Edit Skill" : "Add New Skill"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Skill Name with Autocomplete */}
          <div className="relative">
            <label className="block text-slate-300 font-semibold mb-1">Skill Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. React.js"
              value={formData.name}
              disabled={isEdit}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 outline-none focus:border-sky-500 disabled:opacity-60"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
            {duplicateWarning && (
              <p className="mt-1 text-[11px] text-amber-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {duplicateWarning}
              </p>
            )}
          </div>

          {/* Category & Experience Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 outline-none focus:border-sky-500"
              >
                {CATEGORIES.filter((c) => c !== "All Skills").map((c) => (
                  <option key={c} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 outline-none focus:border-sky-500"
              >
                <option value="< 6 months" className="bg-slate-900">&lt; 6 months</option>
                <option value="1 year" className="bg-slate-900">1 year</option>
                <option value="2+ years" className="bg-slate-900">2+ years</option>
                <option value="3+ years" className="bg-slate-900">3+ years</option>
              </select>
            </div>
          </div>

          {/* Current Proficiency Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">Current Proficiency *</label>
              <span className="font-bold text-sky-400">{formData.proficiencyPercentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.proficiencyPercentage}
              onChange={(e) => setFormData({ ...formData, proficiencyPercentage: Number(e.target.value) })}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Learning Status & Target Proficiency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Learning Status</label>
              <select
                value={formData.learningStatus}
                onChange={(e) => setFormData({ ...formData, learningStatus: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 outline-none focus:border-sky-500"
              >
                <option value="Learning" className="bg-slate-900">Learning</option>
                <option value="Practicing" className="bg-slate-900">Practicing</option>
                <option value="Proficient" className="bg-slate-900">Proficient</option>
                <option value="Verified" className="bg-slate-900">Verified</option>
                <option value="Needs Improvement" className="bg-slate-900">Needs Improvement</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Proficiency (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.targetProficiency}
                onChange={(e) => setFormData({ ...formData, targetProficiency: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description</label>
            <textarea
              rows="2"
              placeholder="Brief summary of your experience or topics learned..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-slate-200 outline-none focus:border-sky-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={Boolean(duplicateWarning)}
              className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition shadow-lg shadow-sky-500/20 disabled:opacity-50"
            >
              {isEdit ? "Update Skill" : "Add Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

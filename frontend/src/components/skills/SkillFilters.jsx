import React from "react";
import { Search, Filter, SortAsc } from "lucide-react";

export const CATEGORIES = [
  "All Skills",
  "Technical",
  "Programming",
  "Frameworks",
  "Database",
  "Tools",
  "Soft Skills",
  "Domain Skills"
];

export default function SkillFilters({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  proficiencyFilter,
  setProficiencyFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 shadow-lg backdrop-blur-xl mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-sky-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={proficiencyFilter}
              onChange={(e) => setProficiencyFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-slate-200"
            >
              <option value="" className="bg-slate-900">Proficiency (All)</option>
              <option value="Beginner" className="bg-slate-900">Beginner (0-25%)</option>
              <option value="Intermediate" className="bg-slate-900">Intermediate (26-50%)</option>
              <option value="Advanced" className="bg-slate-900">Advanced (51-80%)</option>
              <option value="Expert" className="bg-slate-900">Expert (81-100%)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-slate-200"
            >
              <option value="" className="bg-slate-900">Status (All)</option>
              <option value="Learning" className="bg-slate-900">Learning</option>
              <option value="Practicing" className="bg-slate-900">Practicing</option>
              <option value="Proficient" className="bg-slate-900">Proficient</option>
              <option value="Verified" className="bg-slate-900">Verified</option>
              <option value="Needs Improvement" className="bg-slate-900">Needs Improvement</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300">
            <SortAsc className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-slate-200"
            >
              <option value="Recently Updated" className="bg-slate-900">Recently Updated</option>
              <option value="Highest Proficiency" className="bg-slate-900">Highest Proficiency</option>
              <option value="Lowest Proficiency" className="bg-slate-900">Lowest Proficiency</option>
              <option value="Alphabetical" className="bg-slate-900">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                  : "bg-slate-950/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
    <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-4 sm:p-5 shadow-xs dark:shadow-slate-950/20 backdrop-blur-xl mb-6 transition-all duration-300">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--aura-text-muted)]" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] pl-10 pr-4 py-2.5 text-sm text-[var(--aura-text)] placeholder:text-[var(--aura-text-muted)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] px-3 py-2 text-xs text-[var(--aura-text-secondary)]">
            <Filter className="h-3.5 w-3.5 text-[var(--aura-text-muted)]" />
            <select
              value={proficiencyFilter}
              onChange={(e) => setProficiencyFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-[var(--aura-text)]"
            >
              <option value="" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Proficiency (All)</option>
              <option value="Beginner" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Beginner (0-25%)</option>
              <option value="Intermediate" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Intermediate (26-50%)</option>
              <option value="Advanced" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Advanced (51-80%)</option>
              <option value="Expert" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Expert (81-100%)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] px-3 py-2 text-xs text-[var(--aura-text-secondary)]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-[var(--aura-text)]"
            >
              <option value="" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Status (All)</option>
              <option value="Learning" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Learning</option>
              <option value="Practicing" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Practicing</option>
              <option value="Proficient" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Proficient</option>
              <option value="Verified" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Verified</option>
              <option value="Needs Improvement" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Needs Improvement</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[var(--aura-border)] bg-[var(--aura-surface-2)] px-3 py-2 text-xs text-[var(--aura-text-secondary)]">
            <SortAsc className="h-3.5 w-3.5 text-[var(--aura-text-muted)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-[var(--aura-text)]"
            >
              <option value="Recently Updated" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Recently Updated</option>
              <option value="Highest Proficiency" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Highest Proficiency</option>
              <option value="Lowest Proficiency" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Lowest Proficiency</option>
              <option value="Alphabetical" className="bg-[var(--aura-surface)] text-[var(--aura-text)]">Alphabetical</option>
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
              className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 text-white-force"
                  : "bg-[var(--aura-surface-2)] text-[var(--aura-text-secondary)] hover:text-[var(--aura-text)] hover:bg-[var(--aura-border)]"
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

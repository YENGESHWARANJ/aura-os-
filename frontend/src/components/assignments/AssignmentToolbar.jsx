import React from "react";
import { Search, Filter, RotateCcw, ArrowUpDown } from "lucide-react";

export default function AssignmentToolbar({
  searchQuery,
  onSearchChange,
  subjectFilter,
  onSubjectChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  deadlineFilter,
  onDeadlineChange,
  sortBy,
  onSortChange,
  subjects,
  onClearFilters,
}) {
  const hasActiveFilters =
    searchQuery ||
    subjectFilter ||
    statusFilter ||
    priorityFilter ||
    deadlineFilter ||
    sortBy !== "Newest";

  return (
    <div className="rounded-[24px] border border-slate-100 bg-white p-4 shadow-[0_4px_20px_rgba(30,40,90,0.03)] space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search assignments by title, subject, code, or faculty..."
            className="w-full rounded-2xl border border-slate-200 bg-[#f4f6fb] pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Sort & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[140px] flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-[#f4f6fb] px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-500 cursor-pointer pr-8"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Deadline Soonest">Deadline Soonest</option>
              <option value="Deadline Latest">Deadline Latest</option>
              <option value="Highest Marks">Highest Marks</option>
              <option value="Subject A-Z">Subject A-Z</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Secondary Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
          <Filter className="h-3.5 w-3.5 text-indigo-600" /> Filter:
        </span>

        {/* Subject Filter */}
        <select
          value={subjectFilter}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-[#f4f6fb] px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-indigo-500 cursor-pointer"
        >
          <option value="">All Subjects</option>
          {subjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-[#f4f6fb] px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-indigo-500 cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="GRADED">Graded</option>
          <option value="OVERDUE">Overdue</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-[#f4f6fb] px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-indigo-500 cursor-pointer"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        {/* Deadline Filter */}
        <select
          value={deadlineFilter}
          onChange={(e) => onDeadlineChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-[#f4f6fb] px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-indigo-500 cursor-pointer"
        >
          <option value="">All Deadlines</option>
          <option value="Today">Due Today</option>
          <option value="Tomorrow">Due Tomorrow</option>
          <option value="This Week">Due This Week</option>
          <option value="This Month">Due This Month</option>
        </select>
      </div>
    </div>
  );
}

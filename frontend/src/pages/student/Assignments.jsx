import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  getAssignments,
  getAssignmentStats,
  getUpcomingDeadlines,
  submitAssignment,
  resubmitAssignment
} from "../../services/assignmentService";

import AssignmentStats from "../../components/assignments/AssignmentStats";
import DeadlineAlert from "../../components/assignments/DeadlineAlert";
import AssignmentTabs from "../../components/assignments/AssignmentTabs";
import AssignmentToolbar from "../../components/assignments/AssignmentToolbar";
import AssignmentTable from "../../components/assignments/AssignmentTable";
import AssignmentDetailsDrawer from "../../components/assignments/AssignmentDetailsDrawer";
import SubmissionModal from "../../components/assignments/SubmissionModal";
import UpcomingDeadlines from "../../components/assignments/UpcomingDeadlines";
import AssignmentProgress from "../../components/assignments/AssignmentProgress";
import AssignmentPerformanceChart from "../../components/assignments/AssignmentPerformanceChart";
import AssignmentSkeleton from "../../components/assignments/AssignmentSkeleton";
import AssignmentEmptyState from "../../components/assignments/AssignmentEmptyState";

import { AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & State
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  // Selection & Modals
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [assignmentsRes, statsRes, upcomingRes] = await Promise.all([
        getAssignments({
          search: searchQuery,
          subject: subjectFilter,
          status: statusFilter || (activeTab !== "ALL" ? activeTab : undefined),
          priority: priorityFilter,
          deadlineFilter,
          sortBy
        }),
        getAssignmentStats(),
        getUpcomingDeadlines()
      ]);

      setAssignments(assignmentsRes.data || []);
      setStats(statsRes.data || null);
      setUpcoming(upcomingRes.data || []);
    } catch (err) {
      console.error("Error loading assignments:", err);
      setError("We couldn't retrieve your assignment data.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, subjectFilter, statusFilter, activeTab, priorityFilter, deadlineFilter, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Unique list of subjects for filtering
  const subjects = useMemo(() => {
    const set = new Set(assignments.map((a) => a.subject).filter(Boolean));
    return Array.from(set);
  }, [assignments]);

  // Find urgent assignment (unsubmitted & deadline in next 48h)
  const urgentAssignment = useMemo(() => {
    const now = new Date();
    const next48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    return assignments.find((a) => {
      if (a.computedStatus === "SUBMITTED" || a.computedStatus === "GRADED") return false;
      const d = new Date(a.deadline);
      return d > now && d <= next48h;
    });
  }, [assignments]);

  // Filtered assignments based on current tab
  const displayedAssignments = useMemo(() => {
    if (activeTab === "ALL") return assignments;
    return assignments.filter((a) => a.computedStatus.toUpperCase() === activeTab.toUpperCase());
  }, [assignments, activeTab]);

  // Tab change handler
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSubjectFilter("");
    setStatusFilter("");
    setPriorityFilter("");
    setDeadlineFilter("");
    setSortBy("Newest");
    setActiveTab("ALL");
  };

  // Select assignment to view drawer
  const handleSelectAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setIsDrawerOpen(true);
  };

  // Open submission modal
  const handleOpenSubmission = (assignment) => {
    setSubmittingAssignment(assignment);
    setIsSubmissionModalOpen(true);
  };

  // Submit assignment handler
  const handleSubmitAssignment = async (assignmentId, file, notes) => {
    try {
      const isResubmission = submittingAssignment?.computedStatus === "SUBMITTED";
      let updated;

      if (isResubmission) {
        updated = await resubmitAssignment(assignmentId, file, notes);
      } else {
        updated = await submitAssignment(assignmentId, file, notes);
      }

      toast.success("Assignment submitted successfully!");
      fetchData();

      // Update currently selected drawer assignment if open
      if (selectedAssignment && selectedAssignment._id === assignmentId) {
        setSelectedAssignment(updated.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed.");
      throw err;
    }
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
      subjectFilter ||
      statusFilter ||
      priorityFilter ||
      deadlineFilter ||
      sortBy !== "Newest" ||
      activeTab !== "ALL"
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="text-sky-400">Assignments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Assignments
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your coursework, deadlines, submissions and grades.
          </p>
        </div>

        {/* Header Right Semester Filter */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-300">
            Semester 4 • 2026
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 backdrop-blur-xl flex flex-col items-center justify-center text-center gap-3">
          <AlertCircle className="h-10 w-10 text-rose-400" />
          <div>
            <h3 className="text-base font-bold text-white">Unable to load assignments</h3>
            <p className="text-xs text-slate-400 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-semibold transition mt-2 shadow-lg shadow-rose-500/20"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !error && <AssignmentSkeleton />}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Summary KPI Cards */}
          <AssignmentStats stats={stats} />

          {/* Urgent Deadline Banner */}
          <DeadlineAlert urgentAssignment={urgentAssignment} onView={handleSelectAssignment} />

          {/* Tabs & Toolbar */}
          <div className="space-y-4">
            <AssignmentTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              counts={stats}
            />

            <AssignmentToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              subjectFilter={subjectFilter}
              onSubjectChange={setSubjectFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              deadlineFilter={deadlineFilter}
              onDeadlineChange={setDeadlineFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              subjects={subjects}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Assignment Display Table / Cards / Empty State */}
          {displayedAssignments.length === 0 ? (
            <AssignmentEmptyState
              hasFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <AssignmentTable
              assignments={displayedAssignments}
              onSelectAssignment={handleSelectAssignment}
              onSubmitClick={handleOpenSubmission}
            />
          )}

          {/* Grid Layout: Upcoming Deadlines + Progress Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UpcomingDeadlines
              upcomingAssignments={upcoming}
              onSelectAssignment={handleSelectAssignment}
            />
            <AssignmentProgress stats={stats} />
          </div>

          {/* Subject Performance Bar Chart */}
          <AssignmentPerformanceChart subjectPerformance={stats?.subjectPerformance || []} />
        </>
      )}

      {/* Details Drawer */}
      <AssignmentDetailsDrawer
        assignment={selectedAssignment}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmitClick={(asm) => {
          setIsDrawerOpen(false);
          handleOpenSubmission(asm);
        }}
      />

      {/* Submission Modal */}
      <SubmissionModal
        assignment={submittingAssignment}
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSubmit={handleSubmitAssignment}
      />
    </div>
  );
}

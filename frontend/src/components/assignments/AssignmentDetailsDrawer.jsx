import React from "react";
import AssignmentStatusBadge from "./AssignmentStatusBadge";
import DeadlineBadge from "./DeadlineBadge";
import {
  X,
  FileText,
  Calendar,
  Award,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from "lucide-react";

export default function AssignmentDetailsDrawer({
  assignment,
  isOpen,
  onClose,
  onSubmitClick
}) {
  if (!isOpen || !assignment) return null;

  const sub = assignment.studentSubmission;
  const isGraded = assignment.computedStatus === "GRADED";
  const isSubmitted = assignment.computedStatus === "SUBMITTED";
  const isPending = assignment.computedStatus === "PENDING";
  const isOverdue = assignment.computedStatus === "OVERDUE";

  const assignedFormatted = new Date(assignment.assignedDate || assignment.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const deadlineFormatted = new Date(assignment.deadline).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const submittedFormatted = sub?.submittedAt
    ? new Date(sub.submittedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : null;

  const percentage = isGraded && assignment.maxMarks
    ? Math.round((sub.marksObtained / assignment.maxMarks) * 100)
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-slate-950 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                {assignment.subjectCode} • {assignment.subject}
              </span>
              <AssignmentStatusBadge status={assignment.computedStatus} />
            </div>
            <h2 className="text-xl font-bold text-white">{assignment.title}</h2>
            <p className="text-xs text-slate-400">Assigned by {assignment.faculty}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
              <p className="text-xs text-slate-500 font-medium">Assigned</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">{assignedFormatted}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
              <p className="text-xs text-slate-500 font-medium">Deadline</p>
              <div className="mt-1">
                <DeadlineBadge deadline={assignment.deadline} computedStatus={assignment.computedStatus} />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
              <p className="text-xs text-slate-500 font-medium">Max Marks</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">{assignment.maxMarks} Points</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
              <p className="text-xs text-slate-500 font-medium">Priority</p>
              <p className="text-xs font-semibold text-amber-400 mt-1">{assignment.priority}</p>
            </div>
          </div>

          {/* Section 1: Overview & Instructions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileText className="h-4 w-4 text-sky-400" /> Description & Instructions
            </h3>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300 leading-relaxed space-y-3">
              <p>{assignment.description}</p>
              {assignment.instructions && (
                <div className="pt-3 border-t border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Specific Instructions:</span>
                  <p className="text-xs text-slate-400 italic">{assignment.instructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Attachments */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Download className="h-4 w-4 text-sky-400" /> Faculty Attachments
              </h3>
              <div className="space-y-2">
                {assignment.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60"
                  >
                    <div className="flex items-center gap-3">
                      <FileCheck className="h-5 w-5 text-sky-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">{att.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {att.size ? `${(att.size / 1024).toFixed(1)} KB` : "Document"}
                        </p>
                      </div>
                    </div>
                    <a
                      href={att.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold transition"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Grading & Feedback (If Graded) */}
          {isGraded && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Award className="h-4 w-4" /> Grading & Evaluation
              </h3>
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-xs text-emerald-300 font-medium">Marks</p>
                    <p className="text-xl font-bold text-white mt-1">
                      {sub?.marksObtained} <span className="text-xs text-slate-400">/ {assignment.maxMarks}</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-xs text-emerald-300 font-medium">Percentage</p>
                    <p className="text-xl font-bold text-white mt-1">{percentage}%</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-xs text-emerald-300 font-medium">Grade</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1">{sub?.grade || "A"}</p>
                  </div>
                </div>

                {sub?.feedback && (
                  <div className="pt-3 border-t border-emerald-500/20">
                    <p className="text-xs font-semibold text-emerald-300">Faculty Feedback:</p>
                    <p className="text-xs text-slate-300 italic mt-1 font-serif">"{sub.feedback}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Submission Status */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Upload className="h-4 w-4 text-sky-400" /> Submission Status
            </h3>

            {sub ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">Submitted ✓</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      sub.isLate ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {sub.isLate ? "Late Submission" : "On Time"}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <p>
                    <strong className="text-slate-300">Submission Date:</strong> {submittedFormatted}
                  </p>
                  {sub.file && (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-sky-400" />
                        <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                          {sub.file.name}
                        </span>
                      </div>
                      <a
                        href={sub.file.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-400 hover:underline font-semibold"
                      >
                        Download File
                      </a>
                    </div>
                  )}
                  {sub.notes && (
                    <p>
                      <strong className="text-slate-300">Notes:</strong> {sub.notes}
                    </p>
                  )}
                </div>

                {/* Resubmission Action */}
                {assignment.allowResubmission && !isGraded && (
                  <div className="pt-2">
                    <button
                      onClick={() => onSubmitClick(assignment)}
                      className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold transition border border-sky-500/30"
                    >
                      Replace Submission
                    </button>
                  </div>
                )}
              </div>
            ) : isOverdue && !assignment.allowLateSubmission ? (
              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-5 text-center space-y-2">
                <AlertCircle className="h-8 w-8 text-rose-400 mx-auto" />
                <h4 className="text-sm font-bold text-rose-400">Submission Closed</h4>
                <p className="text-xs text-slate-400">
                  The deadline for this assignment has passed and late submissions are disabled.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 text-center space-y-3">
                <Clock className="h-8 w-8 text-amber-400 mx-auto" />
                <p className="text-xs text-slate-400">
                  You haven't submitted your response for this assignment yet.
                </p>
                <button
                  onClick={() => onSubmitClick(assignment)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition shadow-lg shadow-sky-600/20"
                >
                  <Upload className="h-4 w-4" />
                  Submit Assignment Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import AssignmentStatusBadge from "./AssignmentStatusBadge";
import DeadlineBadge from "./DeadlineBadge";
import { Eye, Upload, FileText, ChevronRight } from "lucide-react";

export default function AssignmentTable({
  assignments,
  onSelectAssignment,
  onSubmitClick,
}) {
  if (!assignments || assignments.length === 0) return null;

  return (
    <div>
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto rounded-[24px] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(30,40,90,0.03)]">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-[#f8faff] text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th scope="col" className="py-4 px-5">Assignment</th>
              <th scope="col" className="py-4 px-4">Subject</th>
              <th scope="col" className="py-4 px-4">Faculty</th>
              <th scope="col" className="py-4 px-4">Deadline</th>
              <th scope="col" className="py-4 px-4">Priority</th>
              <th scope="col" className="py-4 px-4">Status</th>
              <th scope="col" className="py-4 px-4">Marks</th>
              <th scope="col" className="py-4 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {assignments.map((asm) => {
              const sub = asm.studentSubmission;
              const isGraded = asm.computedStatus === "GRADED";
              const isSubmitted = asm.computedStatus === "SUBMITTED";
              const isPending = asm.computedStatus === "PENDING";
              const isOverdue = asm.computedStatus === "OVERDUE";

              return (
                <tr
                  key={asm._id}
                  onClick={() => onSelectAssignment(asm)}
                  className="hover:bg-[#f8faff] transition cursor-pointer group"
                >
                  {/* Title & Code */}
                  <td className="py-4 px-5 max-w-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
                          {asm.title}
                        </p>
                        <p className="text-xs text-slate-400 font-semibold">{asm.subjectCode}</p>
                      </div>
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="py-4 px-4 text-slate-800 font-bold truncate max-w-[150px]">
                    {asm.subject}
                  </td>

                  {/* Faculty */}
                  <td className="py-4 px-4 text-slate-500 text-xs truncate max-w-[130px] font-semibold">
                    {asm.faculty}
                  </td>

                  {/* Deadline */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <DeadlineBadge deadline={asm.deadline} computedStatus={asm.computedStatus} />
                  </td>

                  {/* Priority */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${asm.priority === "Urgent"
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : asm.priority === "High"
                            ? "bg-amber-50 text-amber-600 border border-amber-200"
                            : asm.priority === "Low"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-blue-50 text-blue-600 border border-blue-200"
                        }`}
                    >
                      {asm.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <AssignmentStatusBadge status={asm.computedStatus} />
                  </td>

                  {/* Marks */}
                  <td className="py-4 px-4 whitespace-nowrap font-bold">
                    {isGraded ? (
                      <span className="text-emerald-600 font-extrabold">
                        {sub?.marksObtained} / {asm.maxMarks}
                      </span>
                    ) : (
                      <span className="text-slate-400">-- / {asm.maxMarks}</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {(isPending || isOverdue) && (
                        <button
                          onClick={() => onSubmitClick(asm)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white text-xs font-bold transition cursor-pointer shadow-2xs"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <span>Submit</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectAssignment(asm)}
                        className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-3">
        {assignments.map((asm) => {
          const isPending = asm.computedStatus === "PENDING";
          const isOverdue = asm.computedStatus === "OVERDUE";

          return (
            <div
              key={asm._id}
              onClick={() => onSelectAssignment(asm)}
              className="rounded-[22px] border border-slate-100 bg-white p-4.5 shadow-[0_4px_20px_rgba(30,40,90,0.03)] space-y-3 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">{asm.title}</h4>
                    <p className="text-xs text-slate-400 font-semibold">{asm.subjectCode} • {asm.subject}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                <AssignmentStatusBadge status={asm.computedStatus} />
                <DeadlineBadge deadline={asm.deadline} computedStatus={asm.computedStatus} />
              </div>

              {(isPending || isOverdue) && (
                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubmitClick(asm);
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Submit Assignment</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

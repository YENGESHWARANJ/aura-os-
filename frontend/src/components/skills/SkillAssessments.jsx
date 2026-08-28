import React from "react";
import { CheckCircle2, Award, FileSpreadsheet } from "lucide-react";

export default function SkillAssessments({ assessments = [] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-400" /> Assessment History
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified quiz scores, technical challenges and competency evaluations
          </p>
        </div>
      </div>

      {assessments.length === 0 ? (
        <div className="text-center p-8 bg-slate-950/60 rounded-xl border border-slate-800">
          <FileSpreadsheet className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No assessments completed yet</p>
          <p className="text-xs text-slate-500 mt-1">Take skill assessments to earn verified badges on your profile.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Assessment</th>
                <th className="pb-3 px-3">Skill</th>
                <th className="pb-3 px-3">Score</th>
                <th className="pb-3 px-3">Level</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {assessments.map((item, idx) => {
                const formattedDate = item.date
                  ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Recent";

                return (
                  <tr key={idx} className="hover:bg-slate-950/50 transition">
                    <td className="py-3 px-3 font-semibold text-white">{item.assessmentName}</td>
                    <td className="py-3 px-3 text-sky-400">{item.skillName}</td>
                    <td className="py-3 px-3 font-bold text-slate-200">
                      {item.score} / {item.maxScore || 100}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">
                        {item.level}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{formattedDate}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        item.status === "Passed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}>
                        <CheckCircle2 className="h-3 w-3" /> {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Grid, AlertTriangle, CheckCircle, Clock, Sparkles } from "lucide-react";

export default function SkillGapHeatmap({ topics = [] }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "critical_gap":
        return {
          label: "Critical Gap",
          classes: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        };
      case "outdated":
        return {
          label: "Outdated Topic",
          classes: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        };
      case "emerging":
        return {
          label: "Emerging Domain",
          classes: "bg-purple-500/15 text-purple-400 border-purple-500/30",
        };
      case "current":
      default:
        return {
          label: "Curriculum Aligned",
          classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };
    }
  };

  const getHeatmapColor = (score) => {
    if (score >= 75) return "text-rose-400 font-extrabold";
    if (score >= 45) return "text-amber-400 font-bold";
    return "text-emerald-400 font-semibold";
  };

  return (
    <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--aura-border)]/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Grid className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--aura-text)]">
              Syllabus & Concept Friction Heatmap
            </h3>
          </div>
          <p className="text-xs text-[var(--aura-text-muted)] mt-1">
            Topic-level mapping of failure rates, student struggle index, and practical deficits
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-400 font-semibold">
            Critical Gap
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-400 font-semibold">
            Outdated
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-purple-500/30 bg-purple-500/10 text-purple-400 font-semibold">
            Emerging
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold">
            Aligned
          </span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--aura-border)] text-[var(--aura-text-muted)] uppercase text-[10px] font-bold">
              <th className="pb-3 pl-2">Course</th>
              <th className="pb-3">Syllabus Topic</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-center">Failure Rate</th>
              <th className="pb-3 text-center">Struggle Index</th>
              <th className="pb-3 text-center">Practical Activity</th>
              <th className="pb-3 text-center pr-2">Industry Relevance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--aura-border)]/50">
            {topics.map((t, idx) => {
              const statusMeta = getStatusBadge(t.status);
              return (
                <tr
                  key={idx}
                  className="hover:bg-[var(--aura-surface-2)]/50 transition-colors"
                >
                  <td className="py-3.5 pl-2 font-mono text-[11px] font-bold text-cyan-400">
                    {t.courseCode}
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-[var(--aura-text)] block">
                      {t.topicName}
                    </span>
                    <span className="text-[10px] text-[var(--aura-text-muted)] block">
                      {t.courseName}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-block rounded-lg border px-2 py-0.5 text-[10px] font-extrabold uppercase ${statusMeta.classes}`}
                    >
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className={`py-3.5 text-center ${getHeatmapColor(t.failureRatePercent)}`}>
                    {t.failureRatePercent}%
                  </td>
                  <td className={`py-3.5 text-center ${getHeatmapColor(t.studentStruggleScore)}`}>
                    {t.studentStruggleScore} / 100
                  </td>
                  <td className="py-3.5 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-[var(--aura-surface-2)] rounded-full overflow-hidden border border-[var(--aura-border)]">
                        <div
                          className={`h-full rounded-full ${
                            t.practicalActivityScore < 40
                              ? "bg-rose-500"
                              : t.practicalActivityScore < 70
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${t.practicalActivityScore}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-[var(--aura-text-muted)]">
                        {t.practicalActivityScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 text-center pr-2 font-bold text-indigo-400">
                    {t.industryRelevanceScore} / 100
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

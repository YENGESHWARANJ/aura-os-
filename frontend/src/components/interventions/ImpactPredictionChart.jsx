import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function ImpactPredictionChart({ baseline, projected }) {
  if (!baseline || !projected) return null;

  const chartData = [
    {
      metric: "Marks",
      Baseline: baseline.marks,
      Projected: projected.marks,
    },
    {
      metric: "Attendance",
      Baseline: baseline.attendance,
      Projected: projected.attendance,
    },
    {
      metric: "Assignments",
      Baseline: baseline.assignmentScore,
      Projected: projected.assignmentScore,
    },
    {
      metric: "Quizzes",
      Baseline: baseline.quizScore,
      Projected: projected.quizScore,
    },
    {
      metric: "Weighted Score",
      Baseline: baseline.weightedScore,
      Projected: projected.weightedScore,
    },
  ];

  return (
    <div className="rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-extrabold text-[var(--aura-text)]">
            Predictive Dimension Trajectory
          </h3>
          <p className="text-xs text-[var(--aura-text-muted)]">
            Multi-attribute comparison across AURA OS weighted indicator components
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="metric"
              stroke="var(--aura-text-muted)"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              stroke="var(--aura-text-muted)"
              fontSize={11}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--aura-surface)",
                borderColor: "var(--aura-border)",
                borderRadius: "12px",
                color: "var(--aura-text)",
                fontSize: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
            />
            <Bar
              dataKey="Baseline"
              fill="#64748b"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
            <Bar
              dataKey="Projected"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

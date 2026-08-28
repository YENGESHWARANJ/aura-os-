import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { BarChart2 } from "lucide-react";

export default function AssignmentPerformanceChart({ subjectPerformance }) {
  const hasData = subjectPerformance && subjectPerformance.length > 0;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-sky-400" /> Assignment Performance by Subject
        </h3>
      </div>

      {!hasData ? (
        <div className="h-48 flex items-center justify-center rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4 text-center">
          <p className="text-xs text-slate-500 italic">
            Performance analytics will appear after assignments are graded.
          </p>
        </div>
      ) : (
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="subject" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "1rem",
                  color: "#f8fafc",
                  fontSize: "12px"
                }}
              />
              <Bar dataKey="averagePercentage" name="Avg Score" fill="#38bdf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

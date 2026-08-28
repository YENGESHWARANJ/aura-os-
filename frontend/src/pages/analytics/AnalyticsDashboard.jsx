import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { getAnalyticsOverview } from "../../services/analyticsService";
import "./Analytics.css";

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [semester, setSemester] = useState("All");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // What-If Simulator state
  const [simAttendance, setSimAttendance] = useState(86);
  const [simStudyHours, setSimStudyHours] = useState(14);
  const [simAssignments, setSimAssignments] = useState(86);
  const [simExamPrep, setSimExamPrep] = useState(70);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await getAnalyticsOverview(semester);
      if (res?.data) {
        setData(res.data);
        if (res.data.overview?.attendance?.pct) {
          setSimAttendance(res.data.overview.attendance.pct);
        }
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [semester]);

  // Dynamic calculation for What-If Simulator
  const simulatedHealthScore = Math.min(
    100,
    Math.round(
      simAttendance * 0.35 +
      simAssignments * 0.25 +
      (simStudyHours / 20) * 100 * 0.20 +
      simExamPrep * 0.20
    )
  );

  if (loading && !data) {
    return (
      <div className="analytics-container flex items-center justify-center min-h-screen">
        <div className="text-slate-400 font-semibold text-lg animate-pulse">
          Loading Academic Analytics Dashboard...
        </div>
      </div>
    );
  }

  const {
    overview,
    academicHealth,
    riskAnalysis,
    earlyWarnings,
    forecast,
    subjectPerformance,
    performanceTrend,
    gpaTrend,
    skillDistribution,
    strengths,
    weaknesses,
    recommendedActions,
    insights,
    auraAi
  } = data || {};

  return (
    <div className="analytics-container">
      {/* ─── 1. PAGE HEADER ────────────────────────────────────────── */}
      <div className="analytics-header">
        <div className="analytics-header-title">
          <div className="analytics-breadcrumb">
            Dashboard &gt; <span>Analytics</span>
          </div>
          <h1>Academic Analytics</h1>
          <p>
            Track your academic performance, study habits, skills, attendance
            and progress with intelligent insights.
          </p>
        </div>
        <div className="analytics-controls">
          <select
            className="analytics-select"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="All">This Semester</option>
            <option value="Sem 1">Semester 1</option>
            <option value="Sem 2">Semester 2</option>
            <option value="Sem 3">Semester 3</option>
            <option value="Sem 4">Semester 4</option>
          </select>

          <button
            className="analytics-btn analytics-btn-outline"
            onClick={() => window.print()}
          >
            🖨️ Export Report
          </button>
          <button className="analytics-btn" onClick={fetchAnalytics}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* ─── 2. KPI OVERVIEW CARDS ─────────────────────────────────── */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="analytics-kpi-header">
            <span>Academic Score</span>
            <span className="analytics-kpi-icon bg-blue-500/20 text-blue-400">📊</span>
          </div>
          <div className="analytics-kpi-val">
            {overview?.overallAcademicScore?.score ?? 82} / 100
          </div>
          <div className="analytics-kpi-sub positive">
            {overview?.overallAcademicScore?.change || "+4.2% from previous semester"}
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-header">
            <span>Current GPA</span>
            <span className="analytics-kpi-icon bg-purple-500/20 text-purple-400">🎓</span>
          </div>
          <div className="analytics-kpi-val">
            {overview?.currentGpa?.gpa ?? "8.42"}
          </div>
          <div className="analytics-kpi-sub">
            Previous: {overview?.currentGpa?.prevGpa ?? "8.10"}
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-header">
            <span>Attendance</span>
            <span className="analytics-kpi-icon bg-emerald-500/20 text-emerald-400">📅</span>
          </div>
          <div className="analytics-kpi-val">
            {overview?.attendance?.pct ?? 86}%
          </div>
          <div className="analytics-kpi-sub positive">
            Status: {overview?.attendance?.status ?? "Safe"} (+{overview?.attendance?.safeMargin ?? 11}% margin)
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-header">
            <span>Assignment Completion</span>
            <span className="analytics-kpi-icon bg-amber-500/20 text-amber-400">📝</span>
          </div>
          <div className="analytics-kpi-val">
            {overview?.assignmentCompletion?.completed ?? 18} / {overview?.assignmentCompletion?.total ?? 21}
          </div>
          <div className="analytics-kpi-sub positive">
            {overview?.assignmentCompletion?.rate ?? 86}% completed
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-header">
            <span>Study Goal Completion</span>
            <span className="analytics-kpi-icon bg-cyan-500/20 text-cyan-400">🎯</span>
          </div>
          <div className="analytics-kpi-val">
            {overview?.studyGoalCompletion?.pct ?? 78}%
          </div>
          <div className="analytics-kpi-sub">On Track</div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-kpi-header">
            <span>Skills Progress</span>
            <span className="analytics-kpi-icon bg-indigo-500/20 text-indigo-400">⚡</span>
          </div>
          <div className="analytics-kpi-val">
            {overview?.skillsProgress?.pct ?? 72}%
          </div>
          <div className="analytics-kpi-sub positive">Advanced Level</div>
        </div>
      </div>

      {/* ─── 3. ACADEMIC HEALTH SCORE & PERFORMANCE TREND ────────────── */}
      <div className="analytics-grid-2">
        <div className="analytics-card">
          <div className="analytics-card-title">
            <span>❤️ Academic Health Score</span>
            <span className="analytics-status-badge excellent">
              {academicHealth?.status || "Good"}
            </span>
          </div>
          <div className="health-score-container">
            <div className="health-score-badge">
              <div className="health-score-num">
                {academicHealth?.score || 84}
              </div>
              <div className="health-score-status">Health Score</div>
            </div>

            <div className="health-breakdown">
              {Object.entries(academicHealth?.breakdown || {
                Academics: 82,
                Attendance: 86,
                Assignments: 86,
                "Study Habits": 84,
                Skills: 72,
                Projects: 78
              }).map(([key, val]) => (
                <div key={key}>
                  <div className="health-bar-row">
                    <span className="capitalize">{key}</span>
                    <span className="font-semibold">{val}%</span>
                  </div>
                  <div className="health-bar-bg">
                    <div
                      className="health-bar-fill"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-title">
            <span>📈 Academic Performance Trend</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    color: "#f8fafc"
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="academicScore"
                  name="Academic Score"
                  stroke="#38bdf8"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  name="Attendance"
                  stroke="#4ade80"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="assignments"
                  name="Assignments"
                  stroke="#fbbf24"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── 4. GPA & SUBJECT PERFORMANCE ───────────────────────────── */}
      <div className="analytics-grid-2">
        <div className="analytics-card">
          <div className="analytics-card-title">
            <span>🏆 GPA & CGPA Progress</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpaTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="semester" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    color: "#f8fafc"
                  }}
                />
                <Bar dataKey="gpa" name="GPA" fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-title">
            <span>🌐 Skill Distribution</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillDistribution || []}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="category" stroke="#cbd5e1" />
                <PolarRadiusAxis stroke="#94a3b8" angle={30} domain={[0, 100]} />
                <Radar
                  name="Skills"
                  dataKey="score"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── 5. SUBJECT PERFORMANCE TABLE ───────────────────────────── */}
      <div className="analytics-card">
        <div className="analytics-card-title">
          <span>📚 Subject Performance</span>
        </div>
        <div className="overflow-x-auto">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Internal Marks</th>
                <th>Assignment Score</th>
                <th>Attendance</th>
                <th>Overall Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(subjectPerformance || []).map((sub, idx) => (
                <tr key={idx}>
                  <td className="font-semibold text-slate-100">{sub.subject}</td>
                  <td>{sub.internalMarks}%</td>
                  <td>{sub.assignmentScore}%</td>
                  <td>{sub.attendance}%</td>
                  <td className="font-bold text-blue-400">{sub.overallScore}%</td>
                  <td>
                    <span
                      className={`analytics-status-badge ${sub.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 6. WHAT-IF SIMULATOR & FORECAST ─────────────────────────── */}
      <div className="analytics-grid-2">
        <div className="analytics-card">
          <div className="analytics-card-title">
            <span>🎛️ Performance Simulator (What-If Analysis)</span>
          </div>
          <div className="sim-controls">
            <div className="sim-slider-row">
              <div className="sim-slider-label">
                <span>Attendance</span>
                <span className="font-bold text-blue-400">{simAttendance}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={simAttendance}
                onChange={(e) => setSimAttendance(Number(e.target.value))}
                className="sim-slider-input"
              />
            </div>

            <div className="sim-slider-row">
              <div className="sim-slider-label">
                <span>Weekly Study Hours</span>
                <span className="font-bold text-blue-400">{simStudyHours} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={simStudyHours}
                onChange={(e) => setSimStudyHours(Number(e.target.value))}
                className="sim-slider-input"
              />
            </div>

            <div className="sim-slider-row">
              <div className="sim-slider-label">
                <span>Assignment Completion Rate</span>
                <span className="font-bold text-blue-400">{simAssignments}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={simAssignments}
                onChange={(e) => setSimAssignments(Number(e.target.value))}
                className="sim-slider-input"
              />
            </div>

            <div className="mt-4 p-4 bg-slate-900 border border-slate-700 rounded-lg flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold">
                  Projected Health Score
                </div>
                <div className="text-2xl font-extrabold text-emerald-400">
                  {simulatedHealthScore} / 100
                </div>
              </div>
              <div className="text-xs text-slate-400 text-right">
                Formula: Attendance (35%) + Assignments (25%) + Study (20%) + Exam (20%)
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-title">
            <span>🔮 Performance Forecast & Early Warnings</span>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-300">
                Projected Semester Score
              </span>
              <span className="text-lg font-bold text-blue-400">
                {forecast?.projectedSemesterScore}% ({forecast?.trend})
              </span>
            </div>
            <p className="text-xs text-slate-400">{forecast?.label}</p>
          </div>

          <div className="text-xs font-semibold text-slate-400 uppercase mb-2">
            Early Warnings System
          </div>
          <div className="space-y-2">
            {(earlyWarnings || []).map((warn, i) => (
              <div
                key={i}
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300 flex items-center justify-between"
              >
                <span>{warn.message}</span>
                <span className="font-bold text-red-400">{warn.urgency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 7. AURA ACADEMIC INTELLIGENCE (AURA AI) ──────────────────── */}
      <div className="aura-ai-box">
        <div className="aura-ai-header">
          <span>✨ AURA Academic Intelligence</span>
        </div>
        <div className="aura-ai-grid">
          <div className="aura-ai-card">
            <h4>Performance Insight</h4>
            <p>{auraAi?.performanceInsight}</p>
          </div>
          <div className="aura-ai-card">
            <h4>Attendance Insight</h4>
            <p>{auraAi?.attendanceInsight}</p>
          </div>
          <div className="aura-ai-card">
            <h4>Study Insight</h4>
            <p>{auraAi?.studyInsight}</p>
          </div>
          <div className="aura-ai-card">
            <h4>Skill Insight</h4>
            <p>{auraAi?.skillInsight}</p>
          </div>
        </div>
      </div>

      {/* ─── 8. RECOMMENDED ACTIONS ─────────────────────────────────── */}
      <div className="analytics-card">
        <div className="analytics-card-title">
          <span>🎯 Recommended Actions</span>
        </div>
        <div className="rec-actions-list">
          {(recommendedActions || []).map((act, i) => (
            <div key={i} className="rec-action-item">
              <div className="flex items-center gap-3">
                <span
                  className={`rec-action-priority ${
                    act.priority.includes("HIGH")
                      ? "high"
                      : act.priority.includes("MEDIUM")
                      ? "medium"
                      : "low"
                  }`}
                >
                  {act.priority}
                </span>
                <div>
                  <div className="rec-action-title">{act.title}</div>
                  <div className="rec-action-reason">{act.reason}</div>
                </div>
              </div>
              <button
                className="analytics-btn analytics-btn-outline text-xs"
                onClick={() => navigate(act.route)}
              >
                Go to Module &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

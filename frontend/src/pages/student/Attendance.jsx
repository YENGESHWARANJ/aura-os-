import { useState, useMemo } from "react";
import { exportAttendanceReport } from "../../utils/exportUtils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  BookOpen,
  Info,
  Download,
  Filter,
  BarChart2,
  Activity,
  Shield,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

/* ──────────────────────────── MOCK DATA ──────────────────────────── */

const SUBJECTS = [
  {
    id: "AIDS701",
    code: "22AI701",
    name: "Data Visualisation",
    shortName: "DATA VIZ",
    faculty: "NITHYA K",
    section: "AIDS - S7",
    totalClasses: 45,
    present: 21,
    absent: 24,
    type: "Theory",
    color: "#6366f1",
  },
  {
    id: "AIDS702",
    code: "22AI702",
    name: "Natural Language Processing",
    shortName: "NLP",
    faculty: "DR. SURESH R",
    section: "AIDS - S7",
    totalClasses: 40,
    present: 34,
    absent: 6,
    type: "Theory",
    color: "#0ea5e9",
  },
  {
    id: "AIDS703",
    code: "22AI703",
    name: "Computer Vision",
    shortName: "CV",
    faculty: "DR. PRIYA S",
    section: "AIDS - S7",
    totalClasses: 38,
    present: 31,
    absent: 7,
    type: "Theory",
    color: "#10b981",
  },
  {
    id: "AIDS704",
    code: "22AI704",
    name: "Reinforcement Learning",
    shortName: "RL",
    faculty: "PROF. ANITA N",
    section: "AIDS - S7",
    totalClasses: 35,
    present: 29,
    absent: 6,
    type: "Theory",
    color: "#a78bfa",
  },
  {
    id: "AIDS705",
    code: "22AI705",
    name: "Big Data Analytics",
    shortName: "BDA",
    faculty: "DR. VIJAY B",
    section: "AIDS - S7",
    totalClasses: 42,
    present: 38,
    absent: 4,
    type: "Theory",
    color: "#f59e0b",
  },
  {
    id: "AIDS706",
    code: "22AI706",
    name: "IoT & Embedded Systems",
    shortName: "IoT",
    faculty: "PROF. SUNITA M",
    section: "AIDS - S7",
    totalClasses: 30,
    present: 22,
    absent: 8,
    type: "Lab",
    color: "#f43f5e",
  },
  {
    id: "AIDS707",
    code: "22AI707",
    name: "Project Work",
    shortName: "PROJECT",
    faculty: "DR. PRIYA S",
    section: "AIDS - S7",
    totalClasses: 20,
    present: 20,
    absent: 0,
    type: "Project",
    color: "#06b6d4",
  },
];

/* Daily attendance log – dates in Aug 2026 */
const DAILY_LOG = {
  "2026-08-04": [
    { time: "08:45 – 09:35", session: "Forenoon", subject: "Data Visualisation", code: "22AI701", faculty: "NITHYA K", status: "present" },
    { time: "09:35 – 10:25", session: "Forenoon", subject: "Data Visualisation", code: "22AI701", faculty: "NITHYA K", status: "present" },
    { time: "10:40 – 11:30", session: "Forenoon", subject: "NLP", code: "22AI702", faculty: "DR. SURESH R", status: "absent" },
    { time: "11:30 – 12:20", session: "Forenoon", subject: "NLP", code: "22AI702", faculty: "DR. SURESH R", status: "absent" },
    { time: "01:30 – 02:20", session: "Afternoon", subject: "Computer Vision", code: "22AI703", faculty: "DR. PRIYA S", status: "absent" },
    { time: "02:20 – 03:10", session: "Afternoon", subject: "Computer Vision", code: "22AI703", faculty: "DR. PRIYA S", status: "absent" },
    { time: "03:25 – 04:25", session: "Afternoon", subject: "Project Work", code: "22AI707", faculty: "DR. PRIYA S", status: "present" },
    { biometric: "FN", label: "Biometric – Forenoon", status: "present" },
    { biometric: "AN", label: "Biometric – Afternoon", status: "absent" },
  ],
  "2026-08-01": [
    { time: "08:45 – 09:35", session: "Forenoon", subject: "Data Visualisation", code: "22AI701", faculty: "NITHYA K", status: "present" },
    { time: "09:35 – 10:25", session: "Forenoon", subject: "Big Data Analytics", code: "22AI705", faculty: "DR. VIJAY B", status: "present" },
    { time: "10:40 – 11:30", session: "Forenoon", subject: "RL", code: "22AI704", faculty: "PROF. ANITA N", status: "present" },
    { time: "01:30 – 02:20", session: "Afternoon", subject: "IoT", code: "22AI706", faculty: "PROF. SUNITA M", status: "present" },
    { time: "02:20 – 03:10", session: "Afternoon", subject: "IoT", code: "22AI706", faculty: "PROF. SUNITA M", status: "present" },
    { biometric: "FN", label: "Biometric – Forenoon", status: "present" },
    { biometric: "AN", label: "Biometric – Afternoon", status: "present" },
  ],
  "2026-07-31": [
    { time: "08:45 – 09:35", session: "Forenoon", subject: "NLP", code: "22AI702", faculty: "DR. SURESH R", status: "present" },
    { time: "09:35 – 10:25", session: "Forenoon", subject: "NLP", code: "22AI702", faculty: "DR. SURESH R", status: "present" },
    { time: "10:40 – 11:30", session: "Forenoon", subject: "Computer Vision", code: "22AI703", faculty: "DR. PRIYA S", status: "absent" },
    { time: "01:30 – 02:20", session: "Afternoon", subject: "Big Data Analytics", code: "22AI705", faculty: "DR. VIJAY B", status: "present" },
    { biometric: "FN", label: "Biometric – Forenoon", status: "present" },
    { biometric: "AN", label: "Biometric – Absent", status: "absent" },
  ],
  "2026-07-30": [
    { time: "08:45 – 09:35", session: "Forenoon", subject: "Data Visualisation", code: "22AI701", faculty: "NITHYA K", status: "absent" },
    { time: "09:35 – 10:25", session: "Forenoon", subject: "Data Visualisation", code: "22AI701", faculty: "NITHYA K", status: "absent" },
    { time: "10:40 – 11:30", session: "Forenoon", subject: "RL", code: "22AI704", faculty: "PROF. ANITA N", status: "present" },
    { time: "01:30 – 02:20", session: "Afternoon", subject: "IoT", code: "22AI706", faculty: "PROF. SUNITA M", status: "present" },
    { biometric: "FN", label: "Biometric – Forenoon", status: "absent" },
    { biometric: "AN", label: "Biometric – Afternoon", status: "present" },
  ],
};

/* Weekly trend */
const WEEKLY_TREND = [
  { week: "W1", percent: 82, present: 14, total: 17 },
  { week: "W2", percent: 76, present: 13, total: 17 },
  { week: "W3", percent: 65, present: 11, total: 17 },
  { week: "W4", percent: 58, present: 10, total: 17 },
  { week: "W5", percent: 47, present: 8, total: 17 },
  { week: "W6", percent: 53, present: 9, total: 17 },
  { week: "W7", percent: 41, present: 7, total: 17 },
  { week: "W8", percent: 47, present: 8, total: 17 },
];

/* Compute attendance % */
const pct = (sub) => Math.round((sub.present / sub.totalClasses) * 100);

/* Compute overall */
const totalPresent = SUBJECTS.reduce((a, s) => a + s.present, 0);
const totalAbsent = SUBJECTS.reduce((a, s) => a + s.absent, 0);
const totalClasses = SUBJECTS.reduce((a, s) => a + s.totalClasses, 0);
const overallPct = Math.round((totalPresent / totalClasses) * 100);

/* ──────────────────────────── HELPERS ──────────────────────────── */
function classesNeeded(sub) {
  const needed = Math.ceil((0.75 * sub.totalClasses - sub.present) / 0.25);
  return needed > 0 ? needed : 0;
}
function canMiss(sub) {
  const miss = Math.floor((sub.present - 0.75 * sub.totalClasses) / 0.75);
  return miss > 0 ? miss : 0;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* ──────────────────────────── SUB-COMPONENTS ──────────────────────────── */

function StatCard({ icon: Icon, label, value, sub, accent, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="attendance-stat-card relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className="rounded-xl p-3" style={{ background: `${accent}18` }}>
          <Icon size={20} style={{ color: accent }} />
        </div>
      </div>
    </motion.div>
  );
}

/* Circular gauge */
function CircularGauge({ percent, size = 150, stroke = 12 }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const dash = (percent / 100) * circ;
  const color = percent >= 75 ? "#10b981" : percent >= 60 ? "#f59e0b" : "#f43f5e";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold text-white">{percent}%</span>
        <span className="text-xs text-slate-400 font-medium">Overall</span>
      </div>
    </div>
  );
}

/* Subject attendance bar row */
function SubjectRow({ subject, delay = 0, onClick }) {
  const p = pct(subject);
  const safe = p >= 75;
  const warn = p >= 60 && p < 75;
  const danger = p < 60;
  const barColor = safe ? "#10b981" : warn ? "#f59e0b" : "#f43f5e";
  const badgeClass = safe
    ? "aura-badge-success"
    : warn
    ? "aura-badge-warning"
    : "aura-badge-danger";

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      onClick={() => onClick(subject)}
      className="aura-card group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-1.5 rounded-full shrink-0" style={{ background: subject.color }} />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{subject.name}</p>
            <p className="text-xs text-slate-400">{subject.code} · {subject.faculty}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className={`aura-badge ${badgeClass}`}>{p}%</span>
          <div className="text-right">
            <p className="text-sm font-bold text-white">{subject.present}/{subject.totalClasses}</p>
            <p className="text-[10px] text-slate-400">Present</p>
          </div>
        </div>
      </div>

      <div className="subject-progress-bar">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${p}%` }}
          transition={{ duration: 0.8, delay: delay + 0.1 }}
          className="subject-progress-fill"
          style={{ background: barColor }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>{subject.absent} absent · {subject.type}</span>
        {danger && <span className="text-rose-400 font-semibold flex items-center gap-1"><AlertTriangle size={12} /> Needs {classesNeeded(subject)} more classes</span>}
        {warn && <span className="text-amber-400 font-semibold flex items-center gap-1"><AlertTriangle size={12} /> Low attendance warning</span>}
        {safe && canMiss(subject) > 0 && <span className="text-emerald-400 font-semibold">Can skip {canMiss(subject)} more</span>}
      </div>
    </motion.div>
  );
}

/* Daily log row */
function PeriodRow({ period, idx }) {
  if (period.biometric) {
    return (
      <div
        className={`flex items-center justify-between rounded-xl border p-3 ${
          period.status === "present" ? "border-emerald-500/20 bg-emerald-500/5" : "border-rose-500/20 bg-rose-500/5"
        }`}
      >
        <div className="flex items-center gap-3">
          <Shield size={16} className={period.status === "present" ? "text-emerald-400" : "text-rose-400"} />
          <div>
            <p className="text-sm font-medium text-slate-200">{period.label}</p>
            <p className="text-xs text-slate-400">Biometric scan</p>
          </div>
        </div>
        <span className={`aura-badge ${period.status === "present" ? "aura-badge-success" : "aura-badge-danger"}`}>
          {period.status === "present" ? "Present" : "Absent"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-4 ${
        period.status === "present"
          ? "border-slate-800 bg-slate-900"
          : "border-rose-500/10 bg-rose-500/5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            period.status === "present" ? "bg-emerald-500/10" : "bg-rose-500/10"
          }`}>
            <Clock size={16} className={period.status === "present" ? "text-emerald-400" : "text-rose-400"} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{period.time}</p>
            <p className="text-xs text-slate-400">{period.session}</p>
            <p className="mt-1 text-xs font-semibold text-slate-300">{period.subject}</p>
            <p className="text-[10px] text-slate-400">{period.code}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className={`aura-badge ${period.status === "present" ? "aura-badge-success" : "aura-badge-danger"}`}>
            {period.status === "present" ? "Present" : "Absent"}
          </span>
          {period.faculty && (
            <p className="mt-1.5 text-[10px] text-slate-400">
              Marked by<br /><span className="font-semibold text-slate-300">{period.faculty}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* Subject detail modal */
function SubjectModal({ subject, onClose }) {
  if (!subject) return null;
  const p = pct(subject);
  const needed = classesNeeded(subject);
  const canSkip = canMiss(subject);
  const barColor = p >= 75 ? "#10b981" : p >= 60 ? "#f59e0b" : "#f43f5e";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative z-10 w-full max-w-md aura-card p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="mb-5 flex items-start gap-3 justify-between">
            <div className="flex items-start gap-3">
              <div className="h-10 w-1 rounded-full shrink-0" style={{ background: subject.color }} />
              <div>
                <span className="text-xs font-mono text-slate-400">{subject.code}</span>
                <h3 className="text-lg font-bold text-white">{subject.name}</h3>
                <p className="text-xs text-slate-400">{subject.faculty} · {subject.section}</p>
              </div>
            </div>
            <button onClick={onClose} className="aura-btn aura-btn-secondary px-2 py-1 text-xs">✕</button>
          </div>

          {/* Circular gauge */}
          <div className="flex items-center justify-center mb-5">
            <CircularGauge percent={p} size={130} stroke={12} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Total Classes", value: subject.totalClasses, color: "text-slate-200" },
              { label: "Present", value: subject.present, color: "text-emerald-400" },
              { label: "Absent", value: subject.absent, color: "text-rose-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-center">
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Calculator */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Attendance Calculator</p>
            {p >= 75 ? (
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Attendance Sufficient</p>
                  <p className="text-xs text-slate-400">
                    {canSkip > 0 ? `You can miss ${canSkip} more class${canSkip > 1 ? "es" : ""} and still stay above 75%.` : "You're exactly at 75% – don't miss any more."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-400">Below 75% Requirement</p>
                  <p className="text-xs text-slate-400">
                    Attend the next <span className="font-bold text-amber-300">{needed}</span> consecutive class{needed > 1 ? "es" : ""} to reach 75%.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div>
            <div className="mb-1.5 flex justify-between text-xs text-slate-400">
              <span>Attendance</span>
              <span>{subject.present}/{subject.totalClasses}</span>
            </div>
            <div className="subject-progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p}%` }}
                transition={{ duration: 0.8 }}
                className="subject-progress-fill"
                style={{ background: barColor }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* Custom chart tooltip */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="aura-card p-3 text-xs shadow-xl">
      <p className="mb-1 font-semibold text-slate-300">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}{p.dataKey === "percent" ? "%" : ""}</span>
        </p>
      ))}
    </div>
  );
}

/* ═══════════════════════ MAIN ATTENDANCE PAGE ═══════════════════════ */
export default function Attendance() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDate, setSelectedDate] = useState("2026-08-04");
  const [filterType, setFilterType] = useState("All");

  const TABS = ["overview", "subjects", "daily log", "trends"];

  const filteredSubjects = SUBJECTS.filter((s) =>
    filterType === "All" ? true : s.type === filterType
  );

  const dailyPeriods = DAILY_LOG[selectedDate] || [];
  const nonBiometric = dailyPeriods.filter((p) => !p.biometric);
  const biometric = dailyPeriods.filter((p) => p.biometric);
  const dayPresent = nonBiometric.filter((p) => p.status === "present").length;
  const dayAbsent = nonBiometric.filter((p) => p.status === "absent").length;

  const alertSubjects = SUBJECTS.filter((s) => pct(s) < 75);

  return (
    <div className="w-full">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <span className="aura-badge aura-badge-warning uppercase tracking-wider text-[10px]">
              AIDS – Semester 7
            </span>
            <h1 className="page-title">My Attendance</h1>
            <p className="page-description">Track class attendance, subject statistics, and biometric records.</p>
          </div>
          <button
            onClick={() => exportAttendanceReport(SUBJECTS)}
            className="aura-btn aura-btn-secondary"
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* ── Alert Banner ── */}
      {alertSubjects.length > 0 && (
        <div className="attendance-warning">
          <AlertTriangle size={18} className="text-rose-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-rose-400">Attendance Warning</p>
            <p className="text-xs text-slate-300 truncate">
              {alertSubjects.length} subject{alertSubjects.length > 1 ? "s are" : " is"} below 75%:{" "}
              <span className="font-semibold text-rose-300">{alertSubjects.map((s) => s.name).join(", ")}</span>
            </p>
          </div>
        </div>
      )}

      {/* ── 4 KPI Stat Cards ── */}
      <div className="dashboard-section">
        <div className="attendance-stats">
          <StatCard icon={Activity} label="Overall Attendance" value={`${overallPct}%`} sub={`${totalPresent} present of ${totalClasses}`} accent="#06b6d4" delay={0} />
          <StatCard icon={CheckCircle} label="Total Present" value={totalPresent} sub="Classes attended" accent="#10b981" delay={0.05} />
          <StatCard icon={XCircle} label="Total Absent" value={totalAbsent} sub="Classes missed" accent="#f43f5e" delay={0.1} />
          <StatCard icon={BookOpen} label="Subjects" value={SUBJECTS.length} sub={`${alertSubjects.length} below 75%`} accent="#f59e0b" delay={0.15} />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="dashboard-section">
        <div className="attendance-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`attendance-tab ${activeTab === tab ? "active" : ""}`}
            >
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════ OVERVIEW TAB ══════════ */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="dashboard-section"
          >
            {/* Main Attendance Grid */}
            <div className="attendance-main-grid">
              {/* Left Column: Overall Attendance Gauge Card */}
              <div className="aura-card attendance-chart-card">
                <CircularGauge percent={overallPct} size={160} stroke={14} />
                <p className="mt-4 text-sm font-bold text-white">Overall Attendance Status</p>
                <div className="mt-2 flex gap-4 text-xs text-slate-400">
                  <span><span className="text-emerald-400 font-bold">{totalPresent}</span> Present</span>
                  <span><span className="text-rose-400 font-bold">{totalAbsent}</span> Absent</span>
                </div>
                {overallPct < 75 && (
                  <div className="mt-3 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 text-center">
                    <p className="text-xs text-rose-400 font-semibold">⚠ Below 75% requirement</p>
                  </div>
                )}
              </div>

              {/* Right Column: Subject-wise Overview */}
              <div className="aura-card subject-overview">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white">Subject-wise Progress</h3>
                  <button onClick={() => setActiveTab("subjects")} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                    See all →
                  </button>
                </div>

                <div className="subject-list">
                  {SUBJECTS.slice(0, 5).map((s, i) => {
                    const p = pct(s);
                    const barColor = p >= 75 ? "#10b981" : p >= 60 ? "#f59e0b" : "#f43f5e";
                    return (
                      <div key={s.id} className="subject-row">
                        <span className="text-xs font-semibold text-slate-300 truncate">{s.shortName}</span>
                        <div className="subject-progress-bar">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${p}%` }}
                            transition={{ duration: 0.8, delay: i * 0.08 }}
                            className="subject-progress-fill"
                            style={{ background: barColor }}
                          />
                        </div>
                        <span className="text-right text-xs font-bold" style={{ color: barColor }}>{p}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom 3 Insight Cards */}
            <div className="attendance-insights">
              {SUBJECTS.filter((s) => pct(s) < 75).map((s, i) => {
                const needed = classesNeeded(s);
                return (
                  <div key={s.id} className="aura-card border-amber-500/30 bg-amber-500/5">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                      <p className="text-xs font-bold text-amber-400 truncate">{s.name}</p>
                    </div>
                    <p className="text-2xl font-extrabold text-white">{needed}</p>
                    <p className="text-xs text-slate-400">consecutive classes needed for 75%</p>
                  </div>
                );
              })}
              {SUBJECTS.filter((s) => pct(s) >= 75).slice(0, 3 - Math.min(alertSubjects.length, 3)).map((s, i) => {
                const skip = canMiss(s);
                return (
                  <div key={s.id} className="aura-card border-emerald-500/30 bg-emerald-500/5">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                      <p className="text-xs font-bold text-emerald-400 truncate">{s.name}</p>
                    </div>
                    <p className="text-2xl font-extrabold text-white">{skip}</p>
                    <p className="text-xs text-slate-400">classes you can still safely miss</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ══════════ SUBJECTS TAB ══════════ */}
        {activeTab === "subjects" && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="dashboard-section space-y-4"
          >
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <div className="attendance-tabs my-0">
                {["All", "Theory", "Lab", "Project"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`attendance-tab ${filterType === t ? "active" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredSubjects.map((s, i) => (
                <SubjectRow key={s.id} subject={s} delay={i * 0.05} onClick={setSelectedSubject} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ══════════ DAILY LOG TAB ══════════ */}
        {activeTab === "daily log" && (
          <motion.div
            key="daily"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="dashboard-section space-y-4"
          >
            {/* Date picker row */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Object.keys(DAILY_LOG).sort().reverse().map((dateKey) => {
                const d = new Date(dateKey);
                const isSelected = dateKey === selectedDate;
                return (
                  <button
                    key={dateKey}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`shrink-0 flex flex-col items-center rounded-xl border px-4 py-3 transition min-w-[75px] ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-600 text-slate-950 font-bold"
                        : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold">
                      {d.toLocaleDateString("en-IN", { weekday: "short" })}
                    </span>
                    <span className="text-xl font-extrabold mt-0.5">{d.getDate()}</span>
                    <span className="text-[10px]">{d.toLocaleDateString("en-IN", { month: "short" })}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected date summary */}
            <div className="aura-card flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{formatDate(selectedDate)}</p>
                <p className="text-xs text-slate-400 mt-0.5">{nonBiometric.length} periods scheduled</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-xl font-extrabold text-emerald-400">{dayPresent}</p>
                  <p className="text-[10px] text-slate-400">Present</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-extrabold text-rose-400">{dayAbsent}</p>
                  <p className="text-[10px] text-slate-400">Absent</p>
                </div>
              </div>
            </div>

            {/* Biometric section */}
            {biometric.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Biometric Records</p>
                <div className="space-y-2">
                  {biometric.map((p, i) => <PeriodRow key={i} period={p} idx={i} />)}
                </div>
              </div>
            )}

            {/* Period log */}
            {nonBiometric.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Period-wise Attendance</p>
                <div className="space-y-3">
                  {nonBiometric.map((p, i) => <PeriodRow key={i} period={p} idx={i} />)}
                </div>
              </div>
            ) : (
              <div className="aura-card py-12 text-center">
                <Calendar size={32} className="mx-auto mb-2 text-slate-500" />
                <p className="text-sm font-semibold text-slate-300">No records for this date</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ══════════ TRENDS TAB ══════════ */}
        {activeTab === "trends" && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="dashboard-section space-y-6"
          >
            {/* Weekly trend area chart */}
            <div className="aura-card">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Weekly Attendance Trend</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={WEEKLY_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="percent" name="Attendance %" stroke="#06b6d4" strokeWidth={3}
                    fill="url(#attGrad)" dot={{ fill: "#06b6d4", r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Present vs Absent bar */}
            <div className="aura-card">
              <div className="mb-4 flex items-center gap-2">
                <BarChart2 size={16} className="text-blue-400" />
                <h3 className="text-sm font-bold text-white">Subject-wise Present vs Absent</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={SUBJECTS.map((s) => ({ name: s.shortName, Present: s.present, Absent: s.absent }))}
                  margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subject modal */}
      {selectedSubject && <SubjectModal subject={selectedSubject} onClose={() => setSelectedSubject(null)} />}
    </div>
  );
}

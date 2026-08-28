import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Award,
  Target,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  BarChart2,
  Search,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ─────────────────────────── MOCK DATA ─────────────────────────── */
const CGPA_TREND = [
  { sem: "Sem 1", cgpa: 7.4, credits: 24 },
  { sem: "Sem 2", cgpa: 7.9, credits: 26 },
  { sem: "Sem 3", cgpa: 8.2, credits: 28 },
  { sem: "Sem 4", cgpa: 8.6, credits: 26 },
  { sem: "Sem 5", cgpa: 8.8, credits: 30 },
  { sem: "Sem 6", cgpa: 9.1, credits: 28 },
];

const SUBJECT_RADAR = [
  { subject: "Math", score: 88 },
  { subject: "Physics", score: 75 },
  { subject: "CS Core", score: 94 },
  { subject: "Networks", score: 82 },
  { subject: "DBMS", score: 90 },
  { subject: "OS", score: 87 },
];

const SEMESTERS = [
  { id: 1, label: "Semester 1", cgpa: 7.4, credits: 24, subjects: 6, status: "completed" },
  { id: 2, label: "Semester 2", cgpa: 7.9, credits: 26, subjects: 6, status: "completed" },
  { id: 3, label: "Semester 3", cgpa: 8.2, credits: 28, subjects: 7, status: "completed" },
  { id: 4, label: "Semester 4", cgpa: 8.6, credits: 26, subjects: 6, status: "completed" },
  { id: 5, label: "Semester 5", cgpa: 8.8, credits: 30, subjects: 7, status: "completed" },
  { id: 6, label: "Semester 6", cgpa: 9.1, credits: 28, subjects: 7, status: "current" },
];

const SUBJECTS = [
  {
    id: "CS601",
    code: "CS601",
    name: "Advanced Algorithms",
    faculty: "Dr. Priya Sharma",
    credits: 4,
    type: "Core",
    grade: "O",
    gradePoints: 10,
    internal: 48,
    external: 92,
    total: 94,
    attendance: 92,
    status: "completed",
    semester: 6,
    description: "Design and analysis of advanced algorithms including dynamic programming, graph algorithms and complexity theory.",
  },
  {
    id: "CS602",
    code: "CS602",
    name: "Machine Learning",
    faculty: "Dr. Raj Kumar",
    credits: 4,
    type: "Elective",
    grade: "A+",
    gradePoints: 9,
    internal: 46,
    external: 88,
    total: 90,
    attendance: 88,
    status: "completed",
    semester: 6,
    description: "Supervised and unsupervised learning, neural networks, SVMs, clustering algorithms and model evaluation.",
  },
  {
    id: "CS603",
    code: "CS603",
    name: "Computer Networks",
    faculty: "Prof. Anita Nair",
    credits: 3,
    type: "Core",
    grade: "A",
    gradePoints: 8,
    internal: 42,
    external: 80,
    total: 84,
    attendance: 85,
    status: "completed",
    semester: 6,
    description: "OSI model, TCP/IP protocols, routing algorithms, network security and wireless communications.",
  },
  {
    id: "CS604",
    code: "CS604",
    name: "Cloud Computing",
    faculty: "Dr. Vijay Balan",
    credits: 3,
    type: "Elective",
    grade: "O",
    gradePoints: 10,
    internal: 49,
    external: 91,
    total: 95,
    attendance: 95,
    status: "completed",
    semester: 6,
    description: "Cloud service models, virtualization, containerization with Docker and Kubernetes, serverless architectures.",
  },
  {
    id: "CS605",
    code: "CS605",
    name: "Software Engineering",
    faculty: "Prof. Sunita Mehta",
    credits: 4,
    type: "Core",
    grade: "A+",
    gradePoints: 9,
    internal: 45,
    external: 86,
    total: 89,
    attendance: 90,
    status: "completed",
    semester: 6,
    description: "SDLC models, Agile/Scrum, design patterns, testing strategies and project management.",
  },
  {
    id: "CS606",
    code: "CS606",
    name: "Mini Project",
    faculty: "Dr. Priya Sharma",
    credits: 2,
    type: "Project",
    grade: "O",
    gradePoints: 10,
    internal: 50,
    external: 95,
    total: 97,
    attendance: 100,
    status: "completed",
    semester: 6,
    description: "Team-based software development project applying engineering principles to solve real-world problems.",
  },
  {
    id: "CS701",
    code: "CS701",
    name: "Deep Learning",
    faculty: "Dr. Raj Kumar",
    credits: 4,
    type: "Elective",
    grade: null,
    gradePoints: null,
    internal: 38,
    external: null,
    total: null,
    attendance: 80,
    status: "ongoing",
    semester: 7,
    description: "CNN, RNN, transformers, GANs and applications in vision and natural language processing.",
  },
  {
    id: "CS702",
    code: "CS702",
    name: "Cybersecurity",
    faculty: "Dr. Suresh Pillai",
    credits: 3,
    type: "Core",
    grade: null,
    gradePoints: null,
    internal: 35,
    external: null,
    total: null,
    attendance: 78,
    status: "ongoing",
    semester: 7,
    description: "Cryptography, network security, ethical hacking, penetration testing and security policies.",
  },
];

const GRADE_COLOR = {
  O: "text-emerald-400 bg-emerald-400/10",
  "A+": "text-sky-400 bg-sky-400/10",
  A: "text-indigo-400 bg-indigo-400/10",
  "B+": "text-yellow-400 bg-yellow-400/10",
  B: "text-orange-400 bg-orange-400/10",
  C: "text-rose-400 bg-rose-400/10",
};

const GRADE_BAR = {
  O: "bg-emerald-500",
  "A+": "bg-sky-500",
  A: "bg-indigo-500",
  "B+": "bg-yellow-500",
  B: "bg-orange-500",
  C: "bg-rose-500",
};

const STATUS_STYLE = {
  completed: "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20",
  ongoing: "text-sky-400 bg-sky-400/10 border border-sky-400/20",
  current: "text-amber-400 bg-amber-400/10 border border-amber-400/20",
};

const TYPE_STYLE = {
  Core: "text-indigo-300 bg-indigo-500/10 border border-indigo-500/20",
  Elective: "text-purple-300 bg-purple-500/10 border border-purple-500/20",
  Project: "text-emerald-300 bg-emerald-500/10 border border-emerald-500/20",
};

/* ─────────────────────── STAT CARD ─────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition-all group"
    >
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10 blur-xl ${color}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className={`rounded-xl p-3 ${color} bg-opacity-10`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── PROGRESS BAR ─────────────────────── */
function ProgressBar({ value, max = 100, color = "bg-sky-500", label }) {
  return (
    <div>
      {label && (
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>{label}</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-2 rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

/* ─────────────────────── SUBJECT DETAIL DRAWER ─────────────────────── */
function SubjectDrawer({ subject, onClose }) {
  if (!subject) return null;
  const gradeStyle = GRADE_COLOR[subject.grade] || "text-slate-400 bg-slate-800";
  const barStyle = GRADE_BAR[subject.grade] || "bg-slate-600";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        {/* Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative z-10 w-full max-w-md overflow-y-auto bg-slate-950 shadow-2xl border-l border-slate-800"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950/95 p-6 backdrop-blur">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{subject.code}</span>
              <h3 className="mt-1 text-lg font-bold text-white">{subject.name}</h3>
            </div>
            <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-6 p-6">
            {/* Grade hero */}
            {subject.grade && (
              <div className={`flex items-center justify-between rounded-2xl p-5 ${gradeStyle}`}>
                <div>
                  <p className="text-sm opacity-70">Final Grade</p>
                  <p className="mt-1 text-5xl font-black">{subject.grade}</p>
                  <p className="mt-1 text-sm opacity-70">{subject.gradePoints} / 10 Grade Points</p>
                </div>
                <Star size={48} className="opacity-20" />
              </div>
            )}
            {!subject.grade && (
              <div className="flex items-center gap-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 p-4">
                <Info size={20} className="text-sky-400 shrink-0" />
                <p className="text-sm text-sky-300">Exam pending — internal marks recorded</p>
              </div>
            )}

            {/* Scores */}
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Score Breakdown</h4>
              <div className="space-y-3">
                <ProgressBar label="Internal (50)" value={subject.internal} max={50} color="bg-indigo-500" />
                {subject.external !== null && (
                  <ProgressBar label="External (100)" value={subject.external} max={100} color={barStyle} />
                )}
                {subject.total !== null && (
                  <ProgressBar label="Total (150)" value={subject.total} max={150} color="bg-emerald-500" />
                )}
              </div>
            </div>

            {/* Attendance */}
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Attendance</h4>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke={subject.attendance >= 75 ? "#10b981" : "#f59e0b"}
                      strokeWidth="3"
                      strokeDasharray={`${subject.attendance} ${100 - subject.attendance}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{subject.attendance}%</span>
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${subject.attendance >= 75 ? "text-emerald-400" : "text-amber-400"}`}>
                    {subject.attendance >= 75 ? "Attendance Sufficient" : "Below Required 75%"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {subject.attendance >= 75
                      ? "You meet the minimum attendance requirement."
                      : `Need ${75 - subject.attendance}% more to reach 75%.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-3">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Subject Info</h4>
              {[
                { label: "Faculty", value: subject.faculty },
                { label: "Credits", value: subject.credits },
                { label: "Type", value: subject.type },
                { label: "Semester", value: `Semester ${subject.semester}` },
                { label: "Status", value: subject.status.charAt(0).toUpperCase() + subject.status.slice(1) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-sm font-medium text-slate-200">{value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">Description</h4>
              <p className="rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-300">{subject.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition">
                <Download size={16} /> Download Report
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────── SEMESTER ROW ─────────────────────── */
function SemesterRow({ sem, isOpen, onToggle }) {
  const subjectsInSem = SUBJECTS.filter((s) => s.semester === sem.id);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 hover:bg-slate-800/50 transition"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 font-bold text-sm">
            S{sem.id}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">{sem.label}</p>
            <p className="text-xs text-slate-400">{sem.subjects} Subjects · {sem.credits} Credits</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[sem.status]}`}>
            {sem.status === "current" ? "Current" : sem.status.charAt(0).toUpperCase() + sem.status.slice(1)}
          </span>
          <span className="text-lg font-bold text-white">{sem.cgpa}</span>
          {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-t border-slate-800 p-4">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                      <th className="pb-3 pr-4">Code</th>
                      <th className="pb-3 pr-4">Subject</th>
                      <th className="pb-3 pr-4">Credits</th>
                      <th className="pb-3 pr-4">Internal</th>
                      <th className="pb-3 pr-4">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {subjectsInSem.map((s) => (
                      <tr key={s.id} className="group">
                        <td className="py-3 pr-4 font-mono text-xs text-slate-400">{s.code}</td>
                        <td className="py-3 pr-4 font-medium text-slate-200">{s.name}</td>
                        <td className="py-3 pr-4 text-slate-400">{s.credits}</td>
                        <td className="py-3 pr-4 text-slate-400">{s.internal}/50</td>
                        <td className="py-3 pr-4">
                          {s.grade ? (
                            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${GRADE_COLOR[s.grade]}`}>{s.grade}</span>
                          ) : (
                            <span className="rounded-full px-2 py-0.5 text-xs font-bold text-slate-500 bg-slate-800">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────── SUBJECT CARD ─────────────────────── */
function SubjectCard({ subject, onView }) {
  const gradeStyle = subject.grade ? GRADE_COLOR[subject.grade] : "text-slate-400 bg-slate-800";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition-all cursor-pointer"
      onClick={() => onView(subject)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <span className="font-mono text-xs text-slate-500">{subject.code}</span>
          <h3 className="mt-0.5 text-sm font-bold text-white leading-tight truncate">{subject.name}</h3>
          <p className="mt-0.5 text-xs text-slate-400 truncate">{subject.faculty}</p>
        </div>
        <div className="ml-3 shrink-0 flex flex-col items-end gap-1">
          {subject.grade ? (
            <span className={`rounded-full px-2.5 py-1 text-xs font-black ${gradeStyle}`}>{subject.grade}</span>
          ) : (
            <span className="rounded-full px-2.5 py-1 text-xs font-semibold text-slate-400 bg-slate-800">Pending</span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_STYLE[subject.type]}`}>{subject.type}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-xl bg-slate-950/50 p-2 text-center">
          <p className="text-[10px] text-slate-500">Credits</p>
          <p className="text-sm font-bold text-white">{subject.credits}</p>
        </div>
        <div className="rounded-xl bg-slate-950/50 p-2 text-center">
          <p className="text-[10px] text-slate-500">Internal</p>
          <p className="text-sm font-bold text-white">{subject.internal}<span className="text-[10px] text-slate-500">/50</span></p>
        </div>
        <div className="rounded-xl bg-slate-950/50 p-2 text-center">
          <p className="text-[10px] text-slate-500">Attendance</p>
          <p className={`text-sm font-bold ${subject.attendance >= 75 ? "text-emerald-400" : "text-amber-400"}`}>
            {subject.attendance}%
          </p>
        </div>
      </div>

      {/* Progress */}
      {subject.total !== null && (
        <div>
          <div className="mb-1 flex justify-between text-[10px] text-slate-500">
            <span>Total Score</span>
            <span>{subject.total}/150</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(subject.total / 150) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`h-1.5 rounded-full ${GRADE_BAR[subject.grade] || "bg-slate-600"}`}
            />
          </div>
        </div>
      )}

      {/* Status badge */}
      <div className="mt-3 flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[subject.status]}`}>
          {subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}
        </span>
        <button className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-indigo-400 transition">
          <Eye size={10} /> View Details
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── CUSTOM TOOLTIP ─────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs shadow-xl">
      <p className="mb-1 font-semibold text-slate-300">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ═══════════════════════ MAIN ACADEMICS PAGE ═══════════════════════ */
export default function Academics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [openSemesters, setOpenSemesters] = useState({ 6: true });
  const [selectedSubject, setSelectedSubject] = useState(null);

  const toggleSemester = (id) =>
    setOpenSemesters((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredSubjects = SUBJECTS.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.faculty.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || s.type === filterType;
    const matchStatus = filterStatus === "All" || s.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const currentCGPA = 9.1;
  const totalCredits = 164;
  const completedSubjects = SUBJECTS.filter((s) => s.status === "completed").length;
  const ongoingSubjects = SUBJECTS.filter((s) => s.status === "ongoing").length;

  const TABS = ["overview", "subjects", "semesters", "performance"];

  return (
    <div className="w-full">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <span className="aura-badge aura-badge-info uppercase tracking-wider text-[10px]">
              Academics
            </span>
            <h1 className="page-title">Academic Performance</h1>
            <p className="page-description">Track your grades, subjects, and semester progress.</p>
          </div>
          <button className="aura-btn aura-btn-secondary">
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="dashboard-section">
        <div className="attendance-stats">
          <StatCard icon={TrendingUp} label="Current CGPA" value={currentCGPA} sub="Semester 6 · On Track" color="bg-indigo-500" delay={0} />
          <StatCard icon={BookOpen} label="Total Credits" value={totalCredits} sub="Earned across 6 semesters" color="bg-sky-500" delay={0.05} />
          <StatCard icon={CheckCircle} label="Completed" value={completedSubjects} sub="Subjects completed" color="bg-emerald-500" delay={0.1} />
          <StatCard icon={Target} label="Ongoing" value={ongoingSubjects} sub="Active this semester" color="bg-purple-500" delay={0.15} />
        </div>
      </div>

      {/* ── Tab Navigation ── */}
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

      {/* ════════════ OVERVIEW TAB ════════════ */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* CGPA Trend */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart2 size={16} className="text-indigo-400" />
                  <h3 className="text-sm font-semibold text-white">CGPA Trend</h3>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={CGPA_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="sem" tick={{ fill: "#64748b", fontSize: 11 }} />
                    <YAxis domain={[6, 10]} tick={{ fill: "#64748b", fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="cgpa"
                      name="CGPA"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: "#6366f1", strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: "#818cf8" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Subject Radar */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Target size={16} className="text-purple-400" />
                  <h3 className="text-sm font-semibold text-white">Subject Performance Radar</h3>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={SUBJECT_RADAR} cx="50%" cy="50%">
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#475569", fontSize: 9 }} />
                    <Radar name="Score" dataKey="score" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.2} strokeWidth={2} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Credits Bar */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Award size={16} className="text-sky-400" />
                <h3 className="text-sm font-semibold text-white">Credits Earned per Semester</h3>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={CGPA_TREND} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="sem" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="credits" name="Credits" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Grade Distribution */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Star size={16} className="text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Grade Distribution</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { grade: "O", count: 3, color: "bg-emerald-500" },
                  { grade: "A+", count: 2, color: "bg-sky-500" },
                  { grade: "A", count: 1, color: "bg-indigo-500" },
                  { grade: "B+", count: 0, color: "bg-yellow-500" },
                ].map(({ grade, count, color }) => (
                  <div key={grade} className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3 min-w-[120px]">
                    <div className={`h-3 w-3 rounded-full ${color}`} />
                    <div>
                      <p className="text-xs text-slate-400">Grade {grade}</p>
                      <p className="text-lg font-bold text-white">{count} <span className="text-xs text-slate-500">subjects</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════ SUBJECTS TAB ════════════ */}
        {activeTab === "subjects" && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search subjects, faculty..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition"
                />
              </div>
              {/* Filter pills */}
              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 p-1">
                  {["All", "Core", "Elective", "Project"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        filterType === t ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 p-1">
                  {["All", "completed", "ongoing"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                        filterStatus === s ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results count */}
            <p className="text-xs text-slate-500">
              {filteredSubjects.length} subject{filteredSubjects.length !== 1 ? "s" : ""} found
              {search && ` for "${search}"`}
            </p>

            {/* Grid */}
            {filteredSubjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 py-16 text-center">
                <AlertCircle size={40} className="mb-4 text-slate-600" />
                <p className="text-sm font-semibold text-slate-400">No subjects found</p>
                <p className="mt-1 text-xs text-slate-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence>
                  {filteredSubjects.map((s) => (
                    <SubjectCard key={s.id} subject={s} onView={setSelectedSubject} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ════════════ SEMESTERS TAB ════════════ */}
        {activeTab === "semesters" && (
          <motion.div
            key="semesters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-400">Click a semester to expand subject details</p>
              <button
                onClick={() => setOpenSemesters(Object.fromEntries(SEMESTERS.map((s) => [s.id, true])))}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition"
              >
                Expand All
              </button>
            </div>
            {[...SEMESTERS].reverse().map((sem) => (
              <SemesterRow
                key={sem.id}
                sem={sem}
                isOpen={!!openSemesters[sem.id]}
                onToggle={() => toggleSemester(sem.id)}
              />
            ))}
          </motion.div>
        )}

        {/* ════════════ PERFORMANCE TAB ════════════ */}
        {activeTab === "performance" && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Performance Summary Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-800 p-5">
                <Clock size={16} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">All Subjects — Score Summary</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="bg-slate-800/50">
                    <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
                      <th className="px-5 py-3">Code</th>
                      <th className="px-5 py-3">Subject</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Internal</th>
                      <th className="px-5 py-3">External</th>
                      <th className="px-5 py-3">Total</th>
                      <th className="px-5 py-3">Grade</th>
                      <th className="px-5 py-3">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {SUBJECTS.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-800/30 cursor-pointer transition"
                        onClick={() => setSelectedSubject(s)}
                      >
                        <td className="px-5 py-4 font-mono text-xs text-slate-400">{s.code}</td>
                        <td className="px-5 py-4 font-medium text-white">{s.name}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_STYLE[s.type]}`}>{s.type}</span>
                        </td>
                        <td className="px-5 py-4 text-slate-300">{s.internal}/50</td>
                        <td className="px-5 py-4 text-slate-300">{s.external !== null ? `${s.external}/100` : "—"}</td>
                        <td className="px-5 py-4 text-slate-300">{s.total !== null ? `${s.total}/150` : "—"}</td>
                        <td className="px-5 py-4">
                          {s.grade ? (
                            <span className={`rounded-full px-2.5 py-1 text-xs font-black ${GRADE_COLOR[s.grade]}`}>{s.grade}</span>
                          ) : (
                            <span className="text-slate-500 text-xs">Pending</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-slate-800">
                              <div
                                className={`h-1.5 rounded-full ${s.attendance >= 75 ? "bg-emerald-500" : "bg-amber-500"}`}
                                style={{ width: `${s.attendance}%` }}
                              />
                            </div>
                            <span className={`text-xs ${s.attendance >= 75 ? "text-emerald-400" : "text-amber-400"}`}>
                              {s.attendance}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Score comparison bar chart */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-4 flex items-center gap-2">
                <BarChart2 size={16} className="text-sky-400" />
                <h3 className="text-sm font-semibold text-white">Internal vs External Scores (Completed)</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={SUBJECTS.filter((s) => s.status === "completed").map((s) => ({
                    name: s.code,
                    Internal: s.internal,
                    External: s.external,
                  }))}
                  margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                  <Bar dataKey="Internal" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="External" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Subject Drawer ─── */}
      {selectedSubject && (
        <SubjectDrawer subject={selectedSubject} onClose={() => setSelectedSubject(null)} />
      )}
    </div>
  );
}

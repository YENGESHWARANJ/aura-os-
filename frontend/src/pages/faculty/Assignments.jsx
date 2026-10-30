import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import {
  FileText, Plus, Eye, X, Sparkles, CheckCircle, AlertTriangle,
  Brain, ChevronDown, ChevronUp, RefreshCw, Download, Star, User
} from "lucide-react";

// ── Demo data ─────────────────────────────────────────────────────────────────
const DEMO_ASSIGNMENTS = [
  {
    _id: "a1",
    title: "Ethics Case Study Report",
    course: "Ethics and AI",
    section: "Sec A",
    dueDate: "2026-08-25",
    submitted: 38,
    pending: 14,
    avgScore: "82%",
    status: "Active",
    maxMarks: 100,
  },
  {
    _id: "a2",
    title: "ML Model Implementation",
    course: "Machine Learning",
    section: "Sec B",
    dueDate: "2026-08-28",
    submitted: 30,
    pending: 18,
    avgScore: "N/A",
    status: "Active",
    maxMarks: 100,
  },
  {
    _id: "a3",
    title: "Data Cleaning & EDA Report",
    course: "Data Science",
    section: "Sec A",
    dueDate: "2026-08-20",
    submitted: 50,
    pending: 0,
    avgScore: "74%",
    status: "Graded",
    maxMarks: 100,
  },
  {
    _id: "a4",
    title: "Transformer Model Analysis",
    course: "NLP",
    section: "Sec C",
    dueDate: "2026-09-02",
    submitted: 12,
    pending: 42,
    avgScore: "N/A",
    status: "Active",
    maxMarks: 100,
  },
];

// AI factors that vary per student to make evaluations unique
const AI_FACTORS = [
  { label: "Clarity of Writing",    weight: 20 },
  { label: "Depth of Analysis",     weight: 30 },
  { label: "Technical Accuracy",    weight: 25 },
  { label: "Originality",           weight: 15 },
  { label: "References & Format",   weight: 10 },
];

const STRENGTH_POOL = [
  "Excellent use of real-world examples to support arguments.",
  "Code is clean, well-commented and follows best practices.",
  "Strong theoretical grounding with relevant citations.",
  "Creative approach — proposed a novel solution beyond the brief.",
  "Data visualisations are clear, labelled and insightful.",
  "Logical flow with a well-structured introduction and conclusion.",
  "Demonstrated deep understanding of edge cases.",
  "Correctly implemented cross-validation and hyperparameter tuning.",
];

const WEAKNESS_POOL = [
  "Conclusion is underdeveloped — needs more critical reflection.",
  "Missing citations for several key claims.",
  "Code runs but lacks error handling for edge inputs.",
  "Figures are unlabelled and reduce report readability.",
  "Over-reliance on one data source limits perspective.",
  "Grammar and sentence structure need proofreading.",
  "Dataset description is too brief.",
  "Evaluation metrics not justified for the chosen model.",
];

// Seeded pseudo-random helpers so scores are consistent between re-renders
function seededRand(seed) {
  let x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateAIEvaluation(studentId, assignmentId, studentName) {
  const seed = studentId * 97 + assignmentId * 31;
  const factorScores = AI_FACTORS.map((f, i) => {
    const raw = seededRand(seed + i * 13);
    const score = Math.round(raw * f.weight * 0.4 + f.weight * 0.6); // 60-100% range
    return { ...f, score, max: f.weight };
  });

  const total = factorScores.reduce((acc, f) => acc + f.score, 0);
  const strengthIdx1 = Math.floor(seededRand(seed + 200) * STRENGTH_POOL.length);
  const strengthIdx2 = Math.floor(seededRand(seed + 201) * STRENGTH_POOL.length);
  const weaknessIdx  = Math.floor(seededRand(seed + 300) * WEAKNESS_POOL.length);

  const grade =
    total >= 90 ? "O"
    : total >= 80 ? "A+"
    : total >= 70 ? "A"
    : total >= 60 ? "B+"
    : total >= 50 ? "B"
    : "C";

  return {
    total,
    grade,
    factorScores,
    strengths: [
      STRENGTH_POOL[strengthIdx1],
      STRENGTH_POOL[(strengthIdx2 + 1) % STRENGTH_POOL.length],
    ],
    weakness: WEAKNESS_POOL[weaknessIdx],
    summary: `${studentName}'s submission scored ${total}/100 (${grade} Grade). The work demonstrates ${total > 80 ? "strong" : "adequate"} understanding of the topic with room for improvement in certain areas.`,
  };
}

// ── Student list per assignment ───────────────────────────────────────────────
function makeStudents(count, assignmentId) {
  const names = [
    "Aarav Kumar","Divya Menon","Harish Raj","Keerthana S","Lokesh M",
    "Meera Nair","Naveen P","Priya Devi","Rahul T","Sneha V",
    "Tamil Selvan","Usha R","Vijay K","Yamini S","Zara A",
    "Arjun G","Bhavna C","Charan D","Deepa J","Elan M",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ""),
    rollNo: `22AI${String(700 + i + 1).padStart(3, "0")}`,
    submittedAt: `2026-08-${String(Math.min(25 + (i % 5), 28)).padStart(2, "0")} ${9 + (i % 8)}:${String((i * 7) % 60).padStart(2, "0")} AM`,
    fileType: ["PDF", "PDF", "DOCX", "PDF", "ZIP"][i % 5],
    evaluation: null,
  }));
}

// ── Grade badge colour ────────────────────────────────────────────────────────
function gradeBadgeClass(grade) {
  if (grade === "O" || grade === "A+") return "aura-badge-success";
  if (grade === "A" || grade === "B+") return "aura-badge-info";
  return "aura-badge-warning";
}

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 64 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#06b6d4" : "#f59e0b";

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={7} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={7}
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
    </svg>
  );
}

// ── Per-student card ──────────────────────────────────────────────────────────
function StudentEvalCard({ student, assignmentId, onEvaluate, evaluating }) {
  const [expanded, setExpanded] = useState(false);
  const ev = student.evaluation;

  return (
    <div
      className="rounded-xl border border-slate-800 bg-slate-900/60 transition-all duration-300"
      style={{ marginBottom: 10 }}
    >
      {/* Row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
          {student.name.charAt(0)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{student.name}</p>
          <p className="text-[10px] text-slate-400">{student.rollNo} · {student.submittedAt} · {student.fileType}</p>
        </div>

        {/* Score pill */}
        {ev ? (
          <div className="flex items-center gap-2">
            <span className={`aura-badge ${gradeBadgeClass(ev.grade)} text-xs`}>
              {ev.grade} Grade
            </span>
            <span className="text-sm font-extrabold text-white">{ev.total}<span className="text-slate-400 text-xs">/100</span></span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-500 italic">Not evaluated</span>
        )}

        {/* Evaluate / Expand buttons */}
        {!ev ? (
          <button
            onClick={() => onEvaluate(student.id)}
            disabled={evaluating === student.id}
            className="aura-btn aura-btn-primary py-1 px-2.5 text-[11px] flex items-center gap-1 shrink-0"
          >
            {evaluating === student.id ? (
              <><RefreshCw className="h-3 w-3 animate-spin" /> Evaluating…</>
            ) : (
              <><Brain className="h-3 w-3" /> AI Evaluate</>
            )}
          </button>
        ) : (
          <button
            onClick={() => setExpanded(!expanded)}
            className="aura-btn aura-btn-secondary py-1 px-2.5 text-[11px] flex items-center gap-1 shrink-0"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? "Collapse" : "Details"}
          </button>
        )}
      </div>

      {/* Expanded evaluation details */}
      {ev && expanded && (
        <div className="px-4 pb-4 border-t border-slate-800 pt-3 space-y-4">
          {/* Summary + ring */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <ScoreRing score={ev.total} />
              <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-white">
                {ev.total}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">{ev.summary}</p>
          </div>

          {/* Factor breakdown */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Evaluation Breakdown</p>
            <div className="space-y-1.5">
              {ev.factorScores.map((f) => (
                <div key={f.label} className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 w-40 shrink-0">{f.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(f.score / f.max) * 100}%`,
                        background: f.score / f.max > 0.8 ? "#10b981" : f.score / f.max > 0.6 ? "#06b6d4" : "#f59e0b",
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-white w-12 text-right shrink-0">
                    {f.score}/{f.max}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
              <p className="text-[11px] font-bold text-emerald-400 mb-2 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Strengths
              </p>
              <ul className="space-y-1">
                {ev.strengths.map((s, i) => (
                  <li key={i} className="text-[11px] text-slate-300 leading-relaxed">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40">
              <p className="text-[11px] font-bold text-amber-400 mb-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Area to Improve
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">• {ev.weakness}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── AI Evaluation Modal ───────────────────────────────────────────────────────
function AIEvalModal({ assignment, onClose }) {
  const [students, setStudents] = useState(() =>
    makeStudents(assignment.submitted, parseInt(assignment._id.replace("a", ""), 10))
  );
  const [evaluating, setEvaluating] = useState(null);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkIdx, setBulkIdx] = useState(0);

  const assignId = parseInt(assignment._id.replace("a", ""), 10);

  const evaluateOne = (studentId) => {
    setEvaluating(studentId);
    setTimeout(() => {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { ...s, evaluation: generateAIEvaluation(studentId, assignId, s.name) }
            : s
        )
      );
      setEvaluating(null);
    }, 900 + Math.random() * 600);
  };

  // Bulk evaluate: evaluate one by one sequentially
  const bulkEvaluate = () => {
    const unevaluated = students.filter((s) => !s.evaluation);
    if (!unevaluated.length) return;
    setBulkRunning(true);
    setBulkIdx(0);

    let idx = 0;
    const next = () => {
      if (idx >= unevaluated.length) {
        setBulkRunning(false);
        return;
      }
      const student = unevaluated[idx];
      setBulkIdx(idx + 1);
      setEvaluating(student.id);
      setTimeout(() => {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === student.id
              ? { ...s, evaluation: generateAIEvaluation(student.id, assignId, s.name) }
              : s
          )
        );
        setEvaluating(null);
        idx++;
        setTimeout(next, 200);
      }, 600 + Math.random() * 400);
    };
    next();
  };

  const evaluated = students.filter((s) => s.evaluation);
  const avgScore = evaluated.length
    ? Math.round(evaluated.reduce((a, s) => a + s.evaluation.total, 0) / evaluated.length)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-700/60 bg-slate-950 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AI Auto-Evaluator</span>
            </div>
            <h2 className="text-lg font-extrabold text-white">{assignment.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{assignment.course} · {assignment.section} · {assignment.submitted} Submissions</p>
          </div>
          <button onClick={onClose} className="aura-btn aura-btn-secondary p-1.5 rounded-lg ml-4 shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 px-6 py-3 border-b border-slate-800 bg-slate-900/50 shrink-0">
          <div>
            <p className="text-[10px] uppercase text-slate-500 font-bold">Evaluated</p>
            <p className="text-lg font-extrabold text-emerald-400">{evaluated.length}<span className="text-slate-500 text-xs">/{students.length}</span></p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500 font-bold">Avg AI Score</p>
            <p className="text-lg font-extrabold text-cyan-400">{avgScore ?? "—"}<span className="text-slate-500 text-xs">{avgScore ? "/100" : ""}</span></p>
          </div>
          <div className="flex-1" />
          {/* Bulk evaluate */}
          <button
            onClick={bulkEvaluate}
            disabled={bulkRunning || students.every((s) => s.evaluation)}
            className="aura-btn aura-btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
          >
            {bulkRunning
              ? <><RefreshCw className="h-3 w-3 animate-spin" /> Evaluating {bulkIdx}/{students.filter(s => !s.evaluation).length + bulkIdx}…</>
              : <><Brain className="h-3 w-3" /> AI Evaluate All</>
            }
          </button>
        </div>

        {/* Progress bar */}
        {students.length > 0 && (
          <div className="h-1 bg-slate-800 shrink-0">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(evaluated.length / students.length) * 100}%` }}
            />
          </div>
        )}

        {/* Student list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
          {students.map((student) => (
            <StudentEvalCard
              key={student.id}
              student={student}
              assignmentId={assignId}
              onEvaluate={evaluateOne}
              evaluating={evaluating}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 shrink-0 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            AI evaluation uses multi-factor rubric analysis — scores are unique per student.
          </p>
          <button className="aura-btn aura-btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3">
            <Download className="h-3 w-3" /> Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Assignments() {
  const [assignments] = useState(DEMO_ASSIGNMENTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", course: "", section: "Sec A", description: "", dueDate: "", maxMarks: "" });
  const [viewAssignment, setViewAssignment] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePublish = (e) => {
    e.preventDefault();
    setShowForm(false);
    setForm({ title: "", course: "", section: "Sec A", description: "", dueDate: "", maxMarks: "" });
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Assignment Management"
        description="Create, publish, track submissions, and AI-grade assignments across your courses."
        actions={
          <button onClick={() => setShowForm(!showForm)} className="aura-btn aura-btn-primary text-xs flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Create Assignment
          </button>
        }
      />

      {/* Create Assignment Form */}
      {showForm && (
        <div className="aura-card border-blue-500/30 bg-blue-950/20">
          <h3 className="text-base font-bold text-white mb-4">New Assignment</h3>
          <form onSubmit={handlePublish} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assignment Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="aura-input text-xs" placeholder="e.g. Ethics Case Study Report" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Course</label>
              <select name="course" value={form.course} onChange={handleChange} className="aura-select text-xs" required>
                <option value="">Select course...</option>
                <option>Ethics and AI</option>
                <option>Machine Learning</option>
                <option>Data Science</option>
                <option>Natural Language Processing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
              <select name="section" value={form.section} onChange={handleChange} className="aura-select text-xs">
                <option>Sec A</option><option>Sec B</option><option>Sec C</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
              <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="aura-input text-xs" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Maximum Marks</label>
              <input name="maxMarks" type="number" value={form.maxMarks} onChange={handleChange} className="aura-input text-xs" placeholder="e.g. 100" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Submission Type</label>
              <select name="type" className="aura-select text-xs">
                <option>PDF Upload</option><option>Online Text</option><option>Link Submission</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Instructions</label>
              <textarea name="description" rows="3" className="aura-textarea text-xs min-h-[80px]" placeholder="Assignment instructions and evaluation criteria..." />
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="aura-btn aura-btn-secondary text-xs py-2 px-4">Cancel</button>
              <button type="submit" className="aura-btn aura-btn-primary text-xs py-2 px-4">Publish Assignment</button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments Table */}
      <div className="aura-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Assignment Title</th>
                <th className="py-3 px-4">Course & Section</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Pending</th>
                <th className="py-3 px-4">Avg Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {assignments.map((a) => (
                <tr key={a._id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4 font-bold text-white">{a.title}</td>
                  <td className="py-3.5 px-4 text-slate-400">{a.course} · {a.section}</td>
                  <td className="py-3.5 px-4 text-slate-300">{a.dueDate}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">{a.submitted}</td>
                  <td className="py-3.5 px-4 text-rose-400 font-bold">{a.pending}</td>
                  <td className="py-3.5 px-4 text-cyan-400 font-bold">{a.avgScore}</td>
                  <td className="py-3.5 px-4">
                    <span className={`aura-badge ${a.status === "Graded" ? "aura-badge-success" : "aura-badge-info"}`}>{a.status}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setViewAssignment(a)}
                      className="aura-btn aura-btn-primary py-1 px-2.5 text-[11px] flex items-center gap-1 ml-auto"
                    >
                      <Brain className="h-3 w-3" /> AI Grade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Evaluation Modal */}
      {viewAssignment && (
        <AIEvalModal
          assignment={viewAssignment}
          onClose={() => setViewAssignment(null)}
        />
      )}
    </div>
  );
}

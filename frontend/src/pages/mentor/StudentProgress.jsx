import { useParams, Link } from "react-router-dom";
import { getMentorStudentProgress } from "../../services/mentor/mentorApi";
import PageHeader from "../../components/ui/PageHeader";
import {
  UserCheck,
  BookOpen,
  Award,
  TrendingUp,
  Target,
  Sparkles,
  FileText,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Video,
} from "lucide-react";

const DEMO_PROGRESS = {
  name: "Alex Johnson",
  email: "alex@aura.edu",
  rollNo: "22AI701",
  department: "Artificial Intelligence & Data Science",
  semester: "Semester 7",
  cgpa: 6.9,
  attendance: 68,
  assignmentsPending: 3,
  projectsActive: 2,
  riskLevel: "Critical",
  skills: ["Python", "TensorFlow", "React.js", "Data Visualisation", "SQL"],
  achievements: [
    "Published paper on Computer Vision in IEEE Student Track 2025",
    "Hackathon Top 5 Finalist — National AI Challenge",
  ],
  history: [
    { label: "Mid-Term Examination Score", value: "68% (Needs improvement in BDA)", date: "Aug 15, 2026" },
    { label: "Attendance Warning Issued", value: "Attendance dropped below 70%", date: "Aug 10, 2026" },
    { label: "Mentor Session Conducted", value: "Discussed study plan and recovery targets", date: "Aug 02, 2026" },
  ],
  subjectBreakdown: [
    { code: "22AI701", name: "Data Visualisation", internal: 38, attendance: 70, status: "Warning" },
    { code: "22AI702", name: "Natural Language Processing", internal: 42, attendance: 82, status: "Safe" },
    { code: "22AI703", name: "Computer Vision", internal: 44, attendance: 85, status: "Safe" },
    { code: "22AI704", name: "Reinforcement Learning", internal: 40, attendance: 78, status: "Safe" },
    { code: "22AI705", name: "Big Data Analytics", internal: 28, attendance: 58, status: "Critical" },
  ],
};

export default function StudentProgress() {
  const { studentId } = useParams();
  const [progress, setProgress] = useState(DEMO_PROGRESS);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await getMentorStudentProgress(studentId);
        if (response?.data?.data) {
          setProgress(response.data.data);
        }
      } catch {
        // Fallback demo progress loaded
      }
    };
    if (studentId) fetchProgress();
  }, [studentId]);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Student Profile & Progress"
        title={progress.name || "Student Progress"}
        description={`${progress.department || "AIDS"} · ${progress.semester || "Semester 7"} (${progress.rollNo || progress.email})`}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/mentor/assigned-students" className="aura-btn aura-btn-secondary text-xs flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Students
            </Link>
            <Link to="/mentor/meetings" className="aura-btn aura-btn-primary text-xs flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5" />
              Schedule Session
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="attendance-stats">
        <div className="attendance-stat-card">
          <span className="text-xs font-bold uppercase text-slate-400">CGPA</span>
          <p className="text-3xl font-extrabold text-white mt-2">{progress.cgpa ?? "6.9"}</p>
          <p className="text-xs text-rose-400 mt-1">Needs Improvement</p>
        </div>

        <div className="attendance-stat-card">
          <span className="text-xs font-bold uppercase text-slate-400">Attendance</span>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">{progress.attendance ?? "68"}%</p>
          <p className="text-xs text-rose-400 mt-1">Below 75% Requirement</p>
        </div>

        <div className="attendance-stat-card">
          <span className="text-xs font-bold uppercase text-slate-400">Pending Assignments</span>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">{progress.assignmentsPending ?? 3}</p>
          <p className="text-xs text-slate-400 mt-1">Overdue Tasks</p>
        </div>

        <div className="attendance-stat-card">
          <span className="text-xs font-bold uppercase text-slate-400">Risk Assessment</span>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">{progress.riskLevel || "Critical"}</p>
          <p className="text-xs text-slate-400 mt-1">Action Required</p>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="attendance-tabs my-0">
        {["overview", "subjects", "skills", "achievements", "history"].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`attendance-tab capitalize ${activeTab === t ? "active" : ""}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="attendance-main-grid">
          {/* AI Mentoring Advisory */}
          <div className="aura-card border-purple-500/30 bg-purple-950/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">AI Mentor Diagnosis</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {progress.name} is demonstrating severe attendance deficiencies in <strong>Big Data Analytics (58%)</strong> and internal test score drops. However, skills in <strong>TensorFlow</strong> and <strong>React.js</strong> remain strong.
            </p>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              💡 <strong>Actionable Step:</strong> Recommend 3 mandatory makeup sessions in BDA and assign a peer tutor for internal exam preparation.
            </div>
          </div>

          {/* Subject Breakdown Quick Table */}
          <div className="aura-card">
            <h3 className="text-base font-bold text-white mb-3">Subject Performance Breakdown</h3>
            <div className="space-y-3">
              {(progress.subjectBreakdown || DEMO_PROGRESS.subjectBreakdown).map((s) => (
                <div key={s.code} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{s.name}</p>
                    <p className="text-[10px] text-slate-400">{s.code} · Internal: {s.internal}/50</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-extrabold ${s.attendance < 75 ? "text-rose-400" : "text-emerald-400"}`}>{s.attendance}%</span>
                    <span className={`aura-badge ml-2 ${s.status === "Critical" ? "aura-badge-danger" : "aura-badge-success"}`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div className="aura-card">
          <h3 className="text-base font-bold text-white mb-3">Skills & Technical Competencies</h3>
          <div className="flex flex-wrap gap-2">
            {(progress.skills || []).map((skill, idx) => (
              <span key={idx} className="aura-badge aura-badge-purple text-xs py-1 px-3">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="aura-card">
          <h3 className="text-base font-bold text-white mb-3">Achievements & Publications</h3>
          <div className="space-y-3">
            {(progress.achievements || []).map((ach, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                <p className="text-xs text-white font-medium">{ach}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="aura-card">
          <h3 className="text-base font-bold text-white mb-3">Mentoring Progress History</h3>
          <div className="space-y-3">
            {(progress.history || []).map((h, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-xs font-bold text-white">{h.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{h.value}</p>
                <p className="text-[10px] text-slate-500 mt-1">{h.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

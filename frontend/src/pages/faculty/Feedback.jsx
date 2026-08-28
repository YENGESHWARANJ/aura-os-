import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { MessageSquare, Star, ThumbsUp, AlertCircle, Filter, Search, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";

const DEMO_FEEDBACKS = [
  {
    _id: "fb1",
    student: "Anonymous Student",
    course: "Ethics and AI",
    section: "Sec A",
    date: "2026-08-18",
    rating: 5,
    sentiment: "Positive",
    category: "Teaching Clarity",
    comment: "Prof. Nithya explains complex ethical frameworks using real-world tech case studies. The class discussions on algorithmic bias were super engaging!",
    tags: ["Real-world Examples", "Engaging", "Clear Explanations"],
  },
  {
    _id: "fb2",
    student: "Anonymous Student",
    course: "Machine Learning",
    section: "Sec B",
    date: "2026-08-16",
    rating: 4,
    sentiment: "Constructive",
    category: "Pacing & Difficulty",
    comment: "The practical coding labs are excellent. However, the mathematical derivation of Gradient Descent in lecture 4 felt a bit rushed.",
    tags: ["Fast Pacing", "Great Labs", "Needs Video Summary"],
  },
  {
    _id: "fb3",
    student: "Anonymous Student",
    course: "Data Science",
    section: "Sec A",
    date: "2026-08-15",
    rating: 5,
    sentiment: "Positive",
    category: "Course Content Quality",
    comment: "The Pandas and EDA project guidelines were crystal clear. Appreciate the detailed feedback given on assignment submissions!",
    tags: ["Prompt Feedback", "Clear Guidelines"],
  },
  {
    _id: "fb4",
    student: "Anonymous Student",
    course: "Ethics and AI",
    section: "Sec A",
    date: "2026-08-12",
    rating: 3,
    sentiment: "Critical",
    category: "Workload",
    comment: "Two major assignment deadlines overlapped in the same week. It was quite stressful to submit both on time.",
    tags: ["Heavy Workload", "Deadline Overlap"],
  },
  {
    _id: "fb5",
    student: "Anonymous Student",
    course: "Natural Language Processing",
    section: "Sec C",
    date: "2026-08-10",
    rating: 5,
    sentiment: "Positive",
    category: "Doubt Resolution",
    comment: "Always available after class and during office hours to resolve doubts on Transformer architectures. Best course this semester!",
    tags: ["Accessible Faculty", "Great Support"],
  },
];

const SENTIMENT_COLORS = {
  Positive: "aura-badge-success",
  Constructive: "aura-badge-warning",
  Critical: "aura-badge-danger",
};

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState(DEMO_FEEDBACKS);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [filterSentiment, setFilterSentiment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesCourse = selectedCourse === "All" || fb.course === selectedCourse;
    const matchesSentiment = filterSentiment === "All" || fb.sentiment === filterSentiment;
    const matchesSearch =
      fb.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCourse && matchesSentiment && matchesSearch;
  });

  const handleAcknowledge = (id) => {
    toast.success("Feedback acknowledged. Notification sent to student channel.");
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Student Course Feedback & Sentiment"
        description="Review student course evaluations, teaching clarity ratings, and AI-powered feedback analysis."
        actions={
          <div className="flex items-center gap-2">
            <span className="aura-badge aura-badge-success py-1.5 px-3 font-bold text-xs">
              <Star className="h-3.5 w-3.5 mr-1 inline fill-amber-400 text-amber-400" />
              4.7 / 5.0 Average Rating
            </span>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Overall Course Rating", value: "4.7 / 5.0", color: "text-amber-400", sub: "Based on 142 reviews" },
          { label: "Positive Sentiment", value: "78%", color: "text-emerald-400", sub: "111 positive evaluations" },
          { label: "Teaching Clarity", value: "4.8 / 5.0", color: "text-cyan-400", sub: "Top rated attribute" },
          { label: "Workload Balance", value: "4.4 / 5.0", color: "text-purple-400", sub: "Moderate pacing" },
        ].map((kpi) => (
          <div key={kpi.label} className="aura-card p-4">
            <p className="text-xs font-semibold text-slate-400 mb-1">{kpi.label}</p>
            <p className={`text-2xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-[11px] text-slate-500 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* AI Feedback Sentiment Insights Banner */}
      <div className="aura-card border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 p-5 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-5 w-5 text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            AI Sentiment Analysis Insight
            <span className="aura-badge aura-badge-info text-[10px]">Updated Today</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Students highly praise the practical code demonstrations and prompt assignment feedback in <strong className="text-cyan-400">Ethics and AI</strong> and <strong className="text-cyan-400">Data Science</strong>. A recurring suggestion highlights that mathematical derivations in <strong className="text-amber-400">Machine Learning (Sec B)</strong> could benefit from a short supplementary video summary.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="aura-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="aura-input pl-9 text-xs"
            placeholder="Search feedback by keyword, tag, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="aura-select text-xs"
          >
            <option value="All">All Courses</option>
            <option>Ethics and AI</option>
            <option>Machine Learning</option>
            <option>Data Science</option>
            <option>Natural Language Processing</option>
          </select>
          <select
            value={filterSentiment}
            onChange={(e) => setFilterSentiment(e.target.value)}
            className="aura-select text-xs"
          >
            <option value="All">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Constructive">Constructive</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Feedback Review Cards List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((fb) => (
          <div key={fb._id} className="aura-card p-5 space-y-3 hover:border-slate-700 transition">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                  <MessageSquare className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{fb.student}</span>
                    <span className="text-xs text-slate-400">• {fb.course} ({fb.section})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{fb.category} • Submitted on {fb.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < fb.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"}`}
                    />
                  ))}
                </div>
                <span className={`aura-badge text-xs font-bold ${SENTIMENT_COLORS[fb.sentiment]}`}>
                  {fb.sentiment}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/60">
              "{fb.comment}"
            </p>

            <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
              <div className="flex flex-wrap gap-1.5">
                {fb.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleAcknowledge(fb._id)}
                className="aura-btn aura-btn-secondary py-1 px-3 text-xs flex items-center gap-1.5"
              >
                <ThumbsUp className="h-3.5 w-3.5 text-cyan-400" />
                Acknowledge Feedback
              </button>
            </div>
          </div>
        ))}

        {filteredFeedbacks.length === 0 && (
          <div className="aura-card p-8 text-center text-slate-400 text-sm">
            No feedback found matching the current search or filters.
          </div>
        )}
      </div>
    </div>
  );
}

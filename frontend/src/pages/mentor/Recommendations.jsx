import { useEffect, useState } from "react";
import { getMentorRecommendations } from "../../services/mentor/mentorApi";
import PageHeader from "../../components/ui/PageHeader";
import { Sparkles, CheckCircle, AlertTriangle, BookOpen, UserCheck, Award } from "lucide-react";

const DEMO_RECOMMENDATIONS = [
  {
    _id: "rec1",
    student: "Alex Johnson",
    category: "Attendance & Remedial",
    priority: "High",
    title: "Big Data Analytics Recovery Plan",
    description: "Recommend attending 3 consecutive makeup lectures in BDA and practicing Hadoop map-reduce lab exercises to cross the 75% threshold.",
    status: "Active",
  },
  {
    _id: "rec2",
    student: "Rahul Kumar",
    category: "Academic Tutoring",
    priority: "High",
    title: "NLP Internal Test Tutoring",
    description: "Pair student with peer tutor Ananya Sharma for Natural Language Processing transformer architecture concepts.",
    status: "Active",
  },
  {
    _id: "rec3",
    student: "Priya S",
    category: "Career & Research",
    priority: "Medium",
    title: "IEEE Conference Paper Submission",
    description: "Encourage Priya to complete final revisions on the Computer Vision research draft for upcoming student conference track.",
    status: "Completed",
  },
];

export default function MentorRecommendations() {
  const [recommendations, setRecommendations] = useState(DEMO_RECOMMENDATIONS);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await getMentorRecommendations();
        if (response?.data?.data?.length) {
          setRecommendations(response.data.data);
        }
      } catch {
        // Fallback demo recommendations loaded
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Mentor Portal"
        title="AI & Mentor Recommendations"
        description="Tailored study advice, academic remediation plans, and career guidance generated for assigned students."
        actions={
          <span className="aura-badge aura-badge-purple py-1.5 px-3">
            <Sparkles className="h-3.5 w-3.5 mr-1 inline text-purple-400" />
            {recommendations.length} Active Recommendations
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <div key={rec._id || rec.id || index} className="aura-card border-purple-500/30 bg-purple-950/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="aura-badge aura-badge-purple text-[10px]">{rec.category || "Academic"}</span>
                <span
                  className={`aura-badge ${
                    rec.priority === "High" ? "aura-badge-danger" : "aura-badge-warning"
                  }`}
                >
                  {rec.priority || "Medium"} Priority
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{rec.title}</h3>
              {rec.student && <p className="text-xs font-semibold text-cyan-400 mt-0.5">Student: {rec.student}</p>}
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{rec.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Status: <strong className="text-white">{rec.status || "Active"}</strong></span>
              <button className="aura-btn aura-btn-secondary text-[11px] py-1 px-3">
                Send to Student Portal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

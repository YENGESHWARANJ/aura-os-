import { Link } from "react-router-dom";
import {
  Calendar,
  LayoutGrid,
  ClipboardList,
  Users,
  Briefcase,
  BookOpen,
  FolderGit2,
  Award,
  Sparkles,
  Bot,
  ArrowRight,
} from "lucide-react";

export default function ExploreActivities() {
  const sections = [
    {
      id: "attendance",
      title: "Attendance",
      count: 2,
      modules: [
        {
          id: "my-attendance",
          title: "My Attendance",
          subtitle: "Open module",
          to: "/dashboard/attendance",
          gradient: "gradient-sky-blue",
          icon: Calendar,
        },
        {
          id: "movement-pass",
          title: "Movement Pass",
          subtitle: "Open module",
          to: "/dashboard/academics",
          gradient: "gradient-purple-violet",
          icon: LayoutGrid,
        },
      ],
    },
    {
      id: "activity",
      title: "Activity",
      count: 1,
      modules: [
        {
          id: "booking",
          title: "Booking",
          subtitle: "Open module",
          to: "/dashboard/study-planner",
          gradient: "gradient-soft-purple",
          icon: ClipboardList,
        },
      ],
    },
    {
      id: "personalized-skill",
      title: "Personalized Skill",
      count: 1,
      modules: [
        {
          id: "group-discussion",
          title: "Group Discussion",
          subtitle: "Open module",
          to: "/dashboard/skills",
          gradient: "gradient-teal-emerald",
          icon: LayoutGrid,
        },
      ],
    },
    {
      id: "others",
      title: "Others",
      count: 1,
      modules: [
        {
          id: "placement-panels",
          title: "Placement Panels",
          subtitle: "Open module",
          to: "/dashboard/projects",
          gradient: "gradient-warm-amber",
          icon: LayoutGrid,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header matching reference */}
      <div className="mb-6">
        <div className="hub-pill">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Activity Hub</span>
        </div>
        <h1 className="page-title">Explore Activities</h1>
        <p className="page-description">
          Browse modules by category and jump straight into the task you need.
        </p>
      </div>

      {/* Category Sections */}
      <div className="space-y-5">
        {sections.map((sec) => (
          <div key={sec.id} className="activity-section-card">
            {/* Category Header */}
            <div className="activity-section-header">
              <h2 className="activity-section-title">{sec.title}</h2>
              <span className="section-badge-count">{sec.count}</span>
            </div>

            {/* Grid of Module Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {sec.modules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <Link
                    key={mod.id}
                    to={mod.to}
                    className={`module-card ${mod.gradient}`}
                  >
                    {/* Organic decorative bubbles */}
                    <div className="module-card-bubble-1" />
                    <div className="module-card-bubble-2" />
                    <div className="module-card-bubble-3" />

                    {/* Frosted Icon Box */}
                    <div className="module-icon-box relative z-10">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    {/* Card Text Content */}
                    <div className="relative z-10">
                      <h3 className="module-card-title">{mod.title}</h3>
                      <p className="module-card-subtitle">{mod.subtitle}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

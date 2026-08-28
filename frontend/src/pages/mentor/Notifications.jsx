import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getNotifications } from "../../services/notifications/notificationApi";
import PageHeader from "../../components/ui/PageHeader";
import { Bell, CheckCheck, AlertTriangle, Calendar, UserCheck, Sparkles } from "lucide-react";

const DEMO_MENTOR_NOTIFICATIONS = [
  {
    _id: "mn1",
    title: "Critical Attendance Drop Alert",
    type: "Risk Warning",
    message: "Alex Johnson's attendance in Big Data Analytics fell below 60%. Automated alert dispatched to student and parent.",
    createdAt: "2026-08-19T08:30:00.000Z",
    isRead: false,
  },
  {
    _id: "mn2",
    title: "1-on-1 Session Confirmed",
    type: "Meeting",
    message: "Priya S confirmed attendance for Friday 2:00 PM mentoring session.",
    createdAt: "2026-08-18T14:15:00.000Z",
    isRead: false,
  },
  {
    _id: "mn3",
    title: "Goal Milestone Completed",
    type: "Achievement",
    message: "Ananya Sharma completed IEEE paper revisions target 3 days ahead of deadline.",
    createdAt: "2026-08-17T11:00:00.000Z",
    isRead: true,
  },
];

export default function MentorNotifications() {
  const [notifications, setNotifications] = useState(DEMO_MENTOR_NOTIFICATIONS);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications({ page: 1, limit: 50 });
        if (response?.data?.data?.notifications?.length) {
          setNotifications(response.data.data.notifications);
        }
      } catch {
        // Fallback demo notifications loaded
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All mentor notifications marked as read.");
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Mentor Portal"
        title="Mentor Notifications & Alerts"
        description="Real-time alert stream for student risk escalations, meeting confirmations, and goal milestones."
        actions={
          <button onClick={handleMarkAllRead} className="aura-btn aura-btn-secondary text-xs flex items-center gap-2">
            <CheckCheck className="h-4 w-4 text-cyan-400" />
            Mark all read
          </button>
        }
      />

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`aura-card border-l-4 transition ${
              n.type?.includes("Risk") || n.type?.includes("Warning")
                ? "border-l-rose-500 bg-rose-950/10"
                : n.type === "Meeting"
                ? "border-l-purple-500 bg-purple-950/10"
                : "border-l-cyan-500 bg-slate-900"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white">{n.title}</h3>
                  {!n.isRead && <span className="aura-badge aura-badge-info text-[10px]">New Alert</span>}
                  <span className="aura-badge aura-badge-neutral text-[10px]">{n.type || "System"}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">{n.message}</p>
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0">
                {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recent"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

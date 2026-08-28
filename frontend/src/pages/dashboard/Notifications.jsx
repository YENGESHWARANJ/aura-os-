import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notifications/notificationApi";
import {
  Bell,
  CheckCheck,
  Trash2,
  Check,
  BookOpen,
  Calendar,
  FileText,
  AlertCircle,
  MessageSquare,
  Info,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

const TYPE_CONFIG = {
  attendance: { icon: Calendar, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  assignment: { icon: FileText, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  grade: { icon: BookOpen, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  mentor: { icon: MessageSquare, color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  system: { icon: Info, color: "bg-slate-700/50 text-slate-400 border-slate-600/30" },
  warning: { icon: AlertCircle, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

const TABS = ["All", "Unread", "Academic", "Assignments", "Attendance", "Mentor", "System"];

function getTypeConfig(type = "system") {
  const key = type.toLowerCase();
  return TYPE_CONFIG[key] || TYPE_CONFIG.system;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await getNotifications({ page: 1, limit: 50 });
        setNotifications(response.data.data.notifications || []);
      } catch {
        toast.error("Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((cur) => cur.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Unable to mark all as read.");
    }
  };

  const handleReadToggle = async (id) => {
    try {
      const res = await markNotificationAsRead(id);
      setNotifications((cur) => cur.map((n) => (n._id === id ? res.data.data : n)));
    } catch {
      toast.error("Unable to update notification.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((cur) => cur.filter((n) => n._id !== id));
      toast.success("Notification deleted.");
    } catch {
      toast.error("Unable to delete notification.");
    }
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "All") return true;
    if (activeTab === "Unread") return !n.isRead;
    return (n.type || "").toLowerCase() === activeTab.toLowerCase();
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="aura-page">
      <div className="aura-container">
        <PageHeader
          eyebrow="Notifications"
          title="Notification Center"
          description="Live updates from the AURA OS academic platform."
          actions={
            unreadCount > 0 && (
              <Button
                variant="secondary"
                icon={CheckCheck}
                onClick={handleMarkAllRead}
              >
                Mark all read
              </Button>
            )
          }
        />

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <div className="aura-tabs flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`aura-tab ${activeTab === tab ? "active" : ""}`}
              >
                {tab}
                {tab === "Unread" && unreadCount > 0 && (
                  <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-slate-950">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aura-card aura-card-body flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description={activeTab === "All" ? "You're all caught up! No notifications to display." : `No ${activeTab.toLowerCase()} notifications found.`}
            actionLabel={activeTab !== "All" ? "View all" : undefined}
            onAction={activeTab !== "All" ? () => setActiveTab("All") : undefined}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => {
              const { icon: Icon, color } = getTypeConfig(n.type);
              return (
                <div
                  key={n._id}
                  className={`aura-card transition-all ${
                    !n.isRead
                      ? "border-cyan-500/25 shadow-[0_0_0_1px_rgba(6,182,212,0.12)]"
                      : ""
                  }`}
                >
                  <div className="aura-card-body flex items-start gap-4">
                    {/* Icon */}
                    <div className={`rounded-full border p-2.5 shrink-0 ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-white truncate">{n.title}</p>
                            {!n.isRead && (
                              <span className="aura-badge aura-badge-info">New</span>
                            )}
                            <span className="aura-badge aura-badge-neutral capitalize">
                              {n.type || "System"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">{n.message}</p>
                        </div>
                        <span className="text-[11px] text-slate-500 shrink-0 whitespace-nowrap font-medium">
                          {n.createdAt ? timeAgo(n.createdAt) : ""}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-2">
                        {!n.isRead && (
                          <button
                            onClick={() => handleReadToggle(n._id)}
                            className="aura-btn aura-btn-ghost inline-flex items-center gap-1.5 text-xs h-8 px-3"
                          >
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Mark read</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(n._id)}
                          className="aura-btn aura-btn-ghost inline-flex items-center gap-1.5 text-xs h-8 px-3"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                          <span className="text-rose-400">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

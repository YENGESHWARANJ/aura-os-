import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  sendTestNotification,
} from "../../services/notifications/notificationApi";
import { setUnreadCount } from "../../redux/slices/notificationSlice";
import { initSocket } from "../../services/socket";
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
  ExternalLink,
  Smartphone,
  Mail,
  Zap,
  Sparkles,
  Send,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

const TYPE_CONFIG = {
  attendance: { icon: Calendar, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  attendance_warning: { icon: AlertCircle, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  assignment: { icon: FileText, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  assignment_approval: { icon: FileText, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  assignment_evaluation: { icon: FileText, color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  grade: { icon: BookOpen, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  marks_updated: { icon: BookOpen, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  mentor: { icon: MessageSquare, color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  mentor_message: { icon: MessageSquare, color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  system: { icon: Info, color: "bg-slate-700/50 text-slate-400 border-slate-600/30" },
  system_notification: { icon: Info, color: "bg-slate-700/50 text-slate-400 border-slate-600/30" },
  evidence_verification: { icon: Sparkles, color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  intervention_recommendation: { icon: Zap, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  warning: { icon: AlertCircle, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

const TABS = ["All", "Unread", "Assignments", "Attendance", "Mentor", "Evidence", "System"];

function getTypeConfig(type = "system") {
  const key = (type || "system").toLowerCase();
  return TYPE_CONFIG[key] || TYPE_CONFIG.system;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardNotifications() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [testingTrigger, setTestingTrigger] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications({ page: 1, limit: 50 });
      const list = response.data?.data?.notifications || [];
      setNotifications(list);
      const unread = list.filter((n) => !n.isRead).length;
      dispatch(setUnreadCount(unread));
    } catch {
      toast.error("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const socket = initSocket();
    if (!socket) return undefined;

    const handleNotificationCreated = (notification) => {
      if (!notification?._id) return;

      setNotifications((current) => {
        if (current.some((item) => item._id === notification._id)) return current;
        return [notification, ...current];
      });
    };

    const handleUnreadCount = ({ count }) => {
      if (typeof count === "number") dispatch(setUnreadCount(count));
    };

    socket.on("notification.created", handleNotificationCreated);
    socket.on("notification.unread_count", handleUnreadCount);

    return () => {
      socket.off("notification.created", handleNotificationCreated);
      socket.off("notification.unread_count", handleUnreadCount);
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((cur) => cur.map((n) => ({ ...n, isRead: true })));
      dispatch(setUnreadCount(0));
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Unable to mark all as read.");
    }
  };

  const handleReadToggle = async (id) => {
    try {
      const res = await markNotificationAsRead(id);
      setNotifications((current) => {
        const updated = current.map((notification) =>
          notification._id === id
            ? res.data?.data || { ...notification, isRead: true }
            : notification
        );
        dispatch(setUnreadCount(updated.filter((notification) => !notification.isRead).length));
        return updated;
      });
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

  const handleDeepLink = async (notification) => {
    // 1. Mark as read in background
    if (!notification.isRead) {
      handleReadToggle(notification._id);
    }
    // 2. Navigate to targetRoute
    const route = notification.targetRoute || "/dashboard/notifications";
    navigate(route);
  };

  const handleTriggerTest = async () => {
    setTestingTrigger(true);
    try {
      const testScenarios = [
        {
          type: "ASSIGNMENT_APPROVAL",
          title: "Assignment Approved by Mentor",
          message: "Dr. Ramesh has approved your 'Transformer Architecture in NLP' assignment with Grade A+.",
          targetRoute: "/dashboard/assignments",
        },
        {
          type: "EVIDENCE_VERIFICATION",
          title: "Evidence Credential Verified",
          message: "Your 'Machine Learning Specialization' certificate has been verified on the cryptographic ledger.",
          targetRoute: "/dashboard/evidence-wallet",
        },
        {
          type: "ATTENDANCE_WARNING",
          title: "Attendance Notice: Ethics in AI",
          message: "Your attendance in Ethics in AI has dropped to 74%. Recommended target: 75%+.",
          targetRoute: "/dashboard/attendance",
        },
      ];

      const scenario = testScenarios[Math.floor(Math.random() * testScenarios.length)];
      await sendTestNotification(scenario);
      toast.success("🚀 Multi-channel notification triggered! (Push, Email, In-App)");
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to dispatch test notification");
    } finally {
      setTestingTrigger(false);
    }
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "All") return true;
    if (activeTab === "Unread") return !n.isRead;
    const t = (n.type || "").toLowerCase();
    const tabLower = activeTab.toLowerCase();
    if (tabLower === "assignments") return t.includes("assignment");
    if (tabLower === "attendance") return t.includes("attendance");
    if (tabLower === "mentor") return t.includes("mentor");
    if (tabLower === "evidence") return t.includes("evidence") || t.includes("certificate");
    if (tabLower === "system") return t.includes("system") || t.includes("admin");
    return t.includes(tabLower);
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="aura-page">
      <div className="aura-container">
        <PageHeader
          eyebrow="Multi-Channel Academic Notifications"
          title="Notification Center"
          description="Real-time multi-channel notifications delivered across Mobile Push (Android), Email, and In-App."
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleTriggerTest}
                disabled={testingTrigger}
                className="aura-btn aura-btn-primary text-xs h-9 px-3.5 flex items-center gap-1.5 shadow-sm"
                title="Send a live test notification across Push, Email, and In-App"
              >
                <Send className={`h-3.5 w-3.5 ${testingTrigger ? "animate-spin" : ""}`} />
                <span>{testingTrigger ? "Dispatching..." : "Send Test Multi-Channel"}</span>
              </button>

              {unreadCount > 0 && (
                <Button
                  variant="secondary"
                  icon={CheckCheck}
                  onClick={handleMarkAllRead}
                  className="text-xs h-9 px-3"
                >
                  Mark all read
                </Button>
              )}
            </div>
          }
        />

        {/* Channel Status Overview Banner */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white">Mobile Push</p>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400">Android & iOS Expo Push Service</p>
            </div>
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white">In-App Real-Time</p>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400">Socket.IO Instant Delivery</p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white">Email Notification</p>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400">Transactional Nodemailer SMTP</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
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

        {/* Content List */}
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
            description={
              activeTab === "All"
                ? "You're all caught up! No notifications to display."
                : `No ${activeTab.toLowerCase()} notifications found.`
            }
            actionLabel={activeTab !== "All" ? "View all" : "Trigger Test Notification"}
            onAction={activeTab !== "All" ? () => setActiveTab("All") : handleTriggerTest}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => {
              const { icon: Icon, color } = getTypeConfig(n.type);
              const hasDeepLink = Boolean(n.targetRoute && n.targetRoute !== "/dashboard/notifications");

              return (
                <div
                  key={n._id}
                  className={`aura-card transition-all relative overflow-hidden ${
                    !n.isRead
                      ? "border-cyan-500/30 bg-slate-900/90 shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]"
                      : "bg-slate-900/50"
                  }`}
                >
                  {!n.isRead && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500" />
                  )}

                  <div className="aura-card-body flex items-start gap-4">
                    {/* Category Icon */}
                    <div className={`rounded-xl border p-2.5 shrink-0 ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Main Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-white truncate">{n.title}</p>
                            {!n.isRead && (
                              <span className="aura-badge aura-badge-info text-[10px]">New</span>
                            )}
                            <span className="aura-badge aura-badge-neutral text-[10px] capitalize">
                              {n.type ? n.type.replace(/_/g, " ") : "System"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-300 leading-relaxed">{n.message}</p>
                        </div>
                        <span className="text-[11px] text-slate-500 shrink-0 whitespace-nowrap font-medium">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>

                      {/* Multi-Channel Status Badges & Action Buttons */}
                      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                        {/* Channel Badges */}
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium"
                            title="In-App Socket Status"
                          >
                            <Zap className="h-2.5 w-2.5 text-cyan-400" />
                            In-App: {n.inAppStatus || "sent"}
                          </span>

                          <span
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium"
                            title="Mobile Push Status"
                          >
                            <Smartphone className="h-2.5 w-2.5 text-purple-400" />
                            Push: {n.pushStatus || "sent"}
                          </span>

                          <span
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium"
                            title="Email Delivery Status"
                          >
                            <Mail className="h-2.5 w-2.5 text-emerald-400" />
                            Email: {n.emailStatus || "sent"}
                          </span>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex items-center gap-1.5 ml-auto">
                          {hasDeepLink && (
                            <button
                              onClick={() => handleDeepLink(n)}
                              className="aura-btn aura-btn-primary text-xs h-7 px-2.5 flex items-center gap-1"
                            >
                              <span>Open Resource</span>
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          )}

                          {!n.isRead && (
                            <button
                              onClick={() => handleReadToggle(n._id)}
                              className="aura-btn aura-btn-ghost text-xs h-7 px-2 text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-1"
                              title="Mark as read"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Mark read</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(n._id)}
                            className="aura-btn aura-btn-ghost text-xs h-7 px-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                            title="Delete notification"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
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

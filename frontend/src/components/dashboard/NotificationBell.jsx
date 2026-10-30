import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { toast } from "react-hot-toast";
import { initSocket } from "../../services/socket";
import { getUnreadCount } from "../../services/notifications/notificationApi";
import { addNotification, setUnreadCount } from "../../redux/slices/notificationSlice";

export default function NotificationBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unreadCount = useSelector((state) => state.notifications?.unreadCount ?? 0);

  useEffect(() => {
    const socket = initSocket();

    const handleNotificationCreated = (notification) => {
      dispatch(addNotification(notification));
      // Trigger instant in-app Toast
      toast(
        (t) => (
          <div
            onClick={() => {
              toast.dismiss(t.id);
              if (notification.targetRoute) {
                navigate(notification.targetRoute);
              } else {
                navigate("/dashboard/notifications");
              }
            }}
            className="flex items-start gap-3 cursor-pointer py-1"
          >
            <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Bell className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{notification.title || "New Notification"}</p>
              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{notification.message}</p>
              <span className="text-[10px] text-cyan-400 mt-1 inline-block font-semibold">Tap to view &rarr;</span>
            </div>
          </div>
        ),
        {
          duration: 5000,
          position: "top-right",
          style: {
            background: "#091224",
            color: "#e2e8f0",
            border: "1px solid #1e293b",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(6, 182, 212, 0.2)",
            borderRadius: "14px",
            padding: "10px 14px",
          },
        }
      );
    };

    const handleUnreadCount = ({ count }) => {
      if (typeof count === "number") {
        dispatch(setUnreadCount(count));
      }
    };

    if (socket) {
      socket.on("notification.created", handleNotificationCreated);
      socket.on("notification.unread_count", handleUnreadCount);
    }

    const loadUnreadCount = async () => {
      try {
        const response = await getUnreadCount();
        const count = response.data?.data?.count ?? 0;
        dispatch(setUnreadCount(count));
      } catch (err) {
        if (err.response?.status !== 401) {
          console.warn("Unable to load notification count", err?.message || err);
        }
      }
    };

    loadUnreadCount();

    return () => {
      if (socket) {
        socket.off("notification.created", handleNotificationCreated);
        socket.off("notification.unread_count", handleUnreadCount);
      }
    };
  }, [dispatch, navigate]);

  return (
    <button
      onClick={() => navigate("/dashboard/notifications")}
      className="relative flex items-center gap-2 h-10 rounded-xl border border-slate-800/80 bg-[#091224] px-3.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800/60 hover:text-white"
      title="Notifications"
    >
      <div className="relative flex items-center justify-center">
        <Bell className="h-4 w-4 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-extrabold text-slate-950 shadow-sm animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
      <span className="hidden md:inline">Notifications</span>
    </button>
  );
}

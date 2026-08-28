import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { initSocket } from "../../services/socket";
import { getUnreadCount } from "../../services/notifications/notificationApi";
import { addNotification, setUnreadCount } from "../../redux/slices/notificationSlice";

export default function NotificationBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unreadCount = useSelector((state) => state.notifications?.unreadCount || 3);

  useEffect(() => {
    const socket = initSocket();
    if (!socket) return;

    socket.on("notification.created", (notification) => {
      dispatch(addNotification(notification));
    });

    const loadUnreadCount = async () => {
      try {
        const response = await getUnreadCount();
        dispatch(setUnreadCount(response.data?.data?.count || 3));
      } catch (err) {
        if (err.response?.status !== 401) {
          console.warn("Unable to load notification count", err?.message || err);
        }
      }
    };

    loadUnreadCount();

    return () => {
      socket.off("notification.created");
    };
  }, [dispatch]);

  return (
    <button
      onClick={() => navigate("/dashboard/notifications")}
      className="relative flex items-center gap-2 h-10 rounded-xl border border-slate-800/80 bg-[#091224] px-3.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800/60 hover:text-white"
      title="Notifications"
    >
      <div className="relative flex items-center justify-center">
        <Bell className="h-3.5 w-3.5 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
      <span className="hidden md:inline">Notifications</span>
    </button>
  );
}

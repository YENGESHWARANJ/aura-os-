import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { Bell, CheckCircle, AlertTriangle, Info } from "lucide-react";

const DEMO_NOTIFS = [
  { _id: "n1", type: "alert", title: "Low Attendance Warning Issued", body: "4 students in Ethics and AI have attendance below 75%. Notifications sent.", time: "2h ago", read: false },
  { _id: "n2", type: "info", title: "Department Meeting — Tomorrow", body: "AI Department meeting scheduled for tomorrow at 10:00 AM in Conference Room B.", time: "5h ago", read: false },
  { _id: "n3", type: "success", title: "Marks Submitted Successfully", body: "Mid-Semester marks for Machine Learning Sec B have been submitted and approved.", time: "Yesterday", read: true },
  { _id: "n4", type: "alert", title: "Assignment Deadline Approaching", body: "The ML Model Implementation assignment is due in 3 days. 18 students pending submission.", time: "Yesterday", read: false },
  { _id: "n5", type: "info", title: "Course Material Uploaded", body: "Your lecture slides for Ethics and AI — Chapter 6 are now visible to students.", time: "2 days ago", read: true },
  { _id: "n6", type: "success", title: "Parent Message Received", body: "Parent of Rahul Kumar (22AI704) has sent a message regarding attendance records.", time: "3 days ago", read: true },
];

const TYPE_CONFIG = {
  alert: { icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-950/30 border-rose-500/20" },
  info: { icon: Info, color: "text-cyan-400", bg: "bg-cyan-950/30 border-cyan-500/20" },
  success: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-950/30 border-emerald-500/20" },
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(DEMO_NOTIFS);
  const [filter, setFilter] = useState("All");

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const filtered = filter === "All" ? notifs
    : filter === "Unread" ? notifs.filter((n) => !n.read)
    : notifs.filter((n) => n.type === filter.toLowerCase());

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Notifications"
        description="Stay informed with attendance alerts, department announcements, and academic updates."
        actions={
          <button onClick={markAllRead} className="aura-btn aura-btn-secondary text-xs flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            Mark All as Read
          </button>
        }
      />

      {/* Filter Row */}
      <div className="flex flex-wrap gap-2">
        {["All", "Unread", "Alert", "Info", "Success"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`aura-btn text-xs py-1.5 px-3.5 ${filter === f ? "aura-btn-primary" : "aura-btn-secondary"}`}
          >
            {f}{f === "Unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((n) => {
          const { icon: Icon, color, bg } = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
          return (
            <div key={n._id} className={`aura-card p-4 flex gap-4 border transition hover:scale-[1.005] ${bg} ${!n.read ? "ring-1 ring-slate-700" : "opacity-80"}`}>
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-900/60`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className={`text-sm font-bold ${!n.read ? "text-white" : "text-slate-300"}`}>{n.title}</p>
                  <span className="text-[11px] text-slate-500">{n.time}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.body}</p>
              </div>
              {!n.read && (
                <div className="h-2 w-2 rounded-full bg-cyan-500 flex-shrink-0 mt-2" />
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="aura-card p-8 text-center text-slate-400 text-sm">No notifications in this category.</div>
        )}
      </div>
    </div>
  );
}

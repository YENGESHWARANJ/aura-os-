import React, { useState } from "react";
import { Bell, Shield, Calendar, CheckCheck, AlertCircle, BookOpen } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";

const PARENT_NOTIFICATIONS = [
  {
    id: 1,
    title: "Mid-Term Examination Report Available",
    type: "Academic",
    time: "Today, 10:30 AM",
    read: false,
    message: "Alex scored 88% overall in Mid-Term Examinations. Physics and Math scores are exceptional.",
  },
  {
    id: 2,
    title: "Parent-Mentor Meeting Scheduled",
    type: "Meeting",
    time: "Yesterday, 4:15 PM",
    read: false,
    message: "Dr. Suresh R has invited you to a 1-on-1 online mentoring progress review on Friday at 3:00 PM.",
  },
  {
    id: 3,
    title: "Low Attendance Alert in Big Data Analytics",
    type: "Warning",
    time: "18 Aug 2026",
    read: true,
    message: "Attendance in Big Data Analytics is currently 71%. Minimum required for semester eligibility is 75%.",
  },
  {
    id: 4,
    title: "Assignment Submission Confirmed",
    type: "Assignment",
    time: "15 Aug 2026",
    read: true,
    message: "Alex successfully submitted the Computer Vision Project Phase 1 deliverable ahead of deadline.",
  },
];

export default function ParentNotifications() {
  const [notifications, setNotifications] = useState(PARENT_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Parent Portal"
        title="Parent Notifications & Alerts"
        description="Stay updated with real-time academic announcements, mentor updates, and attendance alerts."
        actions={
          <button onClick={markAllRead} className="aura-btn aura-btn-secondary text-xs flex items-center gap-2">
            <CheckCheck className="h-4 w-4 text-cyan-400" />
            Mark all as read
          </button>
        }
      />

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`aura-card border-l-4 transition ${
              n.type === "Warning"
                ? "border-l-rose-500"
                : n.type === "Meeting"
                ? "border-l-purple-500"
                : "border-l-cyan-500"
            } ${!n.read ? "bg-slate-900/90" : "bg-slate-900/40"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white">{n.title}</h3>
                  {!n.read && <span className="aura-badge aura-badge-info text-[10px]">New</span>}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">{n.message}</p>
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0">{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

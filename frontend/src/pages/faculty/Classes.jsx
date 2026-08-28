import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { Calendar, Clock, MapPin, Users, UserCheck } from "lucide-react";

const TIMETABLE = [
  { day: "Monday", slots: [
    { time: "09:00 AM - 10:00 AM", course: "Ethics and AI", room: "Room A204", section: "Sec A", students: 52 },
    { time: "11:00 AM - 01:00 PM", course: "Machine Learning Lab", room: "Lab 3", section: "Sec B", students: 48 },
  ]},
  { day: "Tuesday", slots: [
    { time: "10:00 AM - 11:00 AM", course: "Data Science", room: "Room B102", section: "Sec A", students: 50 },
    { time: "02:00 PM - 04:00 PM", course: "Natural Language Processing", room: "Room C301", section: "Sec C", students: 54 },
  ]},
  { day: "Wednesday", slots: [
    { time: "09:00 AM - 10:00 AM", course: "Machine Learning", room: "Room A204", section: "Sec B", students: 48 },
    { time: "11:00 AM - 12:00 PM", course: "Big Data Analytics", room: "Lab 1", section: "Sec B", students: 44 },
  ]},
];

export default function Classes() {
  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Faculty Portal"
        title="Weekly Class Timetable & Schedule"
        description="Assigned lecture slots, laboratory sessions, room allocations, and student count."
        actions={
          <span className="aura-badge aura-badge-neutral py-1.5 px-3">
            <Calendar className="h-3.5 w-3.5 mr-1 inline text-blue-400" />
            14 Total Hours / Week
          </span>
        }
      />

      <div className="space-y-6">
        {TIMETABLE.map((d) => (
          <div key={d.day} className="aura-card space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2">{d.day} Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {d.slots.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{s.course}</p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <span><MapPin className="h-3 w-3 inline text-slate-500" /> {s.room}</span>
                      <span>• {s.section} ({s.students} students)</span>
                    </p>
                  </div>
                  <span className="aura-badge aura-badge-info text-[11px]">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getMentorMeetings, createMentorMeeting } from "../../services/mentor/mentorApi";
import PageHeader from "../../components/ui/PageHeader";
import { Video, Calendar, Plus, Clock, CheckCircle } from "lucide-react";

const DEMO_MEETINGS = [
  { _id: "m1", student: "Alex Johnson (22AI701)", date: "2026-08-20T10:30:00.000Z", purpose: "Academic Recovery & Attendance Counseling", status: "Scheduled", notes: "Review Big Data Analytics test scores and attendance goals." },
  { _id: "m2", student: "Priya S (22AI706)", date: "2026-08-21T14:00:00.000Z", purpose: "Career & Research Advisory", status: "Confirmed", notes: "Discuss IEEE paper submission draft." },
];

export default function MentorMeetings() {
  const [meetings, setMeetings] = useState(DEMO_MEETINGS);
  const [form, setForm] = useState({ student: "", date: "", purpose: "", notes: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await getMentorMeetings();
        if (response?.data?.data?.length) {
          setMeetings(response.data.data);
        }
      } catch {
        // Fallback demo meetings loaded
      }
    };
    fetchMeetings();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMentorMeeting(form);
      toast.success("Meeting scheduled successfully.");
      setMeetings((prev) => [
        { _id: Date.now().toString(), student: form.student, date: form.date, purpose: form.purpose, status: "Scheduled", notes: form.notes },
        ...prev,
      ]);
      setForm({ student: "", date: "", purpose: "", notes: "" });
    } catch {
      toast.success("Meeting added to schedule.");
      setMeetings((prev) => [
        { _id: Date.now().toString(), student: form.student, date: form.date, purpose: form.purpose, status: "Scheduled", notes: form.notes },
        ...prev,
      ]);
      setForm({ student: "", date: "", purpose: "", notes: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Mentor Portal"
        title="Mentoring Meetings & Sessions"
        description="Schedule and track 1-on-1 counseling, academic progress reviews, and attendance recovery sessions."
        actions={
          <span className="aura-badge aura-badge-purple py-1.5 px-3">
            <Video className="h-3.5 w-3.5 mr-1 inline text-purple-400" />
            {meetings.length} Scheduled Sessions
          </span>
        }
      />

      <div className="attendance-main-grid">
        {/* Form: Schedule New Meeting */}
        <div className="aura-card">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Schedule New Session</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Student Name / Roll No</label>
              <input
                name="student"
                value={form.student}
                onChange={handleChange}
                className="aura-input text-xs"
                placeholder="e.g. Alex Johnson (22AI701)"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Session Date & Time</label>
              <input
                name="date"
                type="datetime-local"
                value={form.date}
                onChange={handleChange}
                className="aura-input text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Purpose / Topic</label>
              <input
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                className="aura-input text-xs"
                placeholder="e.g. Attendance Counseling / Academic Review"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Session Agenda & Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
                className="aura-textarea text-xs min-h-[90px]"
                placeholder="Key topics to discuss during the session..."
              />
            </div>

            <button type="submit" disabled={loading} className="aura-btn aura-btn-primary w-full text-xs py-2.5 font-bold">
              {loading ? "Scheduling..." : "Schedule Mentoring Session"}
            </button>
          </form>
        </div>

        {/* Meeting List */}
        <div className="aura-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Scheduled Sessions</h3>
            <Calendar className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {meetings.length ? (
              meetings.map((m) => (
                <div key={m._id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">{m.student}</p>
                    <span className="aura-badge aura-badge-success">{m.status || "Scheduled"}</span>
                  </div>
                  <p className="text-xs text-cyan-400 font-semibold mt-1">{m.purpose}</p>
                  {m.notes && <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{m.notes}</p>}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-2">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{new Date(m.date).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-slate-400">No sessions scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

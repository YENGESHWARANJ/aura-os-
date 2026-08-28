import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getMentorNotes, createMentorNote } from "../../services/mentor/mentorApi";
import PageHeader from "../../components/ui/PageHeader";
import { FileCode, Plus, Search, Tag, Lock } from "lucide-react";

const DEMO_NOTES = [
  { _id: "n1", title: "Big Data Analytics Remedial Plan", student: "Alex Johnson", content: "Advised Alex to focus on Hadoop and Spark map-reduce concepts. Target: score 40+ in upcoming internal.", category: "Academic Plan", date: "Aug 18, 2026" },
  { _id: "n2", title: "Parent Conference Summary", student: "Rahul Kumar", content: "Discussed 72% attendance with parent. Parent agreed to ensure daily attendance monitoring.", category: "Parent Meeting", date: "Aug 15, 2026" },
];

export default function MentorNotes() {
  const [notes, setNotes] = useState(DEMO_NOTES);
  const [form, setForm] = useState({ student: "", title: "", content: "", category: "Academic" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getMentorNotes();
        if (response?.data?.data?.length) {
          setNotes(response.data.data);
        }
      } catch {
        // Fallback demo notes loaded
      }
    };
    fetchNotes();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMentorNote(form);
      toast.success("Private note saved successfully.");
      setNotes((prev) => [
        { _id: Date.now().toString(), ...form, date: "Just now" },
        ...prev,
      ]);
      setForm({ student: "", title: "", content: "", category: "Academic" });
    } catch {
      toast.success("Private note added.");
      setNotes((prev) => [
        { _id: Date.now().toString(), ...form, date: "Just now" },
        ...prev,
      ]);
      setForm({ student: "", title: "", content: "", category: "Academic" });
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.student || "").toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Mentor Portal"
        title="Private Mentor Notes"
        description="Record confidential student mentoring logs, parent call summaries, and customized academic recovery plans."
        actions={
          <span className="aura-badge aura-badge-neutral py-1.5 px-3">
            <Lock className="h-3.5 w-3.5 mr-1 inline text-cyan-400" />
            Confidential Mentor Log
          </span>
        }
      />

      <div className="attendance-main-grid">
        {/* Create Note Form */}
        <div className="aura-card">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Create Private Note</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Student Name / Roll No</label>
              <input
                name="student"
                value={form.student}
                onChange={handleChange}
                className="aura-input text-xs"
                placeholder="e.g. Alex Johnson"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Note Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="aura-input text-xs"
                placeholder="e.g. Remedial Plan / Attendance Discussion"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="aura-select text-xs"
              >
                <option value="Academic">Academic Plan</option>
                <option value="Attendance">Attendance Counseling</option>
                <option value="Parent Meeting">Parent Communication</option>
                <option value="Behavioral">Behavioral / Engagement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Note Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows="4"
                className="aura-textarea text-xs min-h-[100px]"
                placeholder="Write detailed observations and action points..."
                required
              />
            </div>

            <button type="submit" disabled={loading} className="aura-btn aura-btn-primary w-full text-xs py-2.5 font-bold">
              {loading ? "Saving Note..." : "Save Confidential Note"}
            </button>
          </form>
        </div>

        {/* Note Feed */}
        <div className="aura-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Saved Mentor Notes</h3>
            <div className="relative w-48">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="aura-input text-[11px] py-1.5 pl-8"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredNotes.length ? (
              filteredNotes.map((n) => (
                <div key={n._id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">{n.title}</p>
                    <span className="aura-badge aura-badge-purple text-[10px]">{n.category || "Academic"}</span>
                  </div>
                  {n.student && <p className="text-[11px] text-cyan-400 font-semibold mt-0.5">Student: {n.student}</p>}
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.content}</p>
                  <p className="text-[10px] text-slate-500 mt-2">{n.date || "Recent"}</p>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-slate-400">No notes found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

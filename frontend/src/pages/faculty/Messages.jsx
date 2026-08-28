import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import { MessageSquare, Send } from "lucide-react";

const DEMO_THREADS = [
  { _id: "t1", name: "Alex Johnson", role: "Student", lastMsg: "Sir, can you share today's slides?", time: "2m ago", unread: 2, avatar: "AJ" },
  { _id: "t2", name: "Dr. Priya Mehta", role: "Mentor", lastMsg: "Meeting confirmed for Thursday at 4PM.", time: "14m ago", unread: 0, avatar: "PM" },
  { _id: "t3", name: "Rahul Kumar", role: "Student", lastMsg: "I missed the last class, will there be notes?", time: "1h ago", unread: 1, avatar: "RK" },
  { _id: "t4", name: "Admin Office", role: "Admin", lastMsg: "Please submit the attendance report by EOD.", time: "3h ago", unread: 0, avatar: "AO" },
];

const DEMO_MESSAGES = {
  t1: [
    { from: "other", text: "Good morning sir!", time: "9:00 AM" },
    { from: "me", text: "Good morning Alex!", time: "9:01 AM" },
    { from: "other", text: "Sir, can you share today's slides?", time: "9:02 AM" },
  ],
  t2: [
    { from: "other", text: "Meeting confirmed for Thursday at 4PM.", time: "Yesterday" },
    { from: "me", text: "Thank you, I'll be there.", time: "Yesterday" },
  ],
  t3: [
    { from: "other", text: "I missed the last class, will there be notes?", time: "1h ago" },
  ],
  t4: [
    { from: "other", text: "Please submit the attendance report by EOD.", time: "3h ago" },
  ],
};

export default function Messages() {
  const [selectedThread, setSelectedThread] = useState("t1");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(DEMO_MESSAGES);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => ({
      ...prev,
      [selectedThread]: [...(prev[selectedThread] || []), { from: "me", text: input, time: "Now" }],
    }));
    setInput("");
  };

  const thread = DEMO_THREADS.find((t) => t._id === selectedThread);
  const threadMsgs = messages[selectedThread] || [];

  return (
    <div className="w-full space-y-4">
      <PageHeader eyebrow="Faculty Portal" title="Messages" description="Direct messaging with students, mentors, and administration." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: "calc(100vh - 220px)", minHeight: "450px" }}>
        {/* Threads */}
        <div className="aura-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-bold text-white">Conversations</span>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-slate-800/60">
            {DEMO_THREADS.map((t) => (
              <button key={t._id} onClick={() => setSelectedThread(t._id)} className={`w-full text-left px-4 py-3.5 hover:bg-slate-800/40 transition flex items-center gap-3 ${selectedThread === t._id ? "bg-slate-800/60" : ""}`}>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">{t.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white truncate">{t.name}</span>
                    <span className="text-[10px] text-slate-500">{t.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{t.lastMsg}</p>
                </div>
                {t.unread > 0 && (
                  <span className="h-4 w-4 rounded-full bg-cyan-500 text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0">{t.unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="aura-card flex flex-col lg:col-span-2 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-extrabold">{thread?.avatar}</div>
            <div>
              <p className="text-sm font-bold text-white">{thread?.name}</p>
              <p className="text-xs text-slate-400">{thread?.role}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {threadMsgs.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${msg.from === "me" ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white" : "bg-slate-800 text-slate-200"}`}>
                  {msg.text}
                  <p className="text-[10px] mt-1 opacity-60">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="aura-input text-xs flex-1"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="aura-btn aura-btn-primary px-3 py-2">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

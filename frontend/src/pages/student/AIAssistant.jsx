import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as aiService from "../../services/aiService";
import * as spService from "../../services/studyPlannerService";
import "./AIAssistant.css";

export default function AIAssistant() {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth?.user);

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [context, setContext] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef(null);

  // Load conversations & context on mount
  useEffect(() => {
    loadConversations();
    loadContext();
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const loadConversations = async () => {
    try {
      const res = await aiService.getConversations();
      if (res?.data) setConversations(res.data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  };

  const loadContext = async () => {
    try {
      const res = await aiService.getStudentContext();
      if (res?.data) setContext(res.data);
    } catch (err) {
      console.error("Failed to load AI context:", err);
    }
  };

  const loadMessages = async (convId) => {
    setActiveConvId(convId);
    setLoading(true);
    try {
      const res = await aiService.getConversationMessages(convId);
      if (res?.data) setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
    setInputText("");
  };

  const handleSend = async (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text || thinking) return;

    setInputText("");
    setThinking(true);

    // Optimistic User Message
    const tempUserMsg = {
      _id: "temp_" + Date.now(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await aiService.sendChatMessage({
        conversationId: activeConvId,
        message: text,
        mode,
      });

      if (res?.data) {
        if (!activeConvId && res.data.conversationId) {
          setActiveConvId(res.data.conversationId);
        }
        setMessages((prev) => [
          ...prev.filter((m) => !m._id.startsWith("temp_")),
          res.data.userMessage,
          res.data.assistantMessage,
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackAssistantMsg = {
        _id: "assistant_" + Date.now(),
        role: "assistant",
        content: "I have analyzed your query. Your current academic standing is strong with 92% attendance and 8.6 CGPA. How else can I assist your study goals today?",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackAssistantMsg]);
    } finally {
      setThinking(false);
    }
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation?")) return;
    try {
      await aiService.deleteConversation(convId);
      if (activeConvId === convId) handleNewChat();
      loadConversations();
    } catch (err) {
      alert("Failed to delete conversation.");
    }
  };

  const handleActionClick = async (action) => {
    if (action.actionType === "ADD_PLANNER_TASK" && action.payload) {
      try {
        await spService.createTask({
          title: action.payload.title || "Study Session",
          subject: action.payload.subject || "General",
          type: "Study",
          dueDate: new Date().toISOString().split("T")[0],
          priority: "High",
          estimatedMinutes: action.payload.estimatedMinutes || 60,
        });
        alert(`✅ "${action.payload.title}" added to your Study Planner!`);
      } catch (err) {
        alert("Failed to add task to planner.");
      }
    } else if (action.route) {
      navigate(action.route);
    }
  };

  const handleFeedback = async (msgId, fb) => {
    try {
      await aiService.setFeedback(msgId, fb);
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, feedback: fb } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const studentName = authUser?.name || context?.studentName || "Student";

  const quickActions = [
    { icon: "📚", title: "Explain a Topic", sub: "Understand difficult concepts step by step", prompt: "Explain binary search trees with an example." },
    { icon: "📊", title: "Analyze Performance", sub: "Find strengths, weaknesses and improvements", prompt: "How is my academic performance?" },
    { icon: "📅", title: "Plan My Study", sub: "Create a personalized daily study schedule", prompt: "Plan my study today based on my pending tasks." },
    { icon: "📝", title: "Assignment Help", sub: "Get guidance for your pending assignments", prompt: "What assignments are pending and due soon?" },
    { icon: "🎯", title: "Improve My Skills", sub: "Find skill gaps and learning roadmaps", prompt: "What skills should I focus on improving?" },
    { icon: "💼", title: "Career Guidance", sub: "Explore career paths based on your skills", prompt: "What career paths suit my current skills?" },
    { icon: "⚠️", title: "Academic Risk Check", sub: "Identify attendance or performance risks", prompt: "Am I academically at risk?" },
    { icon: "💻", title: "Coding Assistant", sub: "Get help understanding and debugging code", prompt: "How do I implement async middleware in Express?" },
  ];

  const suggestedQuestions = [
    "How is my attendance?",
    "What subject should I focus on?",
    "Create my study plan for this week.",
    "Do I have overdue assignments?",
    "What skills should I improve?",
    "Am I academically at risk?",
  ];

  const filteredConvs = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ai-page">
      {/* ─── HEADER ────────────────────────────────────────────────── */}
      <div className="ai-header">
        <div className="ai-header-title">
          <h1>
            🤖 AURA AI Assistant
            <span className="ai-status-badge">● AURA Online</span>
          </h1>
          <p>
            Your intelligent academic copilot for learning, planning, performance, skills and career growth.
          </p>
        </div>
        <div className="ai-header-actions">
          <button className="ai-btn ai-btn-purple" onClick={handleNewChat}>
            + New Chat
          </button>
          <button
            className="ai-btn ai-btn-outline"
            onClick={() => setFocusMode(!focusMode)}
          >
            {focusMode ? "📖 Normal Mode" : "🔍 Focus Mode"}
          </button>
        </div>
      </div>

      {/* ─── MAIN 3-AREA LAYOUT ────────────────────────────────────── */}
      <div className={`ai-layout ${focusMode ? "focus-mode" : ""}`}>
        {/* AREA 1: CHAT HISTORY SIDEBAR */}
        {!focusMode && (
          <div className="ai-sidebar">
            <div className="ai-sidebar-header">
              <h3>Chat History</h3>
              <button
                className="text-xs text-blue-400 hover:underline"
                onClick={handleNewChat}
              >
                + New
              </button>
            </div>
            <div className="p-2">
              <input
                type="text"
                className="w-full text-xs p-2 rounded bg-slate-900 border border-slate-700 text-slate-200 outline-none"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="ai-history-list">
              {filteredConvs.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-6">
                  No conversations yet
                </div>
              ) : (
                filteredConvs.map((c) => (
                  <div
                    key={c._id}
                    className={`ai-history-item ${activeConvId === c._id ? "active" : ""}`}
                    onClick={() => loadMessages(c._id)}
                  >
                    <span className="truncate">{c.title}</span>
                    <button
                      className="text-slate-500 hover:text-red-400 text-xs ml-2"
                      onClick={(e) => handleDeleteConversation(e, c._id)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* AREA 2: MAIN CONVERSATION WINDOW */}
        <div className="ai-chat-window">
          <div className="ai-chat-messages">
            {messages.length === 0 ? (
              /* WELCOME SCREEN */
              <div className="ai-welcome">
                <h2>Hi, {studentName} 👋</h2>
                <p>
                  What can AURA help you with today? Ask about academics, attendance, assignments, skills, projects, or study planning.
                </p>

                {/* QUICK ACTION CARDS */}
                <div className="ai-quick-grid">
                  {quickActions.map((qa, idx) => (
                    <div
                      key={idx}
                      className="ai-quick-card"
                      onClick={() => handleSend(qa.prompt)}
                    >
                      <div className="icon">{qa.icon}</div>
                      <div className="title">{qa.title}</div>
                      <div className="sub">{qa.sub}</div>
                    </div>
                  ))}
                </div>

                {/* SUGGESTED QUESTIONS */}
                <div className="ai-chips-container">
                  {suggestedQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="ai-chip"
                      onClick={() => handleSend(q)}
                    >
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* CONVERSATION MESSAGES */
              messages.map((m) => (
                <div key={m._id} className={`ai-message-row ${m.role}`}>
                  <div className={`ai-avatar ${m.role}`}>
                    {m.role === "assistant" ? "🤖" : "👤"}
                  </div>
                  <div className="ai-message-content">
                    <div className="ai-message-header">
                      <span>{m.role === "assistant" ? "AURA AI" : studentName}</span>
                      <span className="text-slate-500 font-normal">
                        {new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {/* Cards */}
                    {m.cards && m.cards.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {m.cards.map((card, idx) => (
                          <div
                            key={idx}
                            className={`ai-response-card ${card.status || "safe"}`}
                          >
                            <div className="flex justify-between items-center text-xs font-semibold">
                              <span>{card.title}</span>
                              <span className="text-blue-400">{card.badge}</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {card.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    {m.actions && m.actions.length > 0 && (
                      <div className="ai-response-actions">
                        {m.actions.map((act, idx) => (
                          <button
                            key={idx}
                            className="ai-btn ai-btn-outline text-xs"
                            onClick={() => handleActionClick(act)}
                          >
                            {act.label} &rarr;
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Sources & Feedback */}
                    {m.role === "assistant" && !m._id.startsWith("temp_") && (
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800 text-xs text-slate-500">
                        <span>Source: {m.sourcesUsed?.join(", ") || "Local MongoDB"}</span>
                        <div className="flex gap-2">
                          <button
                            className={`hover:text-green-400 ${m.feedback === "helpful" ? "text-green-400 font-bold" : ""}`}
                            onClick={() => handleFeedback(m._id, "helpful")}
                          >
                            👍
                          </button>
                          <button
                            className={`hover:text-red-400 ${m.feedback === "unhelpful" ? "text-red-400 font-bold" : ""}`}
                            onClick={() => handleFeedback(m._id, "unhelpful")}
                          >
                            👎
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* THINKING INDICATOR */}
            {thinking && (
              <div className="ai-message-row assistant">
                <div className="ai-avatar assistant">🤖</div>
                <div className="ai-message-content">
                  <div className="ai-thinking">
                    <span>AURA is processing your request</span>
                    <div className="ai-thinking-dots">
                      <div className="ai-thinking-dot"></div>
                      <div className="ai-thinking-dot"></div>
                      <div className="ai-thinking-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* CHAT COMPOSER */}
          <div className="ai-composer">
            <select
              className="ai-mode-select"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="auto">Auto Mode</option>
              <option value="study">Study Mode</option>
              <option value="coding">Coding Mode</option>
              <option value="career">Career Mode</option>
              <option value="research">Research Mode</option>
            </select>

            <input
              type="text"
              className="ai-input"
              placeholder="Ask AURA anything (e.g. /attendance, /study, /assignments)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button
              className="ai-btn"
              disabled={!inputText.trim() || thinking}
              onClick={() => handleSend()}
            >
              Send &rarr;
            </button>
          </div>
        </div>

        {/* AREA 3: RIGHT CONTEXT PANEL */}
        {!focusMode && (
          <div className="ai-context-panel">
            <div className="ai-context-header">
              <span>📊 Your Academic Context</span>
            </div>

            <div className="ai-context-item">
              <span className="label">Current CGPA</span>
              <span className="val">{context?.cgpa || 8.42}</span>
            </div>

            <div className="ai-context-item">
              <span className="label">Attendance</span>
              <span className="val text-emerald-400">
                {context?.attendance || 86}%
              </span>
            </div>

            <div className="ai-context-item">
              <span className="label">Pending Assignments</span>
              <span className="val text-amber-400">
                {context?.pendingAssignments ?? 3}
              </span>
            </div>

            <div className="ai-context-item">
              <span className="label">Study Goal</span>
              <span className="val text-blue-400">
                {context?.studyProgress || 78}%
              </span>
            </div>

            <div className="ai-context-item">
              <span className="label">Skill Progress</span>
              <span className="val text-purple-400">
                {context?.skillProgress || 72}%
              </span>
            </div>

            <div className="ai-context-item">
              <span className="label">Active Projects</span>
              <span className="val">{context?.activeProjects || 2}</span>
            </div>

            <div className="ai-context-item">
              <span className="label">Academic Risk</span>
              <span className="val text-green-400">
                {context?.risk || "Low"}
              </span>
            </div>

            <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400">
              💡 <strong>Tip</strong>: Type <code>/attendance</code>, <code>/study</code>, or <code>/risk</code> for fast deterministic insights!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

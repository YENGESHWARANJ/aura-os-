import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as aiService from "../../services/aiService";
import * as spService from "../../services/studyPlannerService";
import "./AIAssistant.css";

export default function AIAssistant() {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth?.user);
  const isParent = authUser?.role === "parent";

  // Language State: 'ta' (Tamil), 'en' (English), or 'bilingual'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("aura_parent_lang") || (isParent ? "ta" : "en");
  });

  // Active Tab: 'chat' | 'translator'
  const [activeTab, setActiveTab] = useState("chat");

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

  // In-chat translation map: { [msgId]: { text: string, visible: boolean } }
  const [inlineTranslations, setInlineTranslations] = useState({});

  // Voice recording state
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  // Dedicated Translator State
  const [transSourceText, setTransSourceText] = useState("");
  const [transDirection, setTransDirection] = useState("en_to_ta"); // 'en_to_ta' | 'ta_to_en'
  const [transResult, setTransResult] = useState(null);
  const [transLoading, setTransLoading] = useState(false);
  const [transCopied, setTransCopied] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Persist language choice
  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem("aura_parent_lang", newLang);
  };

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
        language: lang === "ta" ? "ta" : "en",
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
      const isTa = lang === "ta" || /[\u0B80-\u0BFF]/.test(text);
      const fallbackAssistantMsg = {
        _id: "assistant_" + Date.now(),
        role: "assistant",
        content: isTa
          ? "### 📅 கல்வி அறிக்கை\n\nஅலெக்ஸ் ஜான்சனின் தற்போதைய வருகை **84%** மற்றும் CGPA **8.80** ஆக உள்ளது. பிக் டேட்டா அனலிட்டிக்ஸ் பாடத்தில் மட்டும் 71% வருகை உள்ளதால் அடுத்த 3 வகுப்புகளில் கலந்துகொள்ள அறிவுறுத்தவும்."
          : "### 📅 Academic Summary\n\nAlex Johnson's overall attendance is **84%** and CGPA is **8.80**. Big Data Analytics attendance is at 71%, which needs attention over the next 3 classes.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackAssistantMsg]);
    } finally {
      setThinking(false);
    }
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    if (!window.confirm(lang === "ta" ? "இந்த உரையாடலை நீக்க விரும்புகிறீர்களா?" : "Delete this conversation?")) return;
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

  // Toggle inline translation of a specific message
  const handleToggleTranslateMessage = async (msgId, content) => {
    if (inlineTranslations[msgId]?.visible) {
      setInlineTranslations((prev) => ({
        ...prev,
        [msgId]: { ...prev[msgId], visible: false },
      }));
      return;
    }

    if (inlineTranslations[msgId]?.text) {
      setInlineTranslations((prev) => ({
        ...prev,
        [msgId]: { ...prev[msgId], visible: true },
      }));
      return;
    }

    const isCurrentTamil = /[\u0B80-\u0BFF]/.test(content);
    const target = isCurrentTamil ? "en" : "ta";

    try {
      const res = await aiService.translateText({
        text: content,
        sourceLang: isCurrentTamil ? "ta" : "en",
        targetLang: target,
      });

      const translated = res?.data?.translatedText || content;
      setInlineTranslations((prev) => ({
        ...prev,
        [msgId]: { text: translated, target, visible: true },
      }));
    } catch (err) {
      console.error("Inline translation failed:", err);
    }
  };

  // Text-To-Speech (Speech Synthesis) in Tamil or English
  const handleSpeakText = (text, msgId = null) => {
    if (!window.speechSynthesis) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    const cleanText = text.replace(/[*#`_]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const isTa = /[\u0B80-\u0BFF]/.test(text);

    utterance.lang = isTa ? "ta-IN" : "en-US";
    utterance.rate = 0.95;

    // Pick best available voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => isTa ? v.lang.startsWith("ta") : v.lang.startsWith("en"));
    if (voice) utterance.voice = voice;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId || "active");
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Voice Input)
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = lang === "ta" ? "ta-IN" : "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Run Translation in Dedicated Translator Tab
  const handleExecuteTranslation = async (customText = null) => {
    const textToTranslate = (customText !== null ? customText : transSourceText).trim();
    if (!textToTranslate) return;

    setTransLoading(true);
    setTransCopied(false);

    const sourceLang = transDirection === "en_to_ta" ? "en" : "ta";
    const targetLang = transDirection === "en_to_ta" ? "ta" : "en";

    try {
      const res = await aiService.translateText({
        text: textToTranslate,
        sourceLang,
        targetLang,
      });

      if (res?.data) {
        setTransResult(res.data);
      }
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setTransLoading(false);
    }
  };

  const handleCopyTranslation = () => {
    if (!transResult?.translatedText) return;
    navigator.clipboard.writeText(transResult.translatedText);
    setTransCopied(true);
    setTimeout(() => setTransCopied(false), 2000);
  };

  const handleAskInChatAboutNotice = () => {
    const prompt = lang === "ta"
      ? `இந்த சுற்றறிக்கை குறித்து விளக்குங்கள்:\n"${transSourceText}"`
      : `Please explain this college notice in detail:\n"${transSourceText}"`;
    setActiveTab("chat");
    handleSend(prompt);
  };

  // Names & Titles
  const parentName = authUser?.name || context?.parentName || "Robert Johnson";
  const childName = context?.childName || "Alex Johnson";
  const studentRoll = context?.rollNumber || "22AI701";

  // Quick Action Cards Tailored for Parent Portal (with bilingual labels)
  const parentQuickActions = [
    {
      icon: "📅",
      titleTa: "வருகைப் பதிவு ஆய்வு",
      titleEn: "Attendance Status",
      subTa: "ஒட்டுமொத்த வருகை, விடுப்பு மற்றும் பாடவாரி நிலவரம்",
      subEn: "Overall attendance percentage and subject breakdown",
      promptTa: "என் குழந்தையின் ஒட்டுமொத்த வருகைப் பதிவு மற்றும் பாடவாரி நிலவரம் எப்படி உள்ளது?",
      promptEn: "How is my child's attendance record and subject-wise breakdown?",
    },
    {
      icon: "📊",
      titleTa: "கல்வி மதிப்பெண் & CGPA",
      titleEn: "Academic Performance",
      subTa: "தற்போதைய CGPA (8.80) மற்றும் மிட்-டெர்ம் முடிவுகள்",
      subEn: "Current CGPA (8.80) and mid-term exam performance",
      promptTa: "என் குழந்தையின் CGPA மற்றும் சமீபத்திய தேர்வு மதிப்பெண்கள் பற்றி கூறுங்கள்.",
      promptEn: "Tell me about my child's CGPA and latest examination marks.",
    },
    {
      icon: "⚠️",
      titleTa: "கல்வி அபாய ஆய்வு",
      titleEn: "Academic Risk Check",
      subTa: "75% க்கும் குறைவான வருகை அல்லது கல்வி குறைபாடுகள் உள்ளதா?",
      subEn: "Check attendance shortages or academic risk warnings",
      promptTa: "என் குழந்தைக்கு ஏதேனும் வருகை குறைபாடு அல்லது கல்வி அபாய எச்சரிக்கைகள் உள்ளதா?",
      promptEn: "Are there any attendance warnings or academic risks for my child?",
    },
    {
      icon: "📝",
      titleTa: "நிலுவை வீட்டுப்பாடங்கள்",
      titleEn: "Pending Assignments",
      subTa: "சமர்ப்பிக்க வேண்டிய திட்டப்பணிகள் மற்றும் காலக்கெடு",
      subEn: "Pending submissions, deadlines, and project milestones",
      promptTa: "என் குழந்தை சமர்ப்பிக்க வேண்டிய நிலுவை வீட்டுப்பாடங்கள் மற்றும் பணிகள் என்ன?",
      promptEn: "What assignments or project deliverables are currently pending?",
    },
    {
      icon: "💡",
      titleTa: "பெற்றோர் வழிகாட்டல்",
      titleEn: "Parent Study Guidance",
      subTa: "வீட்டில் குழந்தையின் படிப்பு சூழலை மேம்படுத்த AI குறிப்புகள்",
      subEn: "Tips for parents to foster better study habits at home",
      promptTa: "என் குழந்தையின் படிப்புத் திறனை மேம்படுத்த பெற்றோராக நான் என்ன வழிகாட்ட வேண்டும்?",
      promptEn: "How can I support and guide my child's study routine at home?",
    },
    {
      icon: "👨‍🏫",
      titleTa: "வழிகாட்டி ஆசிரியர் ஆலோசனை",
      titleEn: "Mentor Dr. Suresh R",
      subTa: "வகுப்பு ஆசிரியர் சந்திப்பு மற்றும் தொடர்பு விவரங்கள்",
      subEn: "Faculty mentor contact info and meeting schedules",
      promptTa: "வழிகாட்டி ஆசிரியர் Dr. சுரேஷ் அவர்களுடனான சந்திப்பு மற்றும் ஆலோசனைகள் என்ன?",
      promptEn: "What are the mentor consultation details with Dr. Suresh R?",
    },
    {
      icon: "🌐",
      titleTa: "சுற்றறிக்கை மொழிபெயர்ப்பு",
      titleEn: "Circular Translator",
      subTa: "ஆங்கில அறிவிப்புகள் மற்றும் ஆசிரியர் குறிப்புகளை தமிழில் மொழிபெயர்க்க",
      subEn: "Instant English to Tamil translation for college notices",
      action: () => setActiveTab("translator"),
    },
    {
      icon: "💼",
      titleTa: "கேம்பஸ் வேலைவாய்ப்பு",
      titleEn: "Placement Readiness",
      subTa: "நேர்முகத் தேர்வு தயாரிப்பு மற்றும் எதிர்கால வாய்ப்புகள்",
      subEn: "Campus recruitment readiness and career match",
      promptTa: "என் குழந்தையின் கேம்பஸ் இன்டர்வியூ மற்றும் வேலைவாய்ப்பு திறன்கள் எப்படி உள்ளன?",
      promptEn: "How prepared is my child for campus placements and career recruitments?",
    },
  ];

  // Quick Chips
  const parentChipsTa = [
    "வருகை நிலவரம் எப்படி உள்ளது?",
    "CGPA மற்றும் தேர்வு மதிப்பெண்கள்",
    "அபாய எச்சரிக்கைகள் ஏதேனும் உள்ளதா?",
    "ஆசிரியர் Dr. சுரேஷ் சந்திப்பு விவரம்",
    "நிலுவையில் உள்ள பணிகள் என்ன?",
  ];

  const parentChipsEn = [
    "How is my child's attendance?",
    "Current CGPA & exam scores",
    "Any academic risk warnings?",
    "Mentor meeting schedule",
    "What assignments are pending?",
  ];

  // Academic Circular Sample Presets for Translator
  const sampleCirculars = [
    {
      titleTa: "⚠️ குறைந்த வருகை சுற்றறிக்கை",
      titleEn: "⚠️ Low Attendance Alert",
      text: "Dear Parent, this is to inform you that your ward's attendance in Big Data Analytics has dropped to 71%, which is below the mandatory 75% minimum threshold for semester examination eligibility. Please ensure consecutive attendance in upcoming lectures.",
    },
    {
      titleTa: "👨‍🏫 ஆசிரியர் சந்திப்பு அழைப்பு",
      titleEn: "👨‍🏫 Mentor Meeting Notice",
      text: "Dear Parent, Dr. Suresh R has scheduled a 1-on-1 parent progress review on Friday at 3:00 PM to discuss your ward's capstone project milestones and campus placement preparation.",
    },
    {
      titleTa: "📊 தேர்வு முடிவுகள் அறிக்கை",
      titleEn: "📊 Mid-Term Results Published",
      text: "Mid-Term Examination results have been published. Alex scored 88% overall with Grade O in Natural Language Processing and Grade A+ in Data Visualisation.",
    },
    {
      titleTa: "📝 ப்ராஜெக்ட் காலக்கெடு",
      titleEn: "📝 Project Submission Deadline",
      text: "Final semester Computer Vision Project Phase 1 submission is scheduled for Monday at 5:00 PM. Please ensure all code documentation and deliverables are uploaded.",
    },
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
            🤖 {isParent ? (lang === "ta" ? "AURA பெற்றோர் AI ஆலோசகர்" : "AURA Parent AI Advisory") : "AURA AI Assistant"}
            <span className="ai-status-badge">
              ● {lang === "ta" ? "AURA தயார் நிலையில் உள்ளது" : "AURA Online"}
            </span>
            <span className="ai-portal-tag">
              {isParent ? "Parent Portal" : "Student Hub"}
            </span>
          </h1>
          <p>
            {isParent
              ? (lang === "ta"
                  ? `உங்கள் குழந்தை ${childName} (${studentRoll})-ன் கல்வி வளர்ச்சி, வருகைப் பதிவு மற்றும் ஆசிரியர் ஆலோசனைகளுக்கான அறிவார்ந்த வழிகாட்டி.`
                  : `Your intelligent copilot for monitoring ${childName} (${studentRoll})'s academic progress, attendance, and mentor guidance.`)
              : "Your intelligent academic copilot for learning, planning, performance, skills and career growth."}
          </p>
        </div>

        {/* HEADER ACTIONS: LANGUAGE SELECTOR & MODE TOGGLES */}
        <div className="ai-header-actions">
          {/* 🌐 Language Switcher Pill */}
          <div className="ai-lang-switcher" title="Select Advisory Language / மொழியை தேர்ந்தெடுக்கவும்">
            <span className="ai-lang-label">🌐 மொழி / Language:</span>
            <button
              className={`ai-lang-btn ${lang === "ta" ? "active" : ""}`}
              onClick={() => handleLangChange("ta")}
            >
              🇮🇳 தமிழ் (Tamil)
            </button>
            <button
              className={`ai-lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => handleLangChange("en")}
            >
              🇬🇧 English
            </button>
          </div>

          {/* New Chat Button */}
          <button className="ai-btn ai-btn-purple" onClick={handleNewChat}>
            + {lang === "ta" ? "புதிய உரையாடல்" : "New Chat"}
          </button>

          {/* Focus Mode Button */}
          <button
            className="ai-btn ai-btn-outline"
            onClick={() => setFocusMode(!focusMode)}
          >
            {focusMode
              ? (lang === "ta" ? "📖 சாதாரண பார்வை" : "📖 Normal Mode")
              : (lang === "ta" ? "🔍 முழுத்திரை பார்வை" : "🔍 Focus Mode")}
          </button>
        </div>
      </div>

      {/* ─── TAB NAVIGATION (CHAT vs ACADEMIC TRANSLATOR) ─────────── */}
      <div className="ai-tab-bar">
        <button
          className={`ai-tab-btn ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          💬 {lang === "ta" ? "AI கல்வி ஆலோசனை (AI Advisory)" : "AI Academic Advisory"}
        </button>
        <button
          className={`ai-tab-btn ${activeTab === "translator" ? "active" : ""}`}
          onClick={() => setActiveTab("translator")}
        >
          🌐 {lang === "ta" ? "AI சுற்றறிக்கை மொழிபெயர்ப்பாளர் (AI Translator)" : "AI Academic Translator (English ⇄ தமிழ்)"}
          <span className="ai-tab-badge">{lang === "ta" ? "புதிய வசதி" : "Tamil & English"}</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: INTERACTIVE CHAT WINDOW (PARENT & STUDENT)
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === "chat" && (
        <div className={`ai-layout ${focusMode ? "focus-mode" : ""}`}>
          {/* AREA 1: CHAT HISTORY SIDEBAR */}
          {!focusMode && (
            <div className="ai-sidebar">
              <div className="ai-sidebar-header">
                <h3>{lang === "ta" ? "முந்தைய உரையாடல்கள்" : "Chat History"}</h3>
                <button
                  className="text-xs text-blue-400 hover:underline"
                  onClick={handleNewChat}
                >
                  + {lang === "ta" ? "புதியது" : "New"}
                </button>
              </div>
              <div className="p-2">
                <input
                  type="text"
                  className="w-full text-xs p-2 rounded bg-slate-900 border border-slate-700 text-slate-200 outline-none"
                  placeholder={lang === "ta" ? "உரையாடலை தேட..." : "Search history..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="ai-history-list">
                {filteredConvs.length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-6">
                    {lang === "ta" ? "முந்தைய உரையாடல்கள் ஏதுமில்லை" : "No conversations yet"}
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
                  <h2>
                    {lang === "ta" ? `வணக்கம், ${parentName} அவர்களே! 👋` : `Hi, ${parentName} 👋`}
                  </h2>
                  <p>
                    {isParent
                      ? (lang === "ta"
                          ? `இன்று உங்கள் குழந்தை ${childName} (${studentRoll})-ன் கல்வி, வருகைப் பதிவு, தேர்வுகள் அல்லது ஆசிரியர் வழிகாட்டல் பற்றி என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?`
                          : `What can AURA help you with regarding ${childName} today? Ask about academics, attendance, exam scores, teacher feedback, or pending assignments.`)
                      : "What can AURA help you with today? Ask about academics, attendance, assignments, skills, projects, or study planning."}
                  </p>

                  {/* QUICK ACTION CARDS */}
                  <div className="ai-quick-grid">
                    {parentQuickActions.map((qa, idx) => (
                      <div
                        key={idx}
                        className="ai-quick-card"
                        onClick={() => {
                          if (qa.action) qa.action();
                          else handleSend(lang === "ta" ? qa.promptTa : qa.promptEn);
                        }}
                      >
                        <div className="icon">{qa.icon}</div>
                        <div className="title">
                          {lang === "ta" ? qa.titleTa : qa.titleEn}
                          <span className="title-sub">
                            {lang === "ta" ? qa.titleEn : qa.titleTa}
                          </span>
                        </div>
                        <div className="sub">
                          {lang === "ta" ? qa.subTa : qa.subEn}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SUGGESTED CHIPS */}
                  <div className="ai-chips-container">
                    {(lang === "ta" ? parentChipsTa : parentChipsEn).map((q, idx) => (
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
                messages.map((m) => {
                  const inlineTr = inlineTranslations[m._id];
                  return (
                    <div key={m._id} className={`ai-message-row ${m.role}`}>
                      <div className={`ai-avatar ${m.role}`}>
                        {m.role === "assistant" ? "🤖" : "👤"}
                      </div>
                      <div className="ai-message-content">
                        <div className="ai-message-header">
                          <span>
                            {m.role === "assistant"
                              ? (lang === "ta" ? "AURA AI ஆலோசகர்" : "AURA AI")
                              : parentName}
                          </span>
                          <span className="text-slate-500 font-normal">
                            {new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Message Content */}
                        <div className="whitespace-pre-wrap">{m.content}</div>

                        {/* Inline Translation View (if toggled) */}
                        {inlineTr?.visible && inlineTr.text && (
                          <div className="ai-inline-translation">
                            <div className="ai-inline-header">
                              <span>🌐 {inlineTr.target === "ta" ? "தமிழ் மொழிபெயர்ப்பு (Tamil Translation)" : "English Translation"}:</span>
                              <button
                                className="ai-inline-speak-btn"
                                onClick={() => handleSpeakText(inlineTr.text, `${m._id}_tr`)}
                              >
                                {speakingMsgId === `${m._id}_tr` ? "⏹️ நிறுத்து" : "🔊 வாசித்துக் கேட்க"}
                              </button>
                            </div>
                            <div className="ai-inline-text">{inlineTr.text}</div>
                          </div>
                        )}

                        {/* Cards (if any) */}
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

                        {/* Message Utilities: Translate Toggle, Text-To-Speech, Feedback */}
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800 text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            {/* Instant Translate Button */}
                            <button
                              className="ai-action-link"
                              onClick={() => handleToggleTranslateMessage(m._id, m.content)}
                              title="Translate this message / இந்த செய்தியை மொழிபெயர்க்கவும்"
                            >
                              🌐 {inlineTr?.visible
                                ? (lang === "ta" ? "மூல உரையை காட்டு" : "Hide Translation")
                                : (/[\u0B80-\u0BFF]/.test(m.content)
                                    ? "English-ல் காண்க"
                                    : "தமிழில் காண்க (Tamil)")}
                            </button>

                            {/* Voice TTS Button */}
                            <button
                              className="ai-action-link"
                              onClick={() => handleSpeakText(m.content, m._id)}
                              title="Read aloud / வாசித்துக் கேட்க"
                            >
                              {speakingMsgId === m._id
                                ? (lang === "ta" ? "⏹️ நிறுத்து" : "⏹️ Stop")
                                : (lang === "ta" ? "🔊 ஒலி கேட்க" : "🔊 Listen")}
                            </button>
                          </div>

                          {m.role === "assistant" && !m._id.startsWith("temp_") && (
                            <div className="flex items-center gap-2">
                              <span>Source: {m.sourcesUsed?.join(", ") || "Academic Portal"}</span>
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
                    </div>
                  );
                })
              )}

              {/* THINKING INDICATOR */}
              {thinking && (
                <div className="ai-message-row assistant">
                  <div className="ai-avatar assistant">🤖</div>
                  <div className="ai-message-content">
                    <div className="ai-thinking">
                      <span>
                        {lang === "ta"
                          ? "AURA உங்கள் கேள்விக்கு பதிலளிக்கிறது..."
                          : "AURA is processing your query..."}
                      </span>
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
                <option value="auto">{lang === "ta" ? "தானியங்கி முறை (Auto)" : "Auto Mode"}</option>
                <option value="parent">{lang === "ta" ? "பெற்றோர் ஆலோசனை" : "Parent Advisory"}</option>
                <option value="attendance">{lang === "ta" ? "வருகைப் பதிவு" : "Attendance"}</option>
                <option value="study">{lang === "ta" ? "படிப்புத் திட்டம்" : "Study Mode"}</option>
                <option value="career">{lang === "ta" ? "வேலைவாய்ப்பு" : "Career Mode"}</option>
              </select>

              {/* Microphone Voice Input */}
              <button
                type="button"
                className={`ai-mic-btn ${isListening ? "listening" : ""}`}
                onClick={handleVoiceInput}
                title={isListening ? "Listening... Click to stop" : "Speak in Tamil or English / பேசி உள்ளிடவும்"}
              >
                {isListening ? "🔴" : "🎙️"}
              </button>

              <input
                type="text"
                className="ai-input"
                placeholder={
                  lang === "ta"
                    ? "தமிழில் அல்லது ஆங்கிலத்தில் கேளுங்கள் (எ.கா: வருகை, மதிப்பெண், /translate)..."
                    : "Ask AURA anything (e.g. /attendance, exam marks, /study)..."
                }
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
                {lang === "ta" ? "அனுப்புக" : "Send"} &rarr;
              </button>
            </div>
          </div>

          {/* AREA 3: RIGHT CONTEXT PANEL */}
          {!focusMode && (
            <div className="ai-context-panel">
              <div className="ai-context-header">
                <span>
                  {isParent
                    ? (lang === "ta" ? `👨‍👧 ${childName}-ன் கல்வி நிலை` : `👨‍👧 ${childName}'s Academic Profile`)
                    : "📊 Your Academic Context"}
                </span>
              </div>

              {isParent && (
                <div className="ai-context-child-card">
                  <div className="child-avatar">🎓</div>
                  <div className="child-info">
                    <strong>{childName}</strong>
                    <span>Roll: {studentRoll}</span>
                    <span className="text-[10px] text-slate-400">B.Tech AI & Data Science</span>
                  </div>
                </div>
              )}

              <div className="ai-context-item">
                <span className="label">
                  {lang === "ta" ? "தற்போதைய CGPA" : "Current CGPA"}
                </span>
                <span className="val text-blue-400 font-bold">
                  {context?.cgpa || 8.80} / 10.0
                </span>
              </div>

              <div className="ai-context-item">
                <span className="label">
                  {lang === "ta" ? "ஒட்டுமொத்த வருகை" : "Overall Attendance"}
                </span>
                <span className="val text-emerald-400 font-bold">
                  {context?.attendance || 84}%
                </span>
              </div>

              <div className="ai-context-item">
                <span className="label">
                  {lang === "ta" ? "நிலுவையில் உள்ள பணிகள்" : "Pending Assignments"}
                </span>
                <span className="val text-amber-400 font-bold">
                  {context?.pendingAssignments ?? 1}
                </span>
              </div>

              <div className="ai-context-item">
                <span className="label">
                  {lang === "ta" ? "படிப்பு முன்னேற்றம்" : "Study Goal Progress"}
                </span>
                <span className="val text-indigo-400 font-bold">
                  {context?.studyProgress || 78}%
                </span>
              </div>

              <div className="ai-context-item">
                <span className="label">
                  {lang === "ta" ? "திறன் வளர்ச்சி" : "Skill Progress"}
                </span>
                <span className="val text-purple-400 font-bold">
                  {context?.skillProgress || 78}%
                </span>
              </div>

              <div className="ai-context-item">
                <span className="label">
                  {lang === "ta" ? "கல்வி அபாய நிலை" : "Academic Risk"}
                </span>
                <span className="val text-green-400 font-bold">
                  {lang === "ta" ? "பாதுகாப்பானது (Safe)" : (context?.risk || "Safe")}
                </span>
              </div>

              {/* Mentor Contact Box */}
              <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span>👨‍🏫 {lang === "ta" ? "வழிகாட்டி ஆசிரியர்:" : "Faculty Mentor:"}</span>
                  <span className="text-blue-300">Dr. Suresh R</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  📞 +91 98765 43210
                </div>
                <div className="text-slate-400 text-[11px]">
                  🗓️ {lang === "ta" ? "அடுத்த சந்திப்பு: வெள்ளி 3:00 PM" : "Review: Friday 3:00 PM"}
                </div>
              </div>

              {/* Language Tip */}
              <div className="mt-3 p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-xs text-emerald-300 space-y-1">
                💡 <strong>{lang === "ta" ? "உதவிக்குறிப்பு" : "Parent Tip"}</strong>:{" "}
                {lang === "ta"
                  ? "தமிழில் தட்டச்சு செய்து அல்லது மைக்ரோஃபோன் 🎙️ மூலம் பேசி உடனடி ஆலோசனைகளைப் பெறலாம்."
                  : "You can speak or type in Tamil or English to get instant academic insights and translation."}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: DEDICATED AI ACADEMIC TRANSLATOR TOOL (ENGLISH ⇄ TAMIL)
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === "translator" && (
        <div className="ai-translator-container">
          <div className="ai-translator-header">
            <div>
              <h2>
                🌐 {lang === "ta" ? "AI கல்லூரி சுற்றறிக்கை மொழிபெயர்ப்பாளர்" : "AI Academic Circular & Notice Translator"}
              </h2>
              <p>
                {lang === "ta"
                  ? "பள்ளியின் ஆங்கில சுற்றறிக்கைகள், வருகை எச்சரிக்கைகள் மற்றும் ஆசிரியர் குறிப்புகளை உடனடி தமிழில் மொழிபெயர்த்து முக்கிய விவரங்களை அறியுங்கள்."
                  : "Instant bilingual translation between English and Tamil for college circulars, mentor notes, attendance alerts, and grade sheets."}
              </p>
            </div>

            {/* Direction Switcher */}
            <div className="ai-trans-direction-switch">
              <button
                className={`ai-direction-btn ${transDirection === "en_to_ta" ? "active" : ""}`}
                onClick={() => setTransDirection("en_to_ta")}
              >
                🇬🇧 English &rarr; 🇮🇳 தமிழ் (Tamil)
              </button>
              <button
                className={`ai-direction-btn ${transDirection === "ta_to_en" ? "active" : ""}`}
                onClick={() => setTransDirection("ta_to_en")}
              >
                🇮🇳 தமிழ் &rarr; 🇬🇧 English
              </button>
            </div>
          </div>

          {/* Quick Notice Presets */}
          <div className="ai-trans-presets">
            <span className="preset-label">
              📌 {lang === "ta" ? "முன்மாதிரி சுற்றறிக்கைகள்:" : "Quick Samples:"}
            </span>
            {sampleCirculars.map((circ, idx) => (
              <button
                key={idx}
                className="ai-preset-chip"
                onClick={() => {
                  setTransSourceText(circ.text);
                  handleExecuteTranslation(circ.text);
                }}
              >
                {lang === "ta" ? circ.titleTa : circ.titleEn}
              </button>
            ))}
          </div>

          {/* Translation Dual Column Layout */}
          <div className="ai-trans-grid">
            {/* Input Column */}
            <div className="ai-trans-box input-box">
              <div className="box-header">
                <span>
                  {transDirection === "en_to_ta"
                    ? (lang === "ta" ? "ஆங்கில சுற்றறிக்கை அல்லது குறிப்பு (English Source):" : "Source Academic Text (English):")
                    : (lang === "ta" ? "தமிழ் உரை (Tamil Source):" : "Source Text (Tamil):")}
                </span>
                {transSourceText && (
                  <button
                    className="clear-btn"
                    onClick={() => {
                      setTransSourceText("");
                      setTransResult(null);
                    }}
                  >
                    {lang === "ta" ? "அழிக்க" : "Clear"}
                  </button>
                )}
              </div>

              <textarea
                className="ai-trans-textarea"
                rows={7}
                placeholder={
                  transDirection === "en_to_ta"
                    ? "Paste any college circular, attendance warning, exam report, or teacher note in English here..."
                    : "தமிழில் ஏதேனும் உரை அல்லது கேள்வியை இங்கே தட்டச்சு செய்யவும்..."
                }
                value={transSourceText}
                onChange={(e) => setTransSourceText(e.target.value)}
              />

              <div className="box-footer">
                <span className="char-count">{transSourceText.length} characters</span>
                <button
                  className="ai-btn ai-btn-purple"
                  disabled={!transSourceText.trim() || transLoading}
                  onClick={() => handleExecuteTranslation()}
                >
                  {transLoading
                    ? (lang === "ta" ? "மொழிபெயர்க்கப்படுகிறது..." : "Translating...")
                    : (lang === "ta" ? "🌐 தமிழில் மொழிபெயர்க்க" : "🌐 Translate Now")}
                </button>
              </div>
            </div>

            {/* Output Column */}
            <div className="ai-trans-box output-box">
              <div className="box-header">
                <span>
                  {transDirection === "en_to_ta"
                    ? (lang === "ta" ? "தமிழ் மொழிபெயர்ப்பு (Tamil Translation):" : "Tamil Translation (தமிழ்):")
                    : (lang === "ta" ? "ஆங்கில மொழிபெயர்ப்பு (English Translation):" : "English Translation:")}
                </span>

                {transResult?.translatedText && (
                  <div className="flex items-center gap-2">
                    <button
                      className="ai-trans-util-btn"
                      onClick={() => handleSpeakText(transResult.translatedText, "trans_box")}
                      title="Read aloud"
                    >
                      {speakingMsgId === "trans_box"
                        ? (lang === "ta" ? "⏹️ நிறுத்து" : "⏹️ Stop")
                        : (lang === "ta" ? "🔊 ஒலி கேட்க" : "🔊 Listen")}
                    </button>
                    <button
                      className="ai-trans-util-btn"
                      onClick={handleCopyTranslation}
                      title="Copy translation"
                    >
                      {transCopied ? "✅ நகலெடுக்கப்பட்டது!" : "📋 நகலெடு"}
                    </button>
                  </div>
                )}
              </div>

              <div className="ai-trans-result-area">
                {transLoading ? (
                  <div className="ai-trans-loading">
                    <div className="ai-thinking-dots">
                      <div className="ai-thinking-dot"></div>
                      <div className="ai-thinking-dot"></div>
                      <div className="ai-thinking-dot"></div>
                    </div>
                    <span>{lang === "ta" ? "அறிவார்ந்த தமிழ் மொழிபெயர்ப்பு உருவாகிறது..." : "Synthesizing bilingual translation..."}</span>
                  </div>
                ) : transResult ? (
                  <div className="ai-trans-content">
                    <div className="translated-main-text">
                      {transResult.translatedText}
                    </div>

                    {/* Extracted Parent Action Key Points */}
                    {transResult.keyPoints && transResult.keyPoints.length > 0 && (
                      <div className="ai-trans-keypoints">
                        <h4>📌 {lang === "ta" ? "பெற்றோருக்கான முக்கிய குறிப்புகள் (Action Items):" : "Key Extracted Action Items:"}</h4>
                        <div className="keypoints-grid">
                          {transResult.keyPoints.map((kp, idx) => (
                            <div key={idx} className="kp-item">
                              <span className="kp-label">{kp.label}</span>
                              <span className="kp-val">{kp.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ask in AI Chat about this notice */}
                    <div className="ai-trans-cta">
                      <button
                        className="ai-btn ai-btn-outline text-xs"
                        onClick={handleAskInChatAboutNotice}
                      >
                        🤖 {lang === "ta" ? "இந்த சுற்றறிக்கை பற்றி AI ஆலோசகரிடம் மேலும் கேட்க" : "Ask AI Advisory to explain this circular"} &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="ai-trans-empty">
                    <div className="empty-icon">🌐</div>
                    <p>
                      {lang === "ta"
                        ? "சுற்றறிக்கையை இடதுபுறம் உள்ளிட்டு 'தமிழில் மொழிபெயர்க்க' பட்டனை அழுத்தவும்."
                        : "Enter or select a circular on the left to view instant translation and parent insights."}
                    </p>
                  </div>
                )}
              </div>

              <div className="box-footer">
                <span className="provider-tag">
                  ⚡ {transResult?.provider || "AURA Academic Linguistic AI"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

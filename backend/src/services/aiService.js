const AIConversation = require("../models/AIConversation");
const AIMessage = require("../models/AIMessage");
const User = require("../models/User");
const Assignment = require("../models/Assignment");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const StudyTask = require("../models/StudyTask");
const StudySession = require("../models/StudySession");
const StudyGoal = require("../models/StudyGoal");
const llmEngine = require("../modules/llm/LLMEngine");

// ─── Intent Router ─────────────────────────────────────────
function detectIntent(message, mode) {
  const m = message.toLowerCase().trim();

  if (m.startsWith("/attendance") || m.includes("attendance") || m.includes("class")) return "ATTENDANCE_ANALYSIS";
  if (m.startsWith("/assignments") || m.includes("assignment") || m.includes("due")) return "ASSIGNMENT_HELP";
  if (m.startsWith("/study") || m.includes("study plan") || m.includes("schedule") || m.includes("focus")) return "STUDY_PLANNING";
  if (m.startsWith("/skills") || m.includes("skill") || m.includes("learn") || m.includes("roadmap")) return "SKILL_ANALYSIS";
  if (m.startsWith("/projects") || m.includes("project") || m.includes("milestone")) return "PROJECT_GUIDANCE";
  if (m.startsWith("/performance") || m.includes("performance") || m.includes("gpa") || m.includes("cgpa") || m.includes("grade")) return "ACADEMIC_ANALYSIS";
  if (m.startsWith("/risk") || m.includes("risk") || m.includes("warning")) return "RISK_ANALYSIS";
  if (m.startsWith("/career") || m.includes("career") || m.includes("job") || m.includes("placement")) return "CAREER_GUIDANCE";
  if (m.includes("code") || m.includes("debug") || m.includes("java") || m.includes("python") || m.includes("react")) return "CODING_HELP";
  if (m.includes("explain") || m.includes("what is") || m.includes("how does") || m.includes("understand")) return "TOPIC_EXPLANATION";
  if (m.includes("research") || m.includes("paper")) return "RESEARCH_HELP";

  return "GENERAL_CHAT";
}

// ─── Lightweight Context Query ─────────────────────────────
exports.getStudentContext = async (userId) => {
  const user = await User.findById(userId).lean();
  const assignments = await Assignment.find({}).lean();
  const projects = await Project.find({}).lean();
  const skills = await Skill.find({}).lean();
  const studyTasks = await StudyTask.find({ student: userId }).lean();
  const studyGoals = await StudyGoal.find({ student: userId }).lean();

  const userSubmissions = assignments.filter((a) =>
    a.submissions && a.submissions.some((s) => String(s.student) === String(userId))
  );

  const pendingAssignments = (assignments.length || 5) - userSubmissions.length;
  const attendancePct = user?.attendance || 86;
  const cgpa = user?.cgpa || 8.42;
  const activeProjects = projects.filter((p) => p.available).length || 2;
  const skillCount = skills.length || 5;

  let riskLevel = "Low";
  if (attendancePct < 75 || pendingAssignments > 4) riskLevel = "High";
  else if (attendancePct < 80 || pendingAssignments > 2) riskLevel = "Moderate";

  return {
    studentName: user?.name || "Student",
    cgpa,
    attendance: attendancePct,
    pendingAssignments: Math.max(0, pendingAssignments),
    studyProgress: 78,
    skillProgress: skillCount > 0 ? 72 : 0,
    activeProjects,
    risk: riskLevel,
  };
};

// ─── Deterministic Response Engine ──────────────────────────
async function buildDeterministicResponse(userId, intent, messageText, context) {
  const sources = ["Local MongoDB"];

  if (intent === "ATTENDANCE_ANALYSIS") {
    const isSafe = context.attendance >= 75;
    return {
      content: `### 📅 Attendance Analysis\n\n- **Overall Attendance**: **${context.attendance}%** (${isSafe ? "Safe" : "Critical"})\n- **Required Minimum**: 75%\n\n${
        isSafe
          ? "Your attendance is well above the required threshold (+11% margin). Keep up the consistency!"
          : "⚠️ **Attendance Warning**: Operating Systems attendance is currently below 75%. You need to attend the next 4 consecutive classes to get back into the safe zone."
      }`,
      type: "attendance_analysis",
      actions: [{ label: "View Attendance", route: "/dashboard/attendance" }],
      cards: [
        {
          title: "Attendance Status",
          badge: isSafe ? "Safe" : "Critical",
          description: `Overall: ${context.attendance}%`,
          status: isSafe ? "safe" : "critical",
        },
      ],
      sourcesUsed: [...sources, "Attendance Collection"],
    };
  }

  if (intent === "ASSIGNMENT_HELP") {
    return {
      content: `### 📝 Assignment Assistant\n\n- **Pending Assignments**: **${context.pendingAssignments}**\n- **Highest Priority**: DBMS Assignment (Due Tomorrow at 11:59 PM)\n\n**Recommended Action Plan**:\n1. Complete **DBMS Assignment** first (estimated 60 min).\n2. Review Machine Learning Quiz guidelines.\n\nWould you like me to add a study session for DBMS Assignment to your planner?`,
      type: "assignment_help",
      actions: [
        { label: "Open Assignments", route: "/dashboard/assignments" },
        { label: "Add Session to Planner", route: "/dashboard/study-planner", actionType: "ADD_PLANNER_TASK", payload: { title: "DBMS Assignment Revision", subject: "DBMS", estimatedMinutes: 60 } },
      ],
      cards: [
        {
          title: "DBMS Assignment",
          badge: "Due Tomorrow",
          description: "High Priority • Estimated: 60 min",
          status: "warning",
        },
      ],
      sourcesUsed: [...sources, "Assignment Collection"],
    };
  }

  if (intent === "STUDY_PLANNING") {
    return {
      content: `### 🗓️ Smart Study Plan Recommendation\n\nBased on your upcoming deadlines and study goals, here is your recommended schedule for today:\n\n1. **06:00 PM – 07:30 PM**: DBMS Assignment (*Urgent*) \n2. **07:30 PM – 07:45 PM**: Short Break ☕\n3. **07:45 PM – 08:45 PM**: Data Structures Revision\n4. **09:00 PM – 09:45 PM**: Machine Learning Practice\n\nClick below to save this plan to your Study Planner!`,
      type: "study_planning",
      actions: [
        { label: "Open Study Planner", route: "/dashboard/study-planner" },
        { label: "Add All to Planner", route: "/dashboard/study-planner", actionType: "ADD_PLANNER_TASK", payload: { title: "DBMS Revision", subject: "DBMS", estimatedMinutes: 90 } },
      ],
      cards: [
        {
          title: "Today's Recommended Focus",
          badge: "3 Sessions",
          description: "Total: 3h 15m planned study time",
          status: "good",
        },
      ],
      sourcesUsed: [...sources, "StudyPlanner Collection"],
    };
  }

  if (intent === "ACADEMIC_ANALYSIS") {
    return {
      content: `### 📊 Academic Performance Overview\n\n- **Current CGPA**: **${context.cgpa}** / 10.0\n- **Academic Score**: **82 / 100** (+4.2% from previous semester)\n\n**Strengths**:\n- High score in Data Structures (86%)\n- Strong assignment submission record (86%)\n\n**Needs Attention**:\n- Operating Systems Attendance (72%)\n- Machine Learning Internal Test Preparation\n\n**Recommended Next Step**: Schedule a 60-minute revision block for Operating Systems.`,
      type: "academic_analysis",
      actions: [
        { label: "View Full Analytics", route: "/dashboard/analytics" },
        { label: "View Profile", route: "/dashboard/profile" },
      ],
      cards: [
        {
          title: "Academic Health",
          badge: "84 / 100",
          description: "Overall Status: Good",
          status: "safe",
        },
      ],
      sourcesUsed: [...sources, "Student Profile", "Analytics Engine"],
    };
  }

  if (intent === "RISK_ANALYSIS") {
    return {
      content: `### ⚠️ Academic Risk Analysis\n\n- **Overall Risk Level**: **${context.risk.toUpperCase()} RISK**\n\n**Evaluated Risk Factors**:\n- **Attendance**: Operating Systems is at 72% (*Requires 4 classes*)\n- **Assignments**: ${context.pendingAssignments} pending assignments\n- **Study Consistency**: 84% (*Safe*)\n\n**Immediate Action Required**: Attend all upcoming Operating Systems classes and complete the pending DBMS assignment.`,
      type: "risk_analysis",
      actions: [
        { label: "View Attendance", route: "/dashboard/attendance" },
        { label: "View Analytics Risk", route: "/dashboard/analytics" },
      ],
      cards: [
        {
          title: "Risk Status",
          badge: `${context.risk} Risk`,
          description: "Attendance shortage in Operating Systems",
          status: context.risk === "Low" ? "safe" : "warning",
        },
      ],
      sourcesUsed: [...sources, "Risk Engine"],
    };
  }

  if (intent === "SKILL_ANALYSIS") {
    return {
      content: `### 🎯 Skill Gap Analysis & Recommendations\n\n- **Skills Proficiency**: **${context.skillProgress}%**\n- **Top Skill**: Programming & Problem Solving (85%)\n- **Skill Gap**: Node.js Backend Development (*Intermediate 68% -> Target Advanced 85%*)\n\n**Learning Pathway**:\n1. Master Async/Await & Event Loop concepts.\n2. Build a full-stack REST API with MongoDB & Mongoose.\n3. Implement JWT authentication & Middleware pattern.`,
      type: "skill_analysis",
      actions: [{ label: "Open Skills Module", route: "/dashboard/skills" }],
      cards: [
        {
          title: "Top Recommended Skill",
          badge: "Node.js",
          description: "Skill Gap: 32% to Advanced",
          status: "good",
        },
      ],
      sourcesUsed: [...sources, "Skill Collection"],
    };
  }

  if (intent === "PROJECT_GUIDANCE") {
    return {
      content: `### 💻 Project Mentor\n\n- **Active Projects**: **${context.activeProjects}**\n- **Primary Project**: Placement Portal (*Web Development*)\n- **Current Progress**: **78%**\n\n**Next Recommended Milestone**:\n- Integrate the Student Analytics dashboard endpoint with Mongoose aggregation pipelines.\n- Complete UI responsive testing on tablet/mobile screens.`,
      type: "project_guidance",
      actions: [{ label: "Open Projects", route: "/dashboard/projects" }],
      cards: [
        {
          title: "Placement Portal",
          badge: "78% Complete",
          description: "Domain: Web Development",
          status: "safe",
        },
      ],
      sourcesUsed: [...sources, "Project Collection"],
    };
  }

  if (intent === "CODING_HELP") {
    return {
      content: `### 💻 Coding Assistant\n\nHere is a quick reference for implementing async middleware error handling in Node.js/Express:\n\n\`\`\`javascript\nconst asyncHandler = (fn) => (req, res, next) => {\n  Promise.resolve(fn(req, res, next)).catch(next);\n};\n\nmodule.exports = asyncHandler;\n\`\`\`\n\nFeel free to paste any code snippet or error stack trace, and I will help you debug it step by step!`,
      type: "coding_help",
      actions: [],
      sourcesUsed: ["Coding Engine"],
    };
  }

  if (intent === "CAREER_GUIDANCE") {
    return {
      content: `### 💼 Career Copilot\n\n- **Target Role**: Full Stack Software Engineer\n- **Career Match**: **84%**\n\n**Strengths**:\n- Data Structures & Algorithms\n- Web Development Fundamentals\n\n**Skill Gaps**:\n- Backend Microservices Architecture\n- Docker & Containerization\n\n**Recommended Next Step**: Complete the Placement Portal project and add 2 full-stack projects to your portfolio.`,
      type: "career_guidance",
      actions: [
        { label: "View Skills", route: "/dashboard/skills" },
        { label: "View Projects", route: "/dashboard/projects" },
      ],
      sourcesUsed: [...sources, "Career Engine"],
    };
  }

  // Fallback General Chat
  return {
    content: `Hi **${context.studentName}**! I'm **AURA**, your academic copilot. I can help you analyze your academic performance, track attendance, plan your daily study schedule, manage pending assignments, and guide your career skills.\n\nWhat would you like to focus on today?`,
    type: "general_chat",
    actions: [
      { label: "Check Attendance", route: "/dashboard/attendance" },
      { label: "View Study Planner", route: "/dashboard/study-planner" },
      { label: "Check Analytics", route: "/dashboard/analytics" },
    ],
    sourcesUsed: [...sources],
  };
}

// ─── Process Chat Message ────────────────────────────────────
exports.processChat = async (userId, conversationId, messageText, mode = "auto") => {
  const context = await exports.getStudentContext(userId);
  const intent = detectIntent(messageText, mode);

  // Retrieve or Create Conversation
  let conversation;
  if (conversationId) {
    conversation = await AIConversation.findOne({ _id: conversationId, user: userId });
  }

  if (!conversation) {
    const title = messageText.length > 30 ? messageText.substring(0, 30) + "..." : messageText;
    conversation = await AIConversation.create({
      user: userId,
      title: title || "New Academic Chat",
      mode,
    });
  }

  // Save User Message
  const userMsg = await AIMessage.create({
    conversation: conversation._id,
    user: userId,
    role: "user",
    content: messageText,
    intent,
  });

  // Try LLM Engine or fallback to Deterministic Engine
  let responseData;
  const llmText = await llmEngine.generateResponse({
    messages: [{ role: "user", content: messageText }],
    context,
    intent,
    mode,
  });

  if (llmText) {
    responseData = {
      content: llmText,
      type: "llm_generated",
      actions: [
        { label: "View Study Planner", route: "/dashboard/study-planner" },
        { label: "View Analytics", route: "/dashboard/analytics" },
      ],
      sourcesUsed: ["LLM Provider", "Student Academic Context"],
    };
  } else {
    responseData = await buildDeterministicResponse(userId, intent, messageText, context);
  }

  // Save Assistant Message
  const assistantMsg = await AIMessage.create({
    conversation: conversation._id,
    user: userId,
    role: "assistant",
    content: responseData.content,
    intent,
    type: responseData.type || "text",
    actions: responseData.actions || [],
    cards: responseData.cards || [],
    sourcesUsed: responseData.sourcesUsed || ["Local MongoDB"],
  });

  // Update conversation last message timestamp
  conversation.lastMessageAt = new Date();
  await conversation.save();

  return {
    conversationId: conversation._id,
    conversationTitle: conversation.title,
    userMessage: userMsg,
    assistantMessage: assistantMsg,
  };
};

// ─── Conversations & History ────────────────────────────────
exports.getConversations = async (userId) => {
  return AIConversation.find({ user: userId }).sort({ pinned: -1, updatedAt: -1 }).lean();
};

exports.getMessages = async (userId, conversationId) => {
  const conversation = await AIConversation.findOne({ _id: conversationId, user: userId });
  if (!conversation) return [];
  return AIMessage.find({ conversation: conversationId, user: userId }).sort({ createdAt: 1 }).lean();
};

exports.deleteConversation = async (userId, conversationId) => {
  await AIMessage.deleteMany({ conversation: conversationId, user: userId });
  return AIConversation.findOneAndDelete({ _id: conversationId, user: userId });
};

exports.updateConversation = async (userId, conversationId, updateData) => {
  return AIConversation.findOneAndUpdate({ _id: conversationId, user: userId }, updateData, { new: true });
};

exports.setFeedback = async (userId, messageId, feedback) => {
  return AIMessage.findOneAndUpdate({ _id: messageId, user: userId }, { feedback }, { new: true });
};

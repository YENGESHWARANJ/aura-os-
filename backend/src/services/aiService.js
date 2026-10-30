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
const translatorService = require("./translatorService");

// ─── Intent Router (English & Tamil) ─────────────────────────
function detectIntent(message, mode) {
  const m = message.toLowerCase().trim();

  if (m.startsWith("/attendance") || m.includes("attendance") || m.includes("class") || m.includes("வருகை") || m.includes("வகுப்பு") || m.includes("ஆப்சென்ட்") || m.includes("பிரசன்ட்")) return "ATTENDANCE_ANALYSIS";
  if (m.startsWith("/assignments") || m.includes("assignment") || m.includes("due") || m.includes("பணி") || m.includes("வீட்டுப்பாடம்") || m.includes("ஹோம்வொர்க்")) return "ASSIGNMENT_HELP";
  if (m.startsWith("/study") || m.includes("study plan") || m.includes("schedule") || m.includes("focus") || m.includes("படிப்பு") || m.includes("திட்டம்") || m.includes("நேர அட்டவணை")) return "STUDY_PLANNING";
  if (m.startsWith("/skills") || m.includes("skill") || m.includes("learn") || m.includes("roadmap") || m.includes("திறன்") || m.includes("கற்றல்")) return "SKILL_ANALYSIS";
  if (m.startsWith("/projects") || m.includes("project") || m.includes("milestone") || m.includes("ப்ராஜெக்ட்") || m.includes("திட்டப்பணி")) return "PROJECT_GUIDANCE";
  if (m.startsWith("/performance") || m.includes("performance") || m.includes("gpa") || m.includes("cgpa") || m.includes("grade") || m.includes("மதிப்பெண்") || m.includes("தேர்வு") || m.includes("ரிசல்ட்")) return "ACADEMIC_ANALYSIS";
  if (m.startsWith("/risk") || m.includes("risk") || m.includes("warning") || m.includes("அபாயம்") || m.includes("எச்சரிக்கை") || m.includes("குறைபாடு")) return "RISK_ANALYSIS";
  if (m.startsWith("/mentor") || m.includes("mentor") || m.includes("teacher") || m.includes("சுரேஷ்") || m.includes("ஆசிரியர்") || m.includes("சந்திப்பு") || m.includes("கலந்தாய்வு")) return "MENTOR_GUIDANCE";
  if (m.startsWith("/translate") || m.includes("translate") || m.includes("மொழிபெயர்") || m.includes("மொழிபெயர்ப்பு") || m.includes("சுற்றறிக்கை")) return "TRANSLATION_TOOL";
  if (m.startsWith("/career") || m.includes("career") || m.includes("job") || m.includes("placement") || m.includes("வேலை") || m.includes("கேம்பஸ்")) return "CAREER_GUIDANCE";
  if (m.includes("code") || m.includes("debug") || m.includes("java") || m.includes("python") || m.includes("react")) return "CODING_HELP";
  if (m.includes("explain") || m.includes("what is") || m.includes("how does") || m.includes("விளக்கு") || m.includes("என்ன")) return "TOPIC_EXPLANATION";
  if (m.includes("research") || m.includes("paper")) return "RESEARCH_HELP";

  return "GENERAL_CHAT";
}

// ─── Lightweight Context Query (Parent & Student Aware) ──────
exports.getStudentContext = async (userId) => {
  const user = await User.findById(userId).lean();
  const assignments = await Assignment.find({}).lean();
  const projects = await Project.find({}).lean();
  const skills = await Skill.find({}).lean();
  const studyTasks = await StudyTask.find({ student: userId }).lean();
  const studyGoals = await StudyGoal.find({ student: userId }).lean();

  const isParent = user?.role === "parent";

  const userSubmissions = assignments.filter((a) =>
    a.submissions && a.submissions.some((s) => String(s.student) === String(userId))
  );

  const pendingAssignments = isParent ? 1 : Math.max(0, (assignments.length || 5) - userSubmissions.length);
  const attendancePct = isParent ? 84 : (user?.attendance || 86);
  const cgpa = isParent ? 8.80 : (user?.cgpa || 8.42);
  const activeProjects = isParent ? 2 : (projects.filter((p) => p.available).length || 2);
  const skillCount = skills.length || 5;

  let riskLevel = "Safe";
  if (attendancePct < 75 || pendingAssignments > 4) riskLevel = "High";
  else if (attendancePct < 80 || pendingAssignments > 2) riskLevel = "Moderate";

  return {
    isParent,
    parentName: isParent ? (user?.name || "Robert Johnson") : null,
    childName: isParent ? "Alex Johnson" : (user?.name || "Student"),
    rollNumber: isParent ? "22AI701" : (user?.rollNumber || "AURA2026AI010"),
    department: "Artificial Intelligence & Data Science",
    semester: isParent ? "Semester 7" : (user?.semester ? `Semester ${user.semester}` : "Semester 6"),
    mentorName: "Dr. Suresh R",
    mentorContact: "+91 98765 43210",
    studentName: isParent ? "Alex Johnson" : (user?.name || "Student"),
    cgpa,
    attendance: attendancePct,
    pendingAssignments,
    studyProgress: 78,
    skillProgress: isParent ? 78 : (skillCount > 0 ? 72 : 0),
    activeProjects,
    risk: riskLevel,
  };
};

// ─── Deterministic Response Engine (English & Tamil) ─────────
async function buildDeterministicResponse(userId, intent, messageText, context, isTamil = false) {
  const sources = ["Local MongoDB", "Academic Records"];
  const name = context.isParent ? context.childName : context.studentName;

  // 1. ATTENDANCE ANALYSIS
  if (intent === "ATTENDANCE_ANALYSIS") {
    const isSafe = context.attendance >= 75;

    if (isTamil) {
      return {
        content: `### 📅 குழந்தையின் வருகைப் பதிவு அறிக்கை (Attendance Analysis)\n\n- **மாணவர்**: **${name}** (${context.rollNumber})\n- **ஒட்டுமொத்த வருகை**: **${context.attendance}%** (${isSafe ? "பாதுகாப்பானது / Safe" : "கவனிக்கத்தக்க நிலை / Warning"})\n- **குறைந்தபட்ச தேவை**: 75%\n\n${
          isSafe
            ? `✅ **நற்செய்தி**: ${name}-ன் ஒட்டுமொத்த வருகை பல்கலைக்கழக நிர்ணயித்த 75% அளவை விட **+9% கூடுதலாக** உள்ளது. மாணவர் சீராக வகுப்புகளுக்கு வந்து கொண்டிருக்கிறார்.`
            : `⚠️ **எச்சரிக்கை**: மாணவரின் வருகை 75% க்கும் கீழே குறைந்துள்ளது. அடுத்த 4 தொடர் வகுப்புகளில் கலந்துகொண்டால் மட்டுமே பாதுகாப்பான நிலைக்கு திரும்ப முடியும்.`
        }\n\n**பாடவாரி வருகை நிலவரம்**:\n1. இயற்கை மொழி செயலாக்கம் (NLP): **92%** (சிறப்பானது)\n2. தரவு காட்சிப்படுத்தல் (Data Viz): **88%** (பாதுகாப்பானது)\n3. கணினி பார்வை (Computer Vision): **78%** (சரிபார்ப்பு தேவை)\n4. பெருந்தரவு பகுப்பாய்வு (Big Data Analytics): **71%** (⚠️ 75% க்கும் குறைவு)\n\n💡 **பெற்றோர் ஆலோசனை**: பெருந்தரவு பகுப்பாய்வு (Big Data) வகுப்பில் வருகை 71% ஆக உள்ளதால், அடுத்த 3 வகுப்புகளில் தவறாமல் கலந்துகொள்ள உங்கள் குழந்தையை ஊக்கப்படுத்தவும்.`,
        type: "attendance_analysis",
        actions: [{ label: "முழு வருகைப் பதிவு", route: "/parent/attendance" }],
        cards: [
          {
            title: "ஒட்டுமொத்த வருகை",
            badge: `${context.attendance}%`,
            description: `${name} • ${isSafe ? "பாதுகாப்பானது" : "எச்சரிக்கை"}`,
            status: isSafe ? "safe" : "warning",
          },
          {
            title: "கவனிக்க வேண்டிய பாடம்",
            badge: "71%",
            description: "Big Data Analytics (குறைந்தபட்சம் 75% தேவை)",
            status: "warning",
          },
        ],
        sourcesUsed: [...sources, "Biometric Attendance Database"],
      };
    }

    return {
      content: `### 📅 Child Attendance Analysis\n\n- **Student**: **${name}** (${context.rollNumber})\n- **Overall Attendance**: **${context.attendance}%** (${isSafe ? "Safe" : "Critical"})\n- **Required Minimum**: 75%\n\n${
        isSafe
          ? `✅ Overall attendance is well above the mandatory university threshold (+9% safe margin).`
          : `⚠️ Attendance is currently below 75%. Student must attend consecutive upcoming classes to recover.`
      }\n\n**Subject Breakdown**:\n- Natural Language Processing: **92%** (Safe)\n- Data Visualisation: **88%** (Safe)\n- Computer Vision: **78%** (Safe)\n- Big Data Analytics: **71%** (⚠️ Action Required)\n\n💡 **Parent Recommendation**: Encourage ${name} to attend the next 3 consecutive Big Data Analytics lectures to reach the 75% threshold.`,
      type: "attendance_analysis",
      actions: [{ label: "View Child Attendance", route: "/parent/attendance" }],
      cards: [
        {
          title: "Overall Attendance",
          badge: `${context.attendance}%`,
          description: isSafe ? "Safe Standing" : "Action Required",
          status: isSafe ? "safe" : "warning",
        },
      ],
      sourcesUsed: [...sources, "Attendance Collection"],
    };
  }

  // 2. ACADEMIC ANALYSIS
  if (intent === "ACADEMIC_ANALYSIS") {
    if (isTamil) {
      return {
        content: `### 📊 கல்வி செயல்திறன் & மதிப்பெண் விவரம் (Academic Performance)\n\n- **மாணவர்**: **${name}** (${context.rollNumber})\n- **தற்போதைய CGPA**: **${context.cgpa} / 10.0** (வகுப்பில் முதல் 5% மாணவர்களில் ஒருவர்)\n- **பருவ இடைத் தேர்வு (Mid-Term)**: **88% ஒட்டுமொத்த மதிப்பெண்கள்**\n\n**பாடவாரி சாதனைகள்**:\n- **இயற்கை மொழி செயலாக்கம் (NLP)**: 45/50 (தரம்: O - Outstanding)\n- **தரவு காட்சிப்படுத்தல்**: 42/50 (தரம்: A+)\n- **வலுவூட்டல் கற்றல்**: 40/50 (தரம்: A+)\n- **கணினி பார்வை**: 38/50 (தரம்: A)\n- **பெருந்தரவு பகுப்பாய்வு**: 32/50 (தரம்: B+)\n\n💡 **பெற்றோர் வழிகாட்டல்**: ${name}-ன் கல்வி திறன் மிகவும் திருப்திகரமாக உள்ளது. பிக் டேட்டா அனலிட்டிக்ஸ் பாடத்தில் மட்டும் சற்று கூடுதல் பயிற்சி தேவைப்படுகிறது.`,
        type: "academic_analysis",
        actions: [{ label: "கல்வி டாஷ்போர்டு", route: "/parent/dashboard" }],
        cards: [
          {
            title: "தற்போதைய CGPA",
            badge: `${context.cgpa} / 10.0`,
            description: "First Class with Distinction",
            status: "safe",
          },
          {
            title: "மிட்-டெர்ம் தேர்வு",
            badge: "88%",
            description: "சிறப்பான செயல்திறன்",
            status: "safe",
          },
        ],
        sourcesUsed: [...sources, "Examination Portal", "Controller of Exams"],
      };
    }

    return {
      content: `### 📊 Academic Performance Overview\n\n- **Student**: **${name}** (${context.rollNumber})\n- **Current CGPA**: **${context.cgpa} / 10.0** (Top 5% of Department)\n- **Mid-Term Examination Score**: **88% Overall**\n\n**Subject Breakdown**:\n- Natural Language Processing: **45/50** (Grade O)\n- Data Visualisation: **42/50** (Grade A+)\n- Reinforcement Learning: **40/50** (Grade A+)\n- Computer Vision: **38/50** (Grade A)\n- Big Data Analytics: **32/50** (Grade B+)\n\n💡 **Parent Insight**: Academic performance is solid. Slight revision in Big Data Analytics will easily push semester GPA above 9.0.`,
      type: "academic_analysis",
      actions: [{ label: "View Academic Dashboard", route: "/parent/dashboard" }],
      cards: [
        {
          title: "Cumulative CGPA",
          badge: `${context.cgpa}`,
          description: "Top Tier Performance",
          status: "safe",
        },
      ],
      sourcesUsed: [...sources, "Academic Evaluation Engine"],
    };
  }

  // 3. RISK ANALYSIS
  if (intent === "RISK_ANALYSIS") {
    if (isTamil) {
      return {
        content: `### ⚠️ கல்வி மற்றும் ஒழுங்கு அபாய ஆய்வு (Academic Risk Check)\n\n- **மாணவர்**: **${name}**\n- **ஒட்டுமொத்த அபாய நிலை**: **பாதுகாப்பானது (SAFE STATUS)**\n\n**ஆய்வு செய்யப்பட்ட காரணிகள்**:\n- **ஒழுக்கம் & வருகை**: 84% (பாதுகாப்பானது; ஆனால் Big Data-வில் 71% கவனம் தேவை)\n- **நிலுவை தேர்வுகள் / அரியர்ஸ்**: ஏதுமில்லை (0 Arrears)\n- **நிலுவை வீட்டுப்பாடங்கள்**: 1 பணி மட்டுமே நிலுவையில் உள்ளது\n\n✅ கடுமையான கல்வி அபாயங்கள் எதுவும் இல்லை. உங்கள் குழந்தை சரியான கல்வி பாதையில் முன்னேறி வருகிறார்.`,
        type: "risk_analysis",
        actions: [{ label: "வருகை விவரம் சரிபார்க்க", route: "/parent/attendance" }],
        cards: [
          {
            title: "கல்வி அபாய நிலை",
            badge: "Safe (பாதுகாப்பானது)",
            description: "தீவிர அபாயங்கள் ஏதுமில்லை",
            status: "safe",
          },
        ],
        sourcesUsed: [...sources, "Early Warning Intervention Engine"],
      };
    }

    return {
      content: `### ⚠️ Academic Risk & Early Warning Assessment\n\n- **Student**: **${name}** (${context.rollNumber})\n- **Overall Standing**: **SAFE (Low Risk)**\n\n**Assessed Factors**:\n- **Arrears / Backlogs**: 0 (Clean Track Record)\n- **Attendance Margin**: 84% overall (+9% above 75% minimum)\n- **Pending Deliverables**: 1 project report\n\nNo critical intervention required at this moment.`,
      type: "risk_analysis",
      actions: [{ label: "Check Attendance Status", route: "/parent/attendance" }],
      cards: [
        {
          title: "Risk Level",
          badge: "Safe / Low",
          description: "No academic probation flags",
          status: "safe",
        },
      ],
      sourcesUsed: [...sources, "Risk Analysis Module"],
    };
  }

  // 4. MENTOR GUIDANCE
  if (intent === "MENTOR_GUIDANCE") {
    if (isTamil) {
      return {
        content: `### 👨‍🏫 வழிகாட்டி ஆசிரியர் விவரம் & கலந்தாய்வு (Mentor Guidance)\n\n- **வழிகாட்டி ஆசிரியர்**: **${context.mentorName}** (துணை பேராசிரியர் - AI துறை)\n- **தொடர்பு எண்**: **${context.mentorContact}**\n- **மின்னஞ்சல்**: suresh.r@aura.edu\n- **அடுத்த சந்திப்பு**: **வெள்ளிக்கிழமை மாலை 3:00 மணி** (1-க்கு-1 ஆன்லைன் கலந்தாய்வு)\n\n**ஆசிரியர் குறிப்பு (Teacher Note)**:\n"அலெக்ஸ் வகுப்பில் மிகவும் கூர்மையான மாணவர். ப்ராஜெக்ட் பணிகளை மிக நேர்த்தியாக செய்து வருகிறார். பெருந்தரவு வகுப்புகளுக்கு மட்டும் ஒழுங்காக வர அறிவுறுத்தவும்."`,
        type: "mentor_guidance",
        actions: [{ label: "அறிவிப்புகள் பக்கம்", route: "/parent/notifications" }],
        cards: [
          {
            title: "வழிகாட்டி ஆசிரியர்",
            badge: context.mentorName,
            description: `சந்திப்பு: வெள்ளிக்கிழமை 3:00 PM • ${context.mentorContact}`,
            status: "safe",
          },
        ],
        sourcesUsed: [...sources, "Mentor System"],
      };
    }

    return {
      content: `### 👨‍🏫 Faculty Mentor Contact & Consultation\n\n- **Assigned Mentor**: **${context.mentorName}** (Associate Professor, Dept of AI)\n- **Contact Phone**: **${context.mentorContact}**\n- **Email**: suresh.r@aura.edu\n- **Next Scheduled Meeting**: **Friday at 3:00 PM** (1-on-1 Online Parent Review)\n\n**Mentor Remark**:\n"Alex is an exceptionally engaged student with high aptitude in NLP and computer vision. Ensuring punctual attendance in morning Big Data lectures is the only point to monitor."`,
      type: "mentor_guidance",
      actions: [{ label: "View Parent Alerts", route: "/parent/notifications" }],
      cards: [
        {
          title: "Mentor Session",
          badge: "Friday 3:00 PM",
          description: `${context.mentorName} • Online Review`,
          status: "safe",
        },
      ],
      sourcesUsed: [...sources, "Faculty Mentor Records"],
    };
  }

  // 5. ASSIGNMENTS HELP
  if (intent === "ASSIGNMENT_HELP") {
    if (isTamil) {
      return {
        content: `### 📝 சமர்ப்பிக்க வேண்டிய பணிகள் & வீட்டுப்பாடங்கள் (Pending Assignments)\n\n- **மாணவர்**: **${name}**\n- **நிலுவையில் உள்ள பணிகள்**: **1 பணி**\n- **முக்கிய பணி**: கணினி பார்வை ப்ராஜெக்ட் அறிக்கை (Computer Vision Phase 1 Project Report)\n- **கடைசி தேதி**: **திங்கட்கிழமை மாலை 5:00 மணி**\n\n✅ கடந்த வாரம் ஒப்படைக்கப்பட்ட தரவுத்தள பணிக்கு (DBMS) அலெக்ஸ் **92/100** மதிப்பெண் பெற்றுள்ளார்.`,
        type: "assignment_help",
        actions: [{ label: "கல்வி டாஷ்போர்டு", route: "/parent/dashboard" }],
        cards: [
          {
            title: "Computer Vision Report",
            badge: "திங்கட்கிழமை 5:00 PM",
            description: "Phase 1 Submission Due",
            status: "warning",
          },
        ],
        sourcesUsed: [...sources, "LMS Assignment Module"],
      };
    }

    return {
      content: `### 📝 Pending Assignments & Deliverables\n\n- **Student**: **${name}**\n- **Active Pending Tasks**: **1 deliverable**\n- **Top Priority**: Computer Vision Phase 1 Report (Due Monday, 5:00 PM)\n\nPrevious submission (DBMS Project) scored **92/100** with commendation from course instructor.`,
      type: "assignment_help",
      actions: [{ label: "View Academic Dashboard", route: "/parent/dashboard" }],
      cards: [
        {
          title: "Pending Deliverable",
          badge: "Due Monday 5 PM",
          description: "Computer Vision Phase 1 Report",
          status: "warning",
        },
      ],
      sourcesUsed: [...sources, "Assignment Records"],
    };
  }

  // 6. STUDY PLANNING
  if (intent === "STUDY_PLANNING") {
    if (isTamil) {
      return {
        content: `### 🗓️ குழந்தையின் படிப்பு அட்டவணை பரிந்துரை (Study Schedule)\n\nபெற்றோராக நீங்கள் வீட்டில் பின்வரும் படிப்பு நேரத்தை அமைத்துக் கொடுக்கலாம்:\n\n1. **மாலை 06:00 – 07:15**: பெருந்தரவு பகுப்பாய்வு (Big Data) திருப்புதல் (*முக்கியமானது*)\n2. **மாலை 07:15 – 07:30**: சிறு தேநீர் இடைவேளை ☕\n3. **இரவு 07:30 – 08:30**: கணினி பார்வை ப்ராஜெக்ட் பணிகள் (Computer Vision Report)\n4. **இரவு 08:30 – 09:15**: இயந்திர கற்றல் பயிற்சி\n\n💡 **உதவிக்குறிப்பு**: தினசரி 2 மணிநேர சீரான மாலை படிப்பு அட்டவணை தேர்வு காலத்தில் மன அழுத்தத்தை குறைக்கும்.`,
        type: "study_planning",
        actions: [{ label: "டாஷ்போர்டு செல்ல", route: "/parent/dashboard" }],
        cards: [
          {
            title: "தினசரி படிப்பு இலக்கு",
            badge: "2 மணி 30 நிமிடம்",
            description: "மாலை 6:00 PM முதல் 9:15 PM வரை",
            status: "safe",
          },
        ],
        sourcesUsed: [...sources, "AI Planner"],
      };
    }

    return {
      content: `### 🗓️ Recommended Study Schedule for ${name}\n\nHere is a structured daily home routine you can encourage:\n\n1. **06:00 PM – 07:15 PM**: Big Data Analytics concepts revision (*High Priority*)\n2. **07:15 PM – 07:30 PM**: Healthy snack break ☕\n3. **07:30 PM – 08:30 PM**: Computer Vision Lab report completion\n4. **08:30 PM – 09:15 PM**: Machine Learning coding drills\n\nA regular 2-hour daily evening routine ensures complete readiness for university semester exams.`,
      type: "study_planning",
      actions: [{ label: "Academic Dashboard", route: "/parent/dashboard" }],
      cards: [
        {
          title: "Target Study Time",
          badge: "2h 30m / day",
          description: "Structured Evening Routine",
          status: "safe",
        },
      ],
      sourcesUsed: [...sources, "Study Engine"],
    };
  }

  // 7. TRANSLATION TOOL
  if (intent === "TRANSLATION_TOOL") {
    if (isTamil) {
      return {
        content: `### 🌐 AURA AI பெற்றோர் மொழிபெயர்ப்பாளர் (AI Academic Translator)\n\nகல்லூரியின் எந்தவொரு ஆங்கில சுற்றறிக்கை, தேர்வு முடிவுகள் அல்லது ஆசிரியர் குறிப்புகளையும் எளிமையான தமிழில் மொழிபெயர்க்கலாம்!\n\n**பயன்படுத்தும் முறை**:\n- மேலே உள்ள **"🌐 AI மொழிபெயர்ப்பாளர்"** டேப்பை கிளிக் செய்யவும்.\n- ஆங்கில சுற்றறிக்கையை பேஸ்ட் செய்தால் உடனுக்குடன் **தமிழ் மொழிபெயர்ப்பு, முக்கிய குறிப்புகள் மற்றும் ஆடியோ வாசிப்பு** கிடைக்கும்.\n- அல்லது இதே சாட்டில் ஆங்கில செய்தியை அனுப்பினால் உடனடியாக தமிழில் மொழிபெயர்த்து தருகிறேன்!`,
        type: "translation_tool",
        actions: [],
        cards: [
          {
            title: "மொழிபெயர்ப்பு வசதி",
            badge: "English ⇄ தமிழ்",
            description: "உடனடி சுற்றறிக்கை மொழிபெயர்ப்பு மற்றும் ஆடியோ வாசிப்பு",
            status: "safe",
          },
        ],
        sourcesUsed: [...sources, "AURA Bilingual Translation Engine"],
      };
    }

    return {
      content: `### 🌐 AURA AI Parent Academic Translator (English ⇄ Tamil)\n\nYou can easily translate any college circular, exam grade sheet, or teacher notification into fluent Tamil with key action points highlighted!\n\n- Switch to the **"🌐 AI Translator"** tab at any time.\n- Paste any English notice or remark to receive instant Tamil translation with parent action items and audio voice playback.\n- You can also paste text right here in chat for instant bilingual assistance.`,
      type: "translation_tool",
      actions: [],
      cards: [
        {
          title: "Bilingual Translator",
          badge: "EN ⇄ TA",
          description: "Instant translation & voice speech synthesis",
          status: "safe",
        },
      ],
      sourcesUsed: [...sources, "Translator Service"],
    };
  }

  // 8. CAREER / PLACEMENT
  if (intent === "CAREER_GUIDANCE") {
    if (isTamil) {
      return {
        content: `### 💼 கேம்பஸ் வேலைவாய்ப்பு & திறன் தயாரிப்பு (Placement Readiness)\n\n- **மாணவர்**: **${name}**\n- **இலக்கு பதவி**: AI & Full Stack மென்பொருள் பொறியாளர்\n- **வேலைவாய்ப்பு பொருத்தம் (Placement Match)**: **88%**\n\n**சிறந்த திறன்கள்**:\n- மென்பொருள் நிரலாக்கம் & அல்காரிதம் (85%)\n- இயற்கை மொழி செயலாக்கம் & தரவு அறிவியல்\n\n💡 **பெற்றோருக்கு ஆலோசனை**: அலெக்ஸ் நல்ல தொழில்நுட்ப திறன்களை கொண்டுள்ளார். இறுதி ஆண்டு கேம்பஸ் நேர்முகத் தேர்வுகளுக்கு (Campus Placements) முழு தகுதியுடன் இருக்கிறார்.`,
        type: "career_guidance",
        actions: [{ label: "டாஷ்போர்டு", route: "/parent/dashboard" }],
        cards: [
          {
            title: "கேம்பஸ் தகுதி",
            badge: "88% Match",
            description: "AI & Full Stack Engineer Track",
            status: "safe",
          },
        ],
        sourcesUsed: [...sources, "Career Engine"],
      };
    }

    return {
      content: `### 💼 Campus Placement & Career Readiness\n\n- **Student**: **${name}** (${context.rollNumber})\n- **Target Career**: AI & Software Engineer\n- **Placement Readiness Match**: **88%**\n\n**Strongest Areas**:\n- Problem Solving & Algorithms (85%)\n- NLP & Deep Learning frameworks\n\nAlex is well-positioned for top tier tech campus recruitment drives starting next semester.`,
      type: "career_guidance",
      actions: [{ label: "Academic Dashboard", route: "/parent/dashboard" }],
      cards: [
        {
          title: "Placement Match",
          badge: "88%",
          description: "High Readiness Profile",
          status: "safe",
        },
      ],
      sourcesUsed: [...sources, "Placement System"],
    };
  }

  // FALLBACK GENERAL CHAT
  if (isTamil) {
    return {
      content: `வணக்கம் **${context.isParent ? context.parentName : context.studentName}** அவர்களே! 🙏 நான் உங்கள் **AURA பெற்றோர் கல்வி ஆலோசகர் (AURA AI Copilot)**.\n\nஉங்கள் குழந்தை **${name}** (${context.rollNumber})-ன்:\n- 📅 வருகைப் பதிவு (84%)\n- 📊 கல்வி மதிப்பெண்கள் & CGPA (8.80)\n- 👨‍🏫 வழிகாட்டி ஆசிரியர் Dr. சுரேஷ் சந்திப்பு விவரங்கள்\n- 📝 நிலுவை வீட்டுப்பாடங்கள் மற்றும் தேர்வுகள்\n\nகுறித்து தமிழில் எந்த கேள்வியையும் நீங்கள் கேட்கலாம். கல்லூரியின் ஆங்கில சுற்றறிக்கைகளையும் உடனுக்குடன் தமிழில் மொழிபெயர்த்து தருகிறேன். நான் உங்களுக்கு எவ்வாறு உதவட்டும்?`,
      type: "general_chat",
      actions: [
        { label: "வருகை விவரம்", route: "/parent/attendance" },
        { label: "கல்வி டாஷ்போர்டு", route: "/parent/dashboard" },
        { label: "அறிவிப்புகள்", route: "/parent/notifications" },
      ],
      cards: [
        {
          title: "குழந்தை விவரம்",
          badge: name,
          description: `Roll: ${context.rollNumber} • CGPA: ${context.cgpa} • Attendance: ${context.attendance}%`,
          status: "safe",
        },
      ],
      sourcesUsed: [...sources],
    };
  }

  return {
    content: `Hello **${context.isParent ? context.parentName : context.studentName}**! 👋 I am **AURA**, your intelligent academic advisory copilot.\n\nI can assist you with comprehensive updates regarding **${name}** (${context.rollNumber}):\n- 📅 Attendance monitoring (Current: ${context.attendance}%)\n- 📊 Exam marks, grades & CGPA (${context.cgpa})\n- 👨‍🏫 Mentor consultation details with Dr. Suresh R\n- 🌐 Instant English ⇄ Tamil translation for college circulars\n\nFeel free to ask in English or தமிழ்! What would you like to review today?`,
    type: "general_chat",
    actions: [
      { label: "Check Attendance", route: "/parent/attendance" },
      { label: "View Academic Dashboard", route: "/parent/dashboard" },
      { label: "Check Notifications", route: "/parent/notifications" },
    ],
    cards: [
      {
        title: "Student Overview",
        badge: name,
        description: `Roll: ${context.rollNumber} • CGPA: ${context.cgpa} • Attendance: ${context.attendance}%`,
        status: "safe",
      },
    ],
    sourcesUsed: [...sources],
  };
}

// ─── Process Chat Message ────────────────────────────────────
exports.processChat = async (userId, conversationId, messageText, mode = "auto", language = "en") => {
  const context = await exports.getStudentContext(userId);
  const intent = detectIntent(messageText, mode);

  // Check if Tamil language requested or Tamil characters present
  const isTamil = language === "ta" || language === "tamil" || /[\u0B80-\u0BFF]/.test(messageText);

  // Retrieve or Create Conversation
  let conversation;
  if (conversationId) {
    conversation = await AIConversation.findOne({ _id: conversationId, user: userId });
  }

  if (!conversation) {
    const title = messageText.length > 30 ? messageText.substring(0, 30) + "..." : messageText;
    conversation = await AIConversation.create({
      user: userId,
      title: title || (isTamil ? "புதிய கல்வி ஆலோசனை" : "New Academic Chat"),
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
  const llmPrompt = isTamil
    ? `${messageText}\n\n(Note: Reply in courteous, clear, natural academic Tamil suitable for an Indian college parent.)`
    : messageText;

  const llmText = await llmEngine.generateResponse({
    messages: [{ role: "user", content: llmPrompt }],
    context,
    intent,
    mode,
  });

  if (llmText) {
    responseData = {
      content: llmText,
      type: "llm_generated",
      actions: [
        { label: isTamil ? "வருகைப் பதிவு" : "Check Attendance", route: "/parent/attendance" },
        { label: isTamil ? "டாஷ்போர்டு" : "Parent Dashboard", route: "/parent/dashboard" },
      ],
      sourcesUsed: ["Gemini AI", "Student Academic Context"],
    };
  } else {
    responseData = await buildDeterministicResponse(userId, intent, messageText, context, isTamil);
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

// ─── Direct Academic Translator ─────────────────────────────
exports.translateText = async (text, sourceLang = "en", targetLang = "ta") => {
  return translatorService.translateAcademicText({ text, sourceLang, targetLang });
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

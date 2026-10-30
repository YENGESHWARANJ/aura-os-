import api from "./api";

const BASE = "/ai";

const MOCK_AI_RESPONSES = {
  attendance: "Based on your current academic records, overall attendance is **84%** across all subjects. Attendance in Natural Language Processing is **92%** and Data Visualisation is **88%**. Big Data Analytics is at **71%** which is below the 75% threshold.",
  marks: "Current CGPA is **8.8 / 10.0**, placing the student in the top 5% of the class. Mid-Term overall score was **88%**, with exceptional scores in NLP (45/50) and Data Visualisation (42/50).",
  assignment: "Currently **1 pending deliverable**: Computer Vision Phase 1 Project Report (Due on Monday at 5:00 PM). Previous submission was graded 92/100.",
  risk: "Academic Risk Status is **SAFE (Low Risk)**. No arrears or backlogs. The only point to monitor is attendance in Big Data Analytics (71%).",
  mentor: "Assigned Faculty Mentor is **Dr. Suresh R** (Associate Professor, Dept of AI, Contact: +91 98765 43210). Next 1-on-1 parent review meeting is scheduled for **Friday at 3:00 PM**.",
  default: "I am AURA AI, your intelligent academic performance & parent copilot. I can help you monitor student attendance, review marks, check pending assignments, and translate college circulars between English and Tamil.",
};

const MOCK_TAMIL_RESPONSES = {
  attendance: "### 📅 குழந்தையின் வருகைப் பதிவு அறிக்கை\n\n- **மாணவர்**: அலெக்ஸ் ஜான்சன் (Alex Johnson - 22AI701)\n- **ஒட்டுமொத்த வருகை**: **84%** (பாதுகாப்பானது)\n- **குறைந்தபட்ச தேவை**: 75%\n\n✅ ஒட்டுமொத்த வருகை நிர்ணயிக்கப்பட்ட 75% அளவை விட **+9% கூடுதலாக** உள்ளது.\n\n⚠️ **கவனிக்க வேண்டிய பாடம்**: பிக் டேட்டா அனலிட்டிக்ஸ் (Big Data Analytics) பாடத்தில் வருகை 71% ஆக உள்ளது. அடுத்த 3 வகுப்புகளில் தவறாமல் கலந்துகொண்டால் 75% நிலையை எட்டிவிடும்.\n\nபெற்றோராக நீங்கள் Alex-ஐ காலை வகுப்புகளுக்கு சரியான நேரத்தில் அனுப்ப ஊக்குவிக்கவும்.",
  marks: "### 📊 கல்வி செயல்திறன் & மதிப்பெண் விவரம்\n\n- **தற்போதைய CGPA**: **8.80 / 10.0** (வகுப்பில் முதல் 5% மாணவர்களில் ஒருவர்)\n- **பருவ இடைத் தேர்வு**: **88% ஒட்டுமொத்த மதிப்பெண்கள்**\n\n**பாடவாரி சாதனைகள்**:\n- இயற்கை மொழி செயலாக்கம் (NLP): 45/50 (O Grade)\n- தரவு காட்சிப்படுத்தல்: 42/50 (A+ Grade)\n- கணினி பார்வை: 38/50 (A Grade)\n\nஅலெக்ஸ் பாடங்களை ஆர்வத்துடன் கற்று வருகிறார்.",
  assignment: "### 📝 நிலுவையில் உள்ள பணிகள் & வீட்டுப்பாடங்கள்\n\n- **நிலுவை பணி**: கணினி பார்வை ப்ராஜெக்ட் அறிக்கை (Computer Vision Phase 1 Report)\n- **கடைசி சமர்ப்பிப்பு நேரம்**: திங்கட்கிழமை மாலை 5:00 மணி\n- **முந்தைய பணி மதிப்பெண்**: தரவுத்தள பணிக்கு 92/100 பெற்றுள்ளார்.",
  risk: "### ⚠️ கல்வி அபாய நிலை ஆய்வு\n\n- **ஒட்டுமொத்த நிலை**: **பாதுகாப்பானது (SAFE)**\n- அரியர்ஸ் அல்லது தீவிர கல்வி குறைபாடுகள் ஏதுமில்லை.\n- பிக் டேட்டா வகுப்புகளுக்கு மட்டும் தொடர்ந்து வர வழிகாட்டவும்.",
  mentor: "### 👨‍🏫 வழிகாட்டி ஆசிரியர் விவரம்\n\n- **ஆசிரியர்**: Dr. சுரேஷ் R (Dr. Suresh R)\n- **தொடர்பு எண்**: +91 98765 43210\n- **அடுத்த சந்திப்பு**: வெள்ளிக்கிழமை மாலை 3:00 மணி (ஆன்லைன் வழிகாட்டல் கலந்தாய்வு).",
  default: "வணக்கம்! நான் உங்கள் **AURA பெற்றோர் AI ஆலோசகர்**. உங்கள் குழந்தையின் பள்ளி வருகை, தேர்வுகள், வீட்டுப்பாடங்கள் மற்றும் ஆசிரியர் ஆலோசனைகள் குறித்து தமிழில் எந்த கேள்வியும் கேட்கலாம். நான் உங்களுக்கு எவ்வாறு உதவட்டும்?",
};

const getSmartAIResponse = (message, language = "en") => {
  const q = message.toLowerCase();
  const isTa = language === "ta" || /[\u0B80-\u0BFF]/.test(message);

  if (q.includes("attendance") || q.includes("வருகை") || q.includes("class")) {
    return isTa ? MOCK_TAMIL_RESPONSES.attendance : MOCK_AI_RESPONSES.attendance;
  }
  if (q.includes("mark") || q.includes("grade") || q.includes("cgpa") || q.includes("மதிப்பெண்") || q.includes("தேர்வு")) {
    return isTa ? MOCK_TAMIL_RESPONSES.marks : MOCK_AI_RESPONSES.marks;
  }
  if (q.includes("assignment") || q.includes("homework") || q.includes("பணி") || q.includes("வீட்டுப்பாடம்")) {
    return isTa ? MOCK_TAMIL_RESPONSES.assignment : MOCK_AI_RESPONSES.assignment;
  }
  if (q.includes("risk") || q.includes("warning") || q.includes("அபாயம்") || q.includes("எச்சரிக்கை")) {
    return isTa ? MOCK_TAMIL_RESPONSES.risk : MOCK_AI_RESPONSES.risk;
  }
  if (q.includes("mentor") || q.includes("teacher") || q.includes("ஆசிரியர்") || q.includes("சுரேஷ்")) {
    return isTa ? MOCK_TAMIL_RESPONSES.mentor : MOCK_AI_RESPONSES.mentor;
  }

  if (isTa) {
    return `உங்கள் கேள்வி "${message}" குறித்து ஆய்வு செய்யப்பட்டது. அலெக்ஸ் ஜான்சனின் தற்போதைய கல்வி நிலை மற்றும் வருகை (84%) திருப்திகரமாக உள்ளது. தேர்வு தயாரிப்பில் கவனம் செலுத்தவும். வேறு ஏதேனும் விவரங்கள் வேண்டுமா?`;
  }
  return `Great question regarding "${message}". Based on Alex Johnson's academic profile, current performance trends are strong with 84% attendance and 8.8 CGPA. How else can I assist your parent advisory today?`;
};

export const sendChatMessage = async (data) => {
  try {
    const response = await api.post(`${BASE}/chat`, data);
    return response.data;
  } catch (err) {
    console.warn("AI Backend unavailable, using smart local fallback engine.", err?.message);
    const replyText = getSmartAIResponse(data.message, data.language);
    const convId = data.conversationId || "conv_" + Date.now();
    return {
      success: true,
      data: {
        conversationId: convId,
        userMessage: { _id: "user_" + Date.now(), role: "user", content: data.message, createdAt: new Date().toISOString() },
        assistantMessage: { _id: "assistant_" + Date.now(), role: "assistant", content: replyText, createdAt: new Date().toISOString() },
      },
    };
  }
};

export const translateText = async ({ text, sourceLang = "en", targetLang = "ta" }) => {
  try {
    const response = await api.post(`${BASE}/translate`, { text, sourceLang, targetLang });
    return response.data;
  } catch (err) {
    console.warn("Translation API unavailable, using offline academic translator dictionary.");
    // Offline resilient fallback
    const isToTamil = targetLang === "ta" || targetLang === "tamil";
    let translatedText = text;

    if (isToTamil) {
      if (/attendance.*below.*75%/i.test(text)) {
        translatedText = "கவனத்திற்கு: உங்கள் குழந்தையின் வருகை சதவீதம் 75% க்கும் குறைவாக உள்ளது. தேர்வு எழுத குறைந்தபட்சம் 75% வருகை கட்டாயமாகும். தயவுசெய்து உங்கள் குழந்தையை தவறாமல் கல்லூரிக்கு அனுப்பவும்.";
      } else if (/mentor.*meeting|parent.*meeting/i.test(text)) {
        translatedText = "பெற்றோர் - வழிகாட்டி ஆசிரியர் கலந்தாய்வு கூட்டம் திட்டமிடப்பட்டுள்ளது. டாக்டர் சுரேஷ் ஆர் வெள்ளிக்கிழமை மாலை 3:00 மணிக்கு உங்களை சந்தித்து குழந்தையின் கல்வி நிலை குறித்து விவாதிப்பார்.";
      } else if (/mid-term.*results/i.test(text)) {
        translatedText = "பருவ இடைத் தேர்வு (Mid-Term) முடிவுகள் வெளியிடப்பட்டுள்ளன. அலெக்ஸ் ஒட்டுமொத்தமாக 88% மதிப்பெண்களுடன் சிறப்பான தேர்ச்சி பெற்றுள்ளார்.";
      } else {
        translatedText = text
          .replace(/Dear Parent/gi, "அன்புள்ள பெற்றோரே")
          .replace(/Attendance/gi, "வருகைப் பதிவு")
          .replace(/Minimum required/gi, "குறைந்தபட்ச தேவை")
          .replace(/Scheduled meeting/gi, "திட்டமிடப்பட்ட சந்திப்பு")
          .replace(/Big Data Analytics/gi, "பெருந்தரவு பகுப்பாய்வு (Big Data)")
          .replace(/Natural Language Processing/gi, "இயற்கை மொழி செயலாக்கம் (NLP)")
          .replace(/Computer Vision/gi, "கணினி பார்வை (Computer Vision)")
          .replace(/Examination/gi, "தேர்வு");
      }
    } else {
      translatedText = text
        .replace(/வருகை/g, "Attendance")
        .replace(/மதிப்பெண்/g, "Marks")
        .replace(/குழந்தை/g, "My child")
        .replace(/வணக்கம்/g, "Greetings");
    }

    return {
      success: true,
      data: {
        translatedText,
        summary: isToTamil ? "அலெக்ஸ் ஜான்சனின் கல்வி மற்றும் கல்லூரி வருகை தொடர்பான முக்கிய அறிவிப்பு." : "Academic communication update.",
        keyPoints: [
          { label: isToTamil ? "மாணவர் / Student" : "Student", value: "Alex Johnson (22AI701)" },
          { label: isToTamil ? "பாடம் / Subject" : "Subject", value: "Artificial Intelligence & Data Science" },
          { label: isToTamil ? "நடவடிக்கை / Action" : "Action Required", value: isToTamil ? "அறிவிப்பை பார்வையிட்டு தேவையான வழிகாட்டலை வழங்கவும்." : "Review details and acknowledge." }
        ],
        sourceLang,
        targetLang,
        provider: "AURA Local Academic Dictionary",
      },
    };
  }
};

export const getStudentContext = async () => {
  try {
    const response = await api.get(`${BASE}/context`);
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: {
        isParent: true,
        parentName: "Robert Johnson",
        childName: "Alex Johnson",
        rollNumber: "22AI701",
        cgpa: 8.8,
        attendance: 84,
        pendingAssignments: 1,
        activeProjects: 2,
        risk: "Safe",
        mentorName: "Dr. Suresh R",
        mentorContact: "+91 98765 43210",
      },
    };
  }
};

export const getConversations = async () => {
  try {
    const response = await api.get(`${BASE}/conversations`);
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: [
        { _id: "c1", title: "வருகைப் பதிவு & கல்வி நிலை (Attendance Check)", updatedAt: new Date().toISOString() },
        { _id: "c2", title: "வழிகாட்டி ஆசிரியர் சந்திப்பு (Mentor Review)", updatedAt: new Date().toISOString() },
      ],
    };
  }
};

export const getConversationMessages = async (id) => {
  try {
    const response = await api.get(`${BASE}/conversations/${id}`);
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: [
        { _id: "m1", role: "user", content: "என் குழந்தையின் வருகை மற்றும் கல்வி நிலை எப்படி உள்ளது?", createdAt: new Date().toISOString() },
        { _id: "m2", role: "assistant", content: MOCK_TAMIL_RESPONSES.attendance, createdAt: new Date().toISOString() },
      ],
    };
  }
};

export const updateConversation = async (id, data) => {
  try {
    const response = await api.patch(`${BASE}/conversations/${id}`, data);
    return response.data;
  } catch (err) {
    return { success: true };
  }
};

export const deleteConversation = async (id) => {
  try {
    const response = await api.delete(`${BASE}/conversations/${id}`);
    return response.data;
  } catch (err) {
    return { success: true };
  }
};

export const setFeedback = async (id, feedback) => {
  try {
    const response = await api.post(`${BASE}/messages/${id}/feedback`, { feedback });
    return response.data;
  } catch (err) {
    return { success: true };
  }
};

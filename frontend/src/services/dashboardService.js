const dashboardData = {
  projectMeta: {
    domain: "MOBILE APP DEVELOPMENT / EDUCATIONAL AI",
    title: "AI-Driven Mobile Application for Student Academic Performance Monitoring & Personalized Mentoring",
    aim: "To monitor student academic performance, predict future outcomes using AI, and provide personalized mentoring and study recommendations.",
    objectives: [
      "1. Track performance using marks, attendance, and assignment metrics.",
      "2. Predict future academic outcomes using ML algorithms.",
      "3. Identify weak subjects and learning gaps dynamically.",
      "4. Generate personalized study plans and mentoring guidance.",
      "5. Empower teachers and parents with progress tracking dashboards.",
      "6. Facilitate seamless student-teacher-parent communication.",
      "7. Enhance learning outcomes and student academic growth.",
    ],
  },

  welcome: {
    title: "WELCOME BACK",
    subtitle: "AI-Driven Academic Performance & Mentoring Platform",
    message: "Real-time monitoring of attendance, marks, AI performance predictions, and personalized study recommendations.",
  },

  aiInsights: {
    predictedGPA: "8.9 / 10.0",
    riskLevel: "Low Risk",
    accuracyConfidence: "94.2%",
    weakSubjects: [
      { subject: "Neural Networks", score: "68%", status: "Needs Improvement", action: "Review Layer Backpropagation" },
      { subject: "Data Structures", score: "74%", status: "Moderate", action: "Practice Binary Search Trees" },
    ],
    personalizedRecommendations: [
      "Complete 2 practice quizzes on Neural Networks by Friday.",
      "Maintain attendance above 85% in AI Fundamentals.",
      "Schedule mentor check-in with Prof. Nisha for semester goals.",
    ],
  },

  cards: [
    { title: "Attendance", value: "92%", detail: "This semester • On Track", color: "from-blue-500 to-sky-600" },
    { title: "CGPA", value: "8.6", detail: "Current GPA • AI Forecast: 8.9", color: "from-emerald-500 to-teal-600" },
    { title: "Pending Assignments", value: "3", detail: "Due this week", color: "from-violet-500 to-fuchsia-500" },
    { title: "Completed Projects", value: "7", detail: "This year", color: "from-orange-500 to-amber-500" },
  ],

  stats: {
    attendance: [
      { label: "Lectures", value: "92%" },
      { label: "Labs", value: "89%" },
      { label: "Tutorials", value: "95%" },
    ],
    performance: [
      { label: "Semester 1", value: "7.9" },
      { label: "Semester 2", value: "8.4" },
      { label: "Semester 3", value: "8.6" },
    ],
  },

  upcomingClasses: [
    { time: "09:00 AM", subject: "Data Structures", instructor: "Dr. Rao" },
    { time: "11:00 AM", subject: "AI Fundamentals", instructor: "Prof. Nisha" },
    { time: "02:00 PM", subject: "Software Engineering", instructor: "Ms. Priya" },
  ],

  upcomingExams: [
    { date: "Aug 10", subject: "Networks", status: "Revision" },
    { date: "Aug 15", subject: "Machine Learning", status: "Practice" },
    { date: "Aug 22", subject: "Web Security", status: "Review" },
  ],

  assignments: [
    { title: "UX Research Report", due: "Tomorrow", status: "Pending" },
    { title: "Database Schema", due: "Aug 12", status: "Pending" },
    { title: "React Dashboard", due: "Aug 18", status: "In Progress" },
  ],

  notifications: [
    { title: "Attendance alert", description: "Your attendance for AI Fundamentals is 89%.", time: "2h ago" },
    { title: "New assignment", description: "Study Planner assignment is available.", time: "5h ago" },
    { title: "AI Prediction Updated", description: "Predicted end-semester GPA recalculated to 8.9.", time: "1d ago" },
  ],

  mentorMessages: [
    { from: "Prof. Nisha", message: "Let's review your semester goals and weak subject remediation." },
    { from: "Ms. Priya", message: "Great progress on the AI dashboard UI draft." },
  ],
};

export const getProjectMeta = () => dashboardData.projectMeta;
export const getAiInsights = () => dashboardData.aiInsights;
export const getDashboardWelcome = () => dashboardData.welcome;
export const getDashboardCards = () => dashboardData.cards;
export const getDashboardAttendanceStats = () => dashboardData.stats.attendance;
export const getDashboardPerformanceStats = () => dashboardData.stats.performance;
export const getUpcomingClasses = () => dashboardData.upcomingClasses;
export const getUpcomingExams = () => dashboardData.upcomingExams;
export const getPendingAssignments = () => dashboardData.assignments;
export const getDashboardNotifications = () => dashboardData.notifications;
export const getMentorMessages = () => dashboardData.mentorMessages;

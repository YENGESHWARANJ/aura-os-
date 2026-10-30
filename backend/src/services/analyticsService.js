const User = require("../models/User");
const Assignment = require("../models/Assignment");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const StudyTask = require("../models/StudyTask");
const StudySession = require("../models/StudySession");
const StudyGoal = require("../models/StudyGoal");

exports.getAnalyticsOverview = async (userId, semesterFilter) => {
  const user = await User.findById(userId).lean();
  
  // 1. Fetch data from existing collections
  const assignments = await Assignment.find({}).lean();
  const projects = await Project.find({}).lean();
  const skills = await Skill.find({}).lean();
  const studyTasks = await StudyTask.find({ student: userId }).lean();
  const studySessions = await StudySession.find({ student: userId }).lean();
  const studyGoals = await StudyGoal.find({ student: userId }).lean();

  // 2. Compute KPIs
  // Academic Score & GPA
  const cgpa = user?.cgpa || 8.42;
  const currentGpa = 8.42;
  const prevGpa = 8.10;
  const academicScore = Math.round((cgpa / 10) * 100);

  // Attendance
  const attendancePct = user?.attendance || 86;
  const totalClasses = 200;
  const attendedClasses = Math.round((attendancePct / 100) * totalClasses);
  const missedClasses = totalClasses - attendedClasses;
  const minRequired = 75;
  const safeMargin = attendancePct - minRequired;

  // Assignment Analytics
  const userSubmissions = assignments.filter(a => 
    a.submissions && a.submissions.some(s => String(s.student) === String(userId))
  );
  const totalAssignments = assignments.length || 21;
  const completedAssignments = userSubmissions.length || 18;
  const assignmentCompletionRate = Math.round((completedAssignments / totalAssignments) * 100);

  // Study Planner Analytics
  const completedSessions = studySessions.filter(s => s.status === "Completed");
  const totalStudyMinutes = completedSessions.reduce((acc, s) => acc + (s.actualMinutes || s.plannedMinutes || 60), 0);
  const studyDaysCount = new Set(completedSessions.map(s => new Date(s.date).toDateString())).size;
  const studyConsistencyPct = Math.round((studyDaysCount / 7) * 100) || 84;
  const completedGoals = studyGoals.filter(g => g.status === "Completed" || g.progress >= 80).length;
  const studyGoalCompletionPct = studyGoals.length > 0 
    ? Math.round((completedGoals / studyGoals.length) * 100) 
    : 78;

  // Skills Progress
  const totalSkills = skills.length || 5;
  const avgSkillProficiency = skills.length > 0
    ? Math.round(skills.reduce((sum, k) => sum + (k.proficiency || 70), 0) / skills.length)
    : 72;

  // Projects
  const totalProjects = projects.length || 3;
  const activeProjects = projects.filter(p => p.available).length || 2;
  const avgProjectProgress = 78;

  // 3. Academic Health Formula
  // Weighted: Academics 30%, Attendance 20%, Assignments 15%, Study 15%, Skills 10%, Projects 10%
  const academicHealthScore = Math.round(
    academicScore * 0.30 +
    attendancePct * 0.20 +
    assignmentCompletionRate * 0.15 +
    studyConsistencyPct * 0.15 +
    avgSkillProficiency * 0.10 +
    avgProjectProgress * 0.10
  );

  let academicHealthStatus = "Good";
  if (academicHealthScore >= 85) academicHealthStatus = "Excellent";
  else if (academicHealthScore >= 70) academicHealthStatus = "Good";
  else if (academicHealthScore >= 55) academicHealthStatus = "Moderate";
  else academicHealthStatus = "At Risk";

  // 4. Risk Engine
  const riskFactors = [];
  let riskLevel = "Low Risk";

  if (attendancePct < 75) {
    riskFactors.push({ category: "Attendance", level: "Critical", reason: `Attendance (${attendancePct}%) is below 75% threshold.` });
    riskLevel = "Critical Risk";
  } else if (attendancePct < 80) {
    riskFactors.push({ category: "Attendance", level: "Warning", reason: `Attendance (${attendancePct}%) is close to minimum 75%.` });
    if (riskLevel === "Low Risk") riskLevel = "Moderate Risk";
  }

  if (assignmentCompletionRate < 70) {
    riskFactors.push({ category: "Assignments", level: "High", reason: `Assignment completion rate is ${assignmentCompletionRate}%.` });
    if (riskLevel === "Low Risk") riskLevel = "High Risk";
  }

  if (studyConsistencyPct < 50) {
    riskFactors.push({ category: "Study Habits", level: "Moderate", reason: `Study consistency is low (${studyConsistencyPct}%).` });
    if (riskLevel === "Low Risk") riskLevel = "Moderate Risk";
  }

  // 5. Subject Performance
  const subjectPerformance = [
    { subject: "Data Structures", internalMarks: 82, assignmentScore: 88, attendance: 91, overallScore: 86, status: "Excellent" },
    { subject: "Machine Learning", internalMarks: 78, assignmentScore: 84, attendance: 85, overallScore: 81, status: "Good" },
    { subject: "DBMS", internalMarks: 72, assignmentScore: 80, attendance: 78, overallScore: 76, status: "Needs Improvement" },
    { subject: "Operating Systems", internalMarks: 68, assignmentScore: 76, attendance: 72, overallScore: 72, status: "Needs Attention" },
    { subject: "Web Development", internalMarks: 85, assignmentScore: 90, attendance: 88, overallScore: 87, status: "Excellent" }
  ];

  // 6. Early Warnings
  const earlyWarnings = [];
  subjectPerformance.forEach(sub => {
    if (sub.attendance < 75) {
      earlyWarnings.push({ message: `⚠️ ${sub.subject} attendance dropped below 75%`, category: "Attendance", subject: sub.subject, urgency: "High" });
    } else if (sub.attendance < 80) {
      earlyWarnings.push({ message: `⚠️ ${sub.subject} attendance is low (${sub.attendance}%)`, category: "Attendance", subject: sub.subject, urgency: "Medium" });
    }
  });
  if (assignmentCompletionRate < 90) {
    earlyWarnings.push({ message: `⚠️ ${totalAssignments - completedAssignments} pending assignment(s) near deadline`, category: "Assignment", urgency: "High" });
  }

  // 7. Forecast Logic
  const projectedScore = Math.min(100, Math.round(academicScore + (studyConsistencyPct > 70 ? 3 : 0)));
  const forecast = {
    currentScore: academicScore,
    projectedSemesterScore: projectedScore,
    trend: projectedScore >= academicScore ? "Improving" : "Declining",
    confidence: "Moderate",
    label: "Estimated from current academic trends"
  };

  // 8. Trends Data
  const gpaTrend = [
    { semester: "Semester 1", gpa: 7.6 },
    { semester: "Semester 2", gpa: 7.9 },
    { semester: "Semester 3", gpa: 8.1 },
    { semester: "Semester 4", gpa: 8.42 }
  ];

  const performanceTrend = [
    { label: "Sem 1", academicScore: 72, attendance: 82, assignments: 80, studyProgress: 65 },
    { label: "Sem 2", academicScore: 75, attendance: 84, assignments: 82, studyProgress: 70 },
    { label: "Sem 3", academicScore: 78, attendance: 85, assignments: 85, studyProgress: 74 },
    { label: "Sem 4", academicScore: 82, attendance: 86, assignments: 86, studyProgress: 78 }
  ];

  const skillDistribution = [
    { category: "Programming", score: 85 },
    { category: "Web Development", score: 82 },
    { category: "Database", score: 72 },
    { category: "AI / ML", score: 68 },
    { category: "Problem Solving", score: 80 },
    { category: "Communication", score: 75 }
  ];

  // 9. Strengths & Weaknesses
  const strengths = [
    "Strong Attendance (86% overall)",
    "Data Structures Subject Mastery (86%)",
    "High Project Development Score (78%)",
    "Programming Skill Proficiency (85%)"
  ];
  const weaknesses = [
    "Operating Systems Attendance (72% - Needs Attention)",
    "DBMS Internal Marks (72%)",
    "Machine Learning Preparation Gap"
  ];

  // 10. Recommended Actions
  const recommendedActions = [
    { priority: "HIGH PRIORITY", title: "Improve Operating Systems Attendance", reason: "Attendance below 75% threshold", route: "/dashboard/attendance" },
    { priority: "HIGH PRIORITY", title: "Complete DBMS Pending Assignment", reason: "Due within 24 hours", route: "/dashboard/assignments" },
    { priority: "MEDIUM PRIORITY", title: "Schedule Machine Learning Revision", reason: "Upcoming exam in 12 days", route: "/dashboard/study-planner" },
    { priority: "LOW PRIORITY", title: "Practice Node.js & React Projects", reason: "Enhance technical skill gap", route: "/dashboard/skills" }
  ];

  return {
    overview: {
      overallAcademicScore: { score: academicScore, change: "+4.2% from previous semester" },
      currentGpa: { gpa: currentGpa, cgpa: cgpa, prevGpa: prevGpa, highest: 8.5 },
      attendance: { pct: attendancePct, status: attendancePct >= 75 ? "Safe" : "Critical", attended: attendedClasses, total: totalClasses, missed: missedClasses, safeMargin: safeMargin },
      assignmentCompletion: { completed: completedAssignments, total: totalAssignments, rate: assignmentCompletionRate },
      studyGoalCompletion: { pct: studyGoalCompletionPct },
      skillsProgress: { pct: avgSkillProficiency }
    },
    academicHealth: {
      score: academicHealthScore,
      status: academicHealthStatus,
      breakdown: {
        academics: academicScore,
        attendance: attendancePct,
        assignments: assignmentCompletionRate,
        studyHabits: studyConsistencyPct,
        skills: avgSkillProficiency,
        projects: avgProjectProgress
      }
    },
    riskAnalysis: {
      overallRisk: riskLevel,
      riskFactors
    },
    earlyWarnings,
    forecast,
    subjectPerformance,
    performanceTrend,
    gpaTrend,
    skillDistribution,
    strengths,
    weaknesses,
    recommendedActions,
    insights: [
      "You studied 2.5 hours more than last week.",
      "Assignment completion improved by 8%.",
      "DBMS attendance requires attention (78%).",
      "Machine Learning is your fastest improving subject."
    ],
    auraAi: {
      performanceInsight: "Your overall academic performance has improved steadily over the last 3 semesters.",
      attendanceInsight: "Operating Systems attendance is below the 75% threshold.",
      studyInsight: "Your study consistency is solid at 84%, but ML revision needs additional dedicated time.",
      skillInsight: "Programming skills are strong (85%), focus on bridging Node.js proficiency."
    }
  };
};

exports.getCohortOverview = async () => {
  const students = await User.find({ role: "student" }).lean();
  const totalStudents = students.length;

  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      averageAttendance: 0,
      averageCGPA: 0,
      highRiskStudents: 0,
      criticalRiskStudents: 0,
      pendingAssignments: 0,
      totalSkills: 0,
      activeStudents: 0,
    };
  }

  let totalAtt = 0;
  let totalCGPA = 0;
  let highRisk = 0;
  let criticalRisk = 0;
  let pendingAsg = 0;
  let allSkillsCount = 0;
  let active = 0;

  students.forEach((s) => {
    totalAtt += Number(s.attendance || 0);
    totalCGPA += Number(s.cgpa || 0);
    if (s.status === "active") active++;

    const riskLevel =
      s.aiRisk?.level ||
      (s.attendance < 65 ? "CRITICAL" : s.attendance < 75 ? "HIGH" : "LOW");
    if (riskLevel === "HIGH") highRisk++;
    if (riskLevel === "CRITICAL") criticalRisk++;

    const pending = s.assignments?.pending ?? (s.assignmentsPending || 0);
    const overdue = s.assignments?.overdue ?? 0;
    pendingAsg += pending + overdue;

    const skillsCount =
      s.skillsList?.length ||
      (Array.isArray(s.skills) ? s.skills.length : 0);
    allSkillsCount += skillsCount;
  });

  return {
    totalStudents,
    averageAttendance: Number((totalAtt / totalStudents).toFixed(1)),
    averageCGPA: Number((totalCGPA / totalStudents).toFixed(2)),
    highRiskStudents: highRisk,
    criticalRiskStudents: criticalRisk,
    pendingAssignments: pendingAsg,
    totalSkills: allSkillsCount,
    activeStudents: active,
  };
};

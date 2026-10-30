/**
 * AURA OS - 60 Demo Students Data Generator
 * Generates exactly 60 realistic demo students with mathematically valid distributions:
 * - Attendance: 12 Excellent, 18 Good, 12 Average, 10 Warning, 8 Critical (Total: 60)
 * - CGPA: 5.8 to 9.7 correlated with attendance and marks
 * - 6 Core B.Tech AI & Data Science subjects
 * - Deterministic AI Academic Risk scores
 */

const bcrypt = require("bcryptjs");
const ACADEMIC_CONFIG = require("../config/academicConfig");
const { calculateAIRisk } = require("../services/aiRiskEngine");

// 60 Unique realistic Indian student names
const INDIAN_STUDENT_NAMES = [
  // 1-12: Excellent Cohort
  { name: "Aarav Sharma", gender: "Male" },
  { name: "Ananya Iyer", gender: "Female" },
  { name: "Aditya Nair", gender: "Male" },
  { name: "Diya Kulkarni", gender: "Female" },
  { name: "Arjun Patel", gender: "Male" },
  { name: "Bhavya Reddy", gender: "Female" },
  { name: "Chetan Rao", gender: "Male" },
  { name: "Gayatri Pillai", gender: "Female" },
  { name: "Devansh Joshi", gender: "Male" },
  { name: "Ishaan Mehta", gender: "Male" },
  { name: "Janani Venkatesh", gender: "Female" },
  { name: "Karthik Subramanian", gender: "Male" },

  // 13-30: Good Cohort
  { name: "Kavya Deshmukh", gender: "Female" },
  { name: "Madhav Nambiar", gender: "Male" },
  { name: "Meera Bhatt", gender: "Female" },
  { name: "Mithun Hegde", gender: "Male" },
  { name: "Neha Choudhury", gender: "Female" },
  { name: "Nikhil Agarwal", gender: "Male" },
  { name: "Pooja Sundaram", gender: "Female" },
  { name: "Pranav Sen", gender: "Male" },
  { name: "Priya Balakrishnan", gender: "Female" },
  { name: "Rahul Swaminathan", gender: "Male" },
  { name: "Ranya Chatterjee", gender: "Female" },
  { name: "Rithvik Saxena", gender: "Male" },
  { name: "Rohan Banerjee", gender: "Male" },
  { name: "Roshni Bhatia", gender: "Female" },
  { name: "Sahil Malhotra", gender: "Male" },
  { name: "Sakshi Srivastava", gender: "Female" },
  { name: "Sameer Kulkarni", gender: "Male" },
  { name: "Sanjana Pillai", gender: "Female" },

  // 31-42: Average Cohort
  { name: "Sarvesh Nair", gender: "Male" },
  { name: "Shreya Natarajan", gender: "Female" },
  { name: "Siddharth Chauhan", gender: "Male" },
  { name: "Sneha Ramanathan", gender: "Female" },
  { name: "Soham Mukherjee", gender: "Male" },
  { name: "Soumya Mishra", gender: "Female" },
  { name: "Sparsh Tiwari", gender: "Male" },
  { name: "Sreenidhi Anand", gender: "Female" },
  { name: "Suraj Kashyap", gender: "Male" },
  { name: "Swati Deshpande", gender: "Female" },
  { name: "Tanmay Namboodiri", gender: "Male" },
  { name: "Tanvi Chawla", gender: "Female" },

  // 43-52: Warning Cohort
  { name: "Tarun Rajagopal", gender: "Male" },
  { name: "Trisha Sengupta", gender: "Female" },
  { name: "Utkarsh Pandey", gender: "Male" },
  { name: "Vaishnavi Acharya", gender: "Female" },
  { name: "Varun Ganguly", gender: "Male" },
  { name: "Vedant Mahajan", gender: "Male" },
  { name: "Vidya Srinivasan", gender: "Female" },
  { name: "Vignesh Jayaraman", gender: "Male" },
  { name: "Vikramaditya Das", gender: "Male" },
  { name: "Vinay Singhania", gender: "Male" },

  // 53-60: Critical Cohort
  { name: "Vrinda Raghavan", gender: "Female" },
  { name: "Yashvardhan Goel", gender: "Male" },
  { name: "Yukta Somayaji", gender: "Female" },
  { name: "Zeeshan Haque", gender: "Male" },
  { name: "Deepa Menon", gender: "Female" },
  { name: "Eashan Gupta", gender: "Male" },
  { name: "Harish Kumar", gender: "Male" },
  { name: "Aditi Verma", gender: "Female" },
];

const SKILL_POOL = [
  "Python", "Java", "JavaScript", "React", "Node.js", "MongoDB",
  "Machine Learning", "Deep Learning", "Data Science", "SQL",
  "Git", "Docker", "AWS", "Power BI", "TensorFlow",
  "PyTorch", "NLP", "Computer Vision", "Figma", "Communication",
];

const CERTIFICATION_POOL = [
  { name: "Python for Data Science", issuer: "IBM / Coursera" },
  { name: "Machine Learning Fundamentals", issuer: "Stanford Online / DeepLearning.AI" },
  { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services" },
  { name: "MongoDB Developer", issuer: "MongoDB University" },
  { name: "React Development", issuer: "Meta / Coursera" },
  { name: "Data Analytics Professional", issuer: "Google" },
  { name: "Generative AI Fundamentals", issuer: "DeepLearning.AI" },
];

async function generateDemoStudents() {
  const defaultPasswordHash = await bcrypt.hash("Demo@123", 10);
  const now = Date.now();
  const students = [];

  // Attendance targets matching Step 4:
  // Excellent: 12 students (90-98%)
  const excellentAttendance = [98, 97, 96, 95, 94, 94, 93, 92, 92, 91, 90, 90];
  // Good: 18 students (80-89%)
  const goodAttendance = [89, 88, 88, 87, 86, 86, 85, 84, 84, 83, 82, 82, 81, 81, 80, 80, 80, 80];
  // Average: 12 students (75-79%)
  const avgAttendance = [79, 79, 78, 78, 77, 77, 76, 76, 75, 75, 75, 75];
  // Warning: 10 students (65-74%)
  const warnAttendance = [74, 73, 72, 71, 70, 69, 68, 67, 66, 65];
  // Critical: 8 students (Below 65%)
  const critAttendance = [63, 61, 59, 58, 56, 54, 52, 49];

  // CGPA targets matching Step 5:
  // Excellent: 8.5–9.7
  const excellentCGPA = [9.68, 9.54, 9.42, 9.35, 9.21, 9.14, 9.05, 8.94, 8.86, 8.78, 8.65, 8.52];
  // Good: 7.5–8.49
  const goodCGPA = [8.48, 8.42, 8.35, 8.28, 8.22, 8.15, 8.08, 8.02, 7.95, 7.89, 7.82, 7.76, 7.70, 7.65, 7.60, 7.56, 7.52, 7.50];
  // Average: 6.5–7.49
  const avgCGPA = [7.45, 7.38, 7.30, 7.22, 7.15, 7.08, 7.00, 6.92, 6.84, 6.75, 6.66, 6.54];
  // Low: 5.8–6.49 (Warning + Critical)
  const lowCGPA = [
    6.48, 6.42, 6.35, 6.28, 6.20, 6.15, 6.10, 6.05, 6.00, 5.95, // 10 warning
    5.92, 5.89, 5.87, 5.85, 5.84, 5.82, 5.81, 5.80              // 8 critical
  ];

  const attendanceList = [
    ...excellentAttendance,
    ...goodAttendance,
    ...avgAttendance,
    ...warnAttendance,
    ...critAttendance,
  ];

  const cgpaList = [
    ...excellentCGPA,
    ...goodCGPA,
    ...avgCGPA,
    ...lowCGPA,
  ];

  for (let i = 0; i < 60; i++) {
    const studentIndex = i + 1;
    const padIndex = String(studentIndex).padStart(3, "0");
    const studentId = `${ACADEMIC_CONFIG.STUDENT_ID_PREFIX}${padIndex}`;
    const rollNumber = `${ACADEMIC_CONFIG.ROLL_PREFIX}${padIndex}`;
    const studentMeta = INDIAN_STUDENT_NAMES[i];
    const email = `${studentId.toLowerCase()}@aura.edu`;

    const totalWorkingDays = ACADEMIC_CONFIG.TOTAL_WORKING_DAYS; // 100
    const overallAttendance = attendanceList[i];
    const presentDays = overallAttendance;
    const absentDays = totalWorkingDays - presentDays; // mathematically valid

    const cgpa = cgpaList[i];
    const sgpa = Math.max(5.5, Math.min(10.0, Number((cgpa + (i % 2 === 0 ? 0.12 : -0.15)).toFixed(2))));

    // Mentors assignment round-robin
    const mentor = ACADEMIC_CONFIG.MENTORS[i % ACADEMIC_CONFIG.MENTORS.length];

    // Subjects and Marks generation (6 subjects)
    const baseMark = Math.min(98, Math.max(45, Math.round(cgpa * 10)));
    const subjects = ACADEMIC_CONFIG.SUBJECTS.map((sub, sIdx) => {
      const variation = ((sIdx * 3 + i * 5) % 15) - 7;
      const internalMarks = Math.max(40, Math.min(99, baseMark + variation));
      const assignmentMarks = Math.max(40, Math.min(100, baseMark + variation + 2));
      const quizMarks = Math.max(35, Math.min(100, baseMark - variation));
      const semesterMarks = Math.max(40, Math.min(98, baseMark + variation - 1));
      const totalMarks = Math.round(
        internalMarks * 0.3 + assignmentMarks * 0.2 + quizMarks * 0.1 + semesterMarks * 0.4
      );

      // Subject-wise attendance
      const subTotalDays = 16 + (sIdx % 3); // 16, 17, 18 classes
      const subPresentDays = Math.min(
        subTotalDays,
        Math.max(2, Math.round((subTotalDays * overallAttendance) / 100 + ((sIdx % 2 === 0 ? 1 : -1) * (i % 2))))
      );
      const subPercent = Math.round((subPresentDays / subTotalDays) * 100);

      return {
        subjectId: sub.subjectId,
        subjectName: sub.subjectName,
        attendance: subPercent,
        presentDays: subPresentDays,
        totalDays: subTotalDays,
        percent: subPercent,
        internalMarks,
        assignmentMarks,
        quizMarks,
        semesterMarks,
        totalMarks,
      };
    });

    // Subject-wise attendance details
    const subjectWiseAttendance = subjects.map((s) => ({
      subjectId: s.subjectId,
      subjectName: s.subjectName,
      attendance: s.attendance,
      presentDays: s.presentDays,
      totalDays: s.totalDays,
      percent: s.percent,
    }));

    // Average quiz marks across subjects
    const avgQuizMarks = Math.round(
      subjects.reduce((sum, s) => sum + s.quizMarks, 0) / subjects.length
    );

    // Assignment distribution based on cohort
    let totalAssignments = 6;
    let completedAssignments = 0;
    let pendingAssignments = 0;
    let overdueAssignments = 0;

    if (i < 12) {
      // Excellent
      completedAssignments = 6;
      pendingAssignments = 0;
      overdueAssignments = 0;
    } else if (i < 30) {
      // Good
      completedAssignments = 5;
      pendingAssignments = 1;
      overdueAssignments = 0;
    } else if (i < 42) {
      // Average
      completedAssignments = 4;
      pendingAssignments = 2;
      overdueAssignments = 0;
    } else if (i < 52) {
      // Warning
      completedAssignments = 3;
      pendingAssignments = 2;
      overdueAssignments = 1;
    } else {
      // Critical
      completedAssignments = 2;
      pendingAssignments = 2;
      overdueAssignments = 2;
    }

    // Assignment Objects
    const assignmentsList = ACADEMIC_CONFIG.SUBJECTS.map((sub, sIdx) => {
      let status = "COMPLETED";
      let submittedAt = new Date(now - (30 - sIdx * 4) * 86400000);
      let marks = Math.max(50, Math.min(100, baseMark + 2));

      if (sIdx >= completedAssignments) {
        if (sIdx < completedAssignments + pendingAssignments) {
          status = "PENDING";
          submittedAt = null;
          marks = null;
        } else {
          status = "OVERDUE";
          submittedAt = null;
          marks = null;
        }
      }

      const dueDate = status === "OVERDUE"
        ? new Date(now - (sIdx + 1) * 86400000)
        : new Date(now + (sIdx + 3) * 86400000);

      return {
        id: `ASG-${sub.subjectId}-${padIndex}`,
        title: `${sub.subjectName} Practical Exercise`,
        subject: sub.subjectName,
        dueDate,
        status,
        submittedAt,
        marks,
      };
    });

    // Skills generation: 3-12 skills per student
    const skillCount = 3 + (i % 10); // 3 to 12 skills
    const selectedSkills = [];
    const skillsList = [];
    const skillPoolCopy = [...SKILL_POOL];

    // Seeded selection
    for (let s = 0; s < skillCount; s++) {
      const idx = (i * 3 + s * 7) % skillPoolCopy.length;
      const skillName = skillPoolCopy[idx];
      if (!selectedSkills.includes(skillName)) {
        selectedSkills.push(skillName);
        skillsList.push({
          skillName,
          level: s < 2 ? "Advanced" : s < 5 ? "Intermediate" : "Beginner",
          verified: s % 2 === 0,
          earnedAt: new Date(now - (120 - s * 10) * 86400000),
        });
      }
    }

    // Certifications generation: 0-5 certifications
    const certCount = Math.max(0, Math.min(5, Math.floor((cgpa - 5.5) * 1.2) + (i % 2)));
    const certifications = [];
    for (let c = 0; c < certCount; c++) {
      const certDef = CERTIFICATION_POOL[(i + c) % CERTIFICATION_POOL.length];
      const isExpired = c === 3 && i % 3 === 0;
      const isPending = c === certCount - 1 && i % 2 !== 0;
      certifications.push({
        name: certDef.name,
        issuer: certDef.issuer,
        status: isExpired ? "EXPIRED" : isPending ? "PENDING" : "VERIFIED",
        issuedAt: new Date(now - (200 - c * 30) * 86400000),
        expiryDate: new Date(now + (365 - c * 40) * 86400000),
      });
    }

    // Study Progress
    const totalModules = 10;
    const completedModules = Math.max(2, Math.min(10, Math.round((cgpa / 10) * 10)));
    const weeklyProgress = Math.round((completedModules / totalModules) * 100);
    const monthlyProgress = Math.min(100, Math.round(weeklyProgress * 0.95 + (i % 5)));

    // AI Academic Risk Assessment
    const aiRisk = calculateAIRisk({
      attendance: overallAttendance,
      cgpa,
      assignments: {
        total: totalAssignments,
        completed: completedAssignments,
        pending: pendingAssignments,
        overdue: overdueAssignments,
      },
      quizMarks: avgQuizMarks,
      completedModules,
      totalModules,
      subjectMarks: subjects,
    });

    // Alerts (recent first)
    const alerts = [];
    if (aiRisk.level === "CRITICAL" || aiRisk.level === "HIGH") {
      alerts.push({
        id: `ALT-RISK-${padIndex}`,
        type: "RISK_ALERT",
        title: "Academic Risk Alert",
        message: `AI Risk Index is ${aiRisk.score} (${aiRisk.level}). Schedule mentor intervention.`,
        priority: aiRisk.level === "CRITICAL" ? "CRITICAL" : "HIGH",
        createdAt: new Date(now - 2 * 3600000), // 2 hours ago
      });
    }

    if (overallAttendance < 75) {
      alerts.push({
        id: `ALT-ATT-${padIndex}`,
        type: "ATTENDANCE_WARNING",
        title: "Attendance Below Threshold",
        message: `Current overall attendance is ${overallAttendance}%, which is below the mandatory 75%.`,
        priority: overallAttendance < 65 ? "CRITICAL" : "HIGH",
        createdAt: new Date(now - 14 * 3600000), // 14 hours ago
      });
    }

    if (overdueAssignments > 0) {
      alerts.push({
        id: `ALT-ASG-${padIndex}`,
        type: "ASSIGNMENT_OVERDUE",
        title: "Coursework Overdue",
        message: `${overdueAssignments} assignment(s) past deadline in B.Tech Semester 6 modules.`,
        priority: "HIGH",
        createdAt: new Date(now - 28 * 3600000), // 28 hours ago
      });
    }

    if (certifications.some((c) => c.status === "VERIFIED")) {
      alerts.push({
        id: `ALT-CERT-${padIndex}`,
        type: "CERTIFICATE_VERIFIED",
        title: "Certificate Verified",
        message: "Your cloud & AI credentials were authenticated by the department.",
        priority: "LOW",
        createdAt: new Date(now - 72 * 3600000), // 3 days ago
      });
    }

    // Notifications (recent first)
    const notificationsList = [
      {
        id: `NOTIF-${padIndex}-1`,
        type: "ACADEMIC",
        title: "Semester 6 Assessment Published",
        message: `Continuous assessment scores uploaded for ${subjects[0].subjectName}.`,
        priority: "MEDIUM",
        read: false,
        createdAt: new Date(now - 1 * 3600000),
      },
      {
        id: `NOTIF-${padIndex}-2`,
        type: "MENTOR",
        title: "Mentor Feedback Received",
        message: `${mentor.mentorName}: "Review upcoming midterm milestones and submit lab records."`,
        priority: "MEDIUM",
        read: true,
        createdAt: new Date(now - 24 * 3600000),
        readAt: new Date(now - 20 * 3600000),
      },
      {
        id: `NOTIF-${padIndex}-3`,
        type: "SYSTEM",
        title: "AI Risk Recalculation",
        message: `Your AI Academic Risk level was updated to ${aiRisk.level} (${aiRisk.score}%).`,
        priority: aiRisk.level === "CRITICAL" ? "HIGH" : "LOW",
        read: true,
        createdAt: new Date(now - 48 * 3600000),
        readAt: new Date(now - 46 * 3600000),
      },
    ];

    // Evidence Wallet
    const evidenceWallet = [
      {
        id: `EVID-${padIndex}-1`,
        type: "CAPSTONE_PROJECT",
        title: "AI Vision Defect Detector",
        description: "Edge-based neural network model for industrial defect classification.",
        verified: true,
        createdAt: new Date(now - 45 * 86400000),
      },
      {
        id: `EVID-${padIndex}-2`,
        type: "HACKATHON_AWARD",
        title: "Smart India Hackathon Finalist",
        description: "Built automated emergency dispatch routing system.",
        verified: true,
        createdAt: new Date(now - 70 * 86400000),
      },
    ];

    // Final student object matching User schema
    const student = {
      name: studentMeta.name,
      email,
      password: defaultPasswordHash,
      role: "student",
      studentId,
      rollNumber,
      isDemoData: true,
      phone: `+91 98765 ${String(10000 + i).slice(1)}`,
      college: ACADEMIC_CONFIG.COLLEGE,
      department: ACADEMIC_CONFIG.DEPARTMENT,
      program: ACADEMIC_CONFIG.PROGRAM,
      degree: ACADEMIC_CONFIG.DEGREE,
      specialization: "Artificial Intelligence",
      batch: ACADEMIC_CONFIG.BATCH,
      academicYear: ACADEMIC_CONFIG.ACADEMIC_YEAR,
      graduationYear: ACADEMIC_CONFIG.GRADUATION_YEAR,
      semester: ACADEMIC_CONFIG.SEMESTER,
      section: i < 30 ? "Sec A" : "Sec B",
      gender: studentMeta.gender,
      dob: new Date(`2004-0${((i % 9) + 1)}-${((i % 25) + 1)}`),
      status: "active",
      attendance: overallAttendance,
      cgpa,
      assignmentsPending: pendingAssignments + overdueAssignments,
      skills: selectedSkills,
      skillsList,
      certifications,
      attendanceDetails: {
        overall: overallAttendance,
        presentDays,
        absentDays,
        totalWorkingDays,
        subjectWise: subjectWiseAttendance,
      },
      academic: {
        cgpa,
        sgpa,
        internalMarks: subjects[0].internalMarks,
        assignmentMarks: subjects[0].assignmentMarks,
        quizMarks: avgQuizMarks,
        semesterMarks: subjects[0].semesterMarks,
      },
      subjects,
      assignments: {
        total: totalAssignments,
        completed: completedAssignments,
        pending: pendingAssignments,
        overdue: overdueAssignments,
        list: assignmentsList,
      },
      aiRisk,
      studyProgress: {
        weeklyProgress,
        monthlyProgress,
        completedModules,
        totalModules,
      },
      mentorInfo: {
        mentorId: mentor.mentorId,
        mentorName: mentor.mentorName,
        lastMeetingDate: new Date(now - ((i % 14) + 1) * 86400000),
      },
      alerts,
      notificationsList,
      evidenceWallet,
      lastActivityAt: new Date(now - (i % 60) * 60000),
    };

    students.push(student);
  }

  return students;
}

module.exports = {
  generateDemoStudents,
  INDIAN_STUDENT_NAMES,
};

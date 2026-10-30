const User = require("../models/User");
const Skill = require("../models/Skill");
const Project = require("../models/Project");
const Assignment = require("../models/Assignment");
const Notification = require("../models/Notification");
const { calculateAIRisk } = require("../services/aiRiskEngine");

// ── GET /api/v1/dashboard/overview & /api/dashboard/overview ──────
// Aggregates real student data from MongoDB for the dashboard cards & stats
exports.getOverview = async (req, res) => {
  try {
    const studentIdParam =
      req.query.studentId || req.headers["x-student-id"];

    let user = null;

    // 1. If explicit student identifier provided in query/headers
    if (studentIdParam) {
      const query = {
        role: "student",
        $or: [
          { studentId: studentIdParam },
          { rollNumber: studentIdParam },
          { email: studentIdParam.toLowerCase() },
        ],
      };
      if (studentIdParam.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: studentIdParam });
      }
      user = await User.findOne(query).select("-password -refreshToken").lean();
    }

    // 2. Lookup by authenticated user ID if not found yet
    if (!user && req.user?.id) {
      if (req.user.id.match(/^[0-9a-fA-F]{24}$/)) {
        user = await User.findById(req.user.id)
          .select("-password -refreshToken")
          .lean();
      }
    }

    // 3. Fallback for demo logins / test accounts: load first demo student from MongoDB
    if (!user) {
      user = await User.findOne({ isDemoData: true, role: "student" })
        .select("-password -refreshToken")
        .sort({ studentId: 1 })
        .lean();
    }

    // 4. Secondary fallback if database was empty
    if (!user) {
      user = await User.findOne({ role: "student" })
        .select("-password -refreshToken")
        .lean();
    }

    const userId = user?._id || req.user?.id;

    // Parallel fetch for associated relational collections if present
    const [skillDocsCount, projectDocsCount, assignmentDocsCount, unreadNotifCount] =
      await Promise.all([
        Skill.countDocuments({ student: userId }).catch(() => 0),
        Project.countDocuments({
          $or: [{ "team.student": userId }, { createdBy: userId }],
        }).catch(() => 0),
        Assignment.countDocuments({
          student: userId,
          status: { $in: ["pending", "draft", "PENDING"] },
        }).catch(() => 0),
        Notification.countDocuments({
          $or: [{ recipient: userId }, { receiverId: userId }],
          isRead: false,
        }).catch(() => 0),
      ]);

    // Use embedded values first, fallback to collection counts
    const skillCount =
      user.skillsList?.length ||
      (Array.isArray(user.skills) ? user.skills.length : 0) ||
      skillDocsCount ||
      6;

    const pendingAssignments =
      user.assignments?.pending !== undefined
        ? user.assignments.pending + (user.assignments.overdue || 0)
        : (user.assignmentsPending ?? assignmentDocsCount);

    const projectCount = user.projects?.length || projectDocsCount || 2;
    const unreadNotifications =
      (user.notificationsList ? user.notificationsList.filter((n) => !n.read).length : 0) ||
      unreadNotifCount;

    // Academic & Career Metrics
    const cgpa = Number(user.cgpa || 0);
    const attendance = Number(user.attendance || 0);
    const skillScore = Math.min(100, Math.round((skillCount / 10) * 100));
    const academicScore = cgpa > 0 ? Math.round((cgpa / 10) * 100) : 0;

    // AI Risk calculation / stored retrieval
    let aiRisk = user.aiRisk;
    if (!aiRisk || !aiRisk.score) {
      aiRisk = calculateAIRisk({
        attendance,
        cgpa,
        assignments: user.assignments || {
          total: 6,
          completed: Math.max(0, 6 - pendingAssignments),
          pending: pendingAssignments,
          overdue: 0,
        },
        quizMarks: user.academic?.quizMarks || 80,
        completedModules: user.studyProgress?.completedModules || 8,
        totalModules: user.studyProgress?.totalModules || 10,
        subjectMarks: user.subjects || [],
      });
    }

    // Profile completion
    const completionChecks = [
      !!user.name,
      !!user.email,
      !!user.phone,
      !!user.department,
      !!user.degree,
      !!(user.registerNumber || user.rollNumber || user.studentId),
      skillCount > 0,
      attendance > 0,
      cgpa > 0,
      Array.isArray(user.subjects) && user.subjects.length > 0,
    ];
    const profileCompletion = Math.round(
      (completionChecks.filter(Boolean).length / completionChecks.length) * 100
    );

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          id: user._id,
          studentId: user.studentId || "AURA2026AI001",
          rollNumber: user.rollNumber || user.registerNumber || "22AI701",
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || null,
          department: user.department || "Artificial Intelligence & Data Science",
          program: user.program || "B.Tech AI & Data Science",
          degree: user.degree || "B.Tech",
          semester: user.semester || 6,
          academicYear: user.academicYear || "2026-2027",
          section: user.section || "Sec A",
          college: user.college || "AURA Institute of Technology",
          batch: user.batch || "2023 - 2027",
          cgpa,
          attendance,
        },
        stats: {
          cgpa,
          attendance,
          pendingAssignments,
          skillCount,
          projectCount,
          unreadNotifications,
          profileCompletion,
        },
        aiRisk: {
          score: aiRisk.score,
          level: aiRisk.level,
          percentage: `${aiRisk.score}%`,
          factors: aiRisk.factors || [],
          explanation: aiRisk.explanation || "",
          calculatedAt: aiRisk.calculatedAt,
          components: {
            marks: aiRisk.components?.academicRisk !== undefined
              ? 100 - aiRisk.components.academicRisk
              : academicScore,
            attendance: aiRisk.components?.attendanceRisk !== undefined
              ? 100 - aiRisk.components.attendanceRisk
              : attendance,
            tasks: aiRisk.components?.assignmentRisk !== undefined
              ? 100 - aiRisk.components.assignmentRisk
              : 85,
            quizzes: aiRisk.components?.quizRisk !== undefined
              ? 100 - aiRisk.components.quizRisk
              : 80,
          },
        },
        careerReadiness: {
          overall: Math.round(
            skillScore * 0.35 +
              Math.min(100, (projectCount / 4) * 100) * 0.25 +
              academicScore * 0.25 +
              profileCompletion * 0.15
          ),
          technicalSkills: skillScore,
          academicPerformance: academicScore,
          profileCompletion,
        },
        attendanceDetails: user.attendanceDetails,
        subjects: user.subjects || [],
        assignments: user.assignments || {},
        alerts: user.alerts || [],
        notificationsList: user.notificationsList || [],
        evidenceWallet: user.evidenceWallet || [],
        mentorInfo: user.mentorInfo || {},
      },
    });
  } catch (err) {
    console.error("Dashboard overview error:", err);
    res.status(500).json({ success: false, message: "Failed to load dashboard" });
  }
};

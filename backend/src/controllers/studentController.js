const User = require("../models/User");
const ACADEMIC_CONFIG = require("../config/academicConfig");
const { calculateAIRisk } = require("../services/aiRiskEngine");

// Helper to find student by studentId, rollNumber, _id, or email
async function resolveStudent(identifier) {
  if (!identifier) return null;

  const query = {
    role: "student",
    $or: [
      { studentId: identifier },
      { rollNumber: identifier },
      { email: identifier.toLowerCase() },
    ],
  };

  // If identifier is a valid MongoDB ObjectId
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    query.$or.push({ _id: identifier });
  }

  let student = await User.findOne(query).select("-password -refreshToken").lean();

  // If not found and identifier is 'default' or demo id, fallback to first demo student
  if (!student && (identifier === "default" || identifier.startsWith("demo-"))) {
    student = await User.findOne({ isDemoData: true, role: "student" })
      .select("-password -refreshToken")
      .sort({ studentId: 1 })
      .lean();
  }

  return student;
}

// ── GET /api/students & /api/v1/students ──────────────────────────
exports.getStudents = async (req, res) => {
  try {
    const {
      search,
      riskLevel,
      attendanceRange,
      semester,
      sortBy = "studentId",
      order = "asc",
      page = 1,
      limit = 60,
    } = req.query;

    const query = { role: "student" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (riskLevel) {
      query["aiRisk.level"] = riskLevel.toUpperCase();
    }

    if (semester) {
      query.semester = Number(semester);
    }

    if (attendanceRange) {
      if (attendanceRange === "excellent") query.attendance = { $gte: 90 };
      else if (attendanceRange === "good") query.attendance = { $gte: 80, $lt: 90 };
      else if (attendanceRange === "average") query.attendance = { $gte: 75, $lt: 80 };
      else if (attendanceRange === "warning") query.attendance = { $gte: 65, $lt: 75 };
      else if (attendanceRange === "critical") query.attendance = { $lt: 65 };
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === "desc" ? -1 : 1;

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .select("-password -refreshToken")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    return res.json({
      success: true,
      count: students.length,
      total,
      page: Number(page),
      limit: Number(limit),
      data: students,
    });
  } catch (error) {
    console.error("Get students error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/students/:studentId ─────────────────────────────────
exports.getStudentById = async (req, res) => {
  try {
    const student = await resolveStudent(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with identifier '${req.params.studentId}' not found`,
      });
    }

    return res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Get student by ID error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/students/:studentId/attendance ───────────────────────
exports.getStudentAttendance = async (req, res) => {
  try {
    const student = await resolveStudent(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student '${req.params.studentId}' not found`,
      });
    }

    const details = student.attendanceDetails || {
      overall: student.attendance || 0,
      presentDays: student.attendance || 0,
      absentDays: 100 - (student.attendance || 0),
      totalWorkingDays: 100,
      subjectWise: [],
    };

    return res.json({
      success: true,
      data: {
        overall: details.overall,
        presentDays: details.presentDays,
        absentDays: details.absentDays,
        totalWorkingDays: details.totalWorkingDays,
        subjectWise: details.subjectWise || [],
        thresholdStatus: details.overall >= 75 ? "SAFE" : "AT_RISK",
      },
    });
  } catch (error) {
    console.error("Get student attendance error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/students/:studentId/performance ──────────────────────
exports.getStudentPerformance = async (req, res) => {
  try {
    const student = await resolveStudent(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student '${req.params.studentId}' not found`,
      });
    }

    return res.json({
      success: true,
      data: {
        cgpa: student.cgpa || 0,
        sgpa: student.academic?.sgpa || student.cgpa || 0,
        academic: student.academic || {},
        subjects: student.subjects || [],
        aiRisk: student.aiRisk || {},
      },
    });
  } catch (error) {
    console.error("Get student performance error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/students/:studentId/assignments ──────────────────────
exports.getStudentAssignments = async (req, res) => {
  try {
    const student = await resolveStudent(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student '${req.params.studentId}' not found`,
      });
    }

    const assignments = student.assignments || {
      total: 0,
      completed: 0,
      pending: student.assignmentsPending || 0,
      overdue: 0,
      list: [],
    };

    return res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error("Get student assignments error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/students/:studentId/skills ───────────────────────────
exports.getStudentSkills = async (req, res) => {
  try {
    const student = await resolveStudent(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student '${req.params.studentId}' not found`,
      });
    }

    return res.json({
      success: true,
      data: {
        skills: student.skills || [],
        skillsList: student.skillsList || [],
        certifications: student.certifications || [],
      },
    });
  } catch (error) {
    console.error("Get student skills error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/students/:studentId/alerts ───────────────────────────
exports.getStudentAlerts = async (req, res) => {
  try {
    const student = await resolveStudent(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student '${req.params.studentId}' not found`,
      });
    }

    const alerts = (student.alerts || []).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error("Get student alerts error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/students/:studentId/notifications ────────────────────
exports.getStudentNotifications = async (req, res) => {
  try {
    const student = await resolveStudent(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student '${req.params.studentId}' not found`,
      });
    }

    const notifications = (student.notificationsList || []).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Get student notifications error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/v1/student/overview (Dynamic student overview) ───────
exports.getStudentOverview = async (req, res) => {
  try {
    const identifier = req.query.studentId || req.headers["x-student-id"] || req.user?.id;
    const student = await resolveStudent(identifier);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    return res.json({
      success: true,
      data: {
        studentId: student.studentId,
        rollNumber: student.rollNumber,
        name: student.name,
        cgpa: student.cgpa || 0,
        attendance: student.attendance || 0,
        pendingAssignments: student.assignments?.pending ?? student.assignmentsPending ?? 0,
        completedProjects: student.projects?.length || 0,
        enrolledCourses: student.subjects?.length || 6,
        aiForecast: Math.min(10.0, Number(((student.cgpa || 7.5) + 0.3).toFixed(2))),
        aiRisk: student.aiRisk || {},
      },
    });
  } catch (error) {
    console.error("Get student overview error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/v1/student/academics (Dynamic student academics) ──────
exports.getAcademics = async (req, res) => {
  try {
    const identifier = req.query.studentId || req.headers["x-student-id"] || req.user?.id;
    const student = await resolveStudent(identifier);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const courses = (student.subjects || []).map((sub) => ({
      code: sub.subjectId,
      name: sub.subjectName,
      credits: 4,
      internal: sub.internalMarks,
      endSem: sub.semesterMarks,
      total: sub.totalMarks,
      grade:
        sub.totalMarks >= 90
          ? "S"
          : sub.totalMarks >= 80
          ? "A"
          : sub.totalMarks >= 70
          ? "B"
          : sub.totalMarks >= 60
          ? "C"
          : "U",
      status: sub.totalMarks >= 50 ? "Passed" : "Needs Revision",
    }));

    return res.json({
      success: true,
      data: {
        cgpa: student.cgpa || 0,
        totalCredits: 124,
        courses,
      },
    });
  } catch (error) {
    console.error("Get academics error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/v1/student/attendance (Dynamic student attendance) ───
exports.getAttendance = async (req, res) => {
  try {
    const identifier = req.query.studentId || req.headers["x-student-id"] || req.user?.id;
    const student = await resolveStudent(identifier);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const attDetails = student.attendanceDetails || {
      overall: student.attendance,
      presentDays: student.attendance,
      absentDays: 100 - student.attendance,
      totalWorkingDays: 100,
      subjectWise: [],
    };

    return res.json({
      success: true,
      data: {
        overallPercentage: attDetails.overall,
        totalClasses: attDetails.totalWorkingDays,
        totalPresent: attDetails.presentDays,
        totalAbsent: attDetails.absentDays,
        subjects: attDetails.subjectWise,
      },
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Backward compatible sample cohort endpoint
exports.getSampleStudents = async (req, res) => {
  try {
    const students = await User.find({ isDemoData: true, role: "student" })
      .select("-password -refreshToken")
      .sort({ studentId: 1 })
      .lean();

    return res.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

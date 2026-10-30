const User = require("../../models/User");
const Assignment = require("../../models/Assignment");
const Notification = require("../../models/Notification");
const Skill = require("../../models/Skill");

const getFacultyDashboard = async (req, res) => {
  try {
    const facultyId = req.user.id;

    // Fetch the faculty user
    const facultyUser = await User.findById(facultyId)
      .select("-password -refreshToken")
      .lean();

    if (!facultyUser) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    // Parallel data queries — all wrapped in .catch() to prevent any single failure from blocking
    const [
      totalStudents,
      pendingAssignments,
      unreadNotifications,
    ] = await Promise.all([
      User.countDocuments({ role: "student", status: "active" }).catch(() => 0),
      Assignment.countDocuments({ createdBy: facultyId, status: "active" }).catch(() => 0),
      Notification.countDocuments({ recipient: facultyId, isRead: false }).catch(() => 0),
    ]);

    return res.json({
      success: true,
      data: {
        faculty: {
          name: facultyUser.name,
          email: facultyUser.email,
          department: facultyUser.department || "AI & Data Science",
          avatar: facultyUser.avatar || null,
        },
        stats: {
          totalStudents,
          pendingAssignments,
          unreadNotifications,
          // These fields come from embedded user data or defaults
          assignedSubjects: facultyUser.skills?.length || 3,
          todaysClasses: 2, // TODO: integrate timetable model when available
          pendingEvaluations: pendingAssignments,
          recentSubmissions: 0, // TODO: integrate assignment submissions when model is ready
        },
        facultyId,
      },
    });
  } catch (err) {
    console.error("Faculty dashboard error:", err);
    return res.status(500).json({ success: false, message: "Failed to load faculty dashboard" });
  }
};

module.exports = { getFacultyDashboard };

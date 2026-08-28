const getFacultyDashboard = async (req, res) => {
  const facultyId = req.user.id;

  return res.json({
    success: true,
    data: {
      totalStudents: 84,
      assignedSubjects: 3,
      todaysClasses: 2,
      pendingEvaluations: 5,
      attendanceSummary: {
        present: 220,
        absent: 18,
      },
      recentSubmissions: 8,
      academicAlerts: 2,
      facultyId,
    },
  });
};

module.exports = { getFacultyDashboard };

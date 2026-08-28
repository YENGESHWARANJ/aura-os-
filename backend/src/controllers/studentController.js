exports.getStudentOverview = async (req, res) => {
  res.json({
    success: true,
    data: {
      cgpa: 8.6,
      attendance: 92,
      pendingAssignments: 3,
      completedProjects: 7,
      enrolledCourses: 6,
      aiForecast: 8.9,
    },
  });
};

exports.getAcademics = async (req, res) => {
  res.json({
    success: true,
    data: {
      cgpa: 8.6,
      totalCredits: 124,
      courses: [
        { code: "22AI701", name: "Data Visualisation", credits: 4, internal: 88, endSem: 90, grade: "A+", status: "Passed" },
        { code: "22AI702", name: "Natural Language Processing", credits: 4, internal: 84, endSem: 86, grade: "A", status: "Passed" },
        { code: "22AI703", name: "Ethics and AI", credits: 3, internal: 92, endSem: 94, grade: "S", status: "Passed" },
        { code: "22AI704", name: "Machine Learning Lab", credits: 2, internal: 90, endSem: 92, grade: "S", status: "Passed" },
      ],
    },
  });
};

exports.getAttendance = async (req, res) => {
  res.json({
    success: true,
    data: {
      overallPercentage: 92,
      totalClasses: 250,
      totalPresent: 230,
      totalAbsent: 20,
      subjects: [
        { code: "22AI701", name: "Data Visualisation", total: 45, present: 21, absent: 24, percent: 46 },
        { code: "22AI702", name: "Natural Language Processing", total: 40, present: 34, absent: 6, percent: 85 },
        { code: "22AI703", name: "Ethics and AI", total: 42, present: 39, absent: 3, percent: 92 },
        { code: "22AI704", name: "Machine Learning Lab", total: 38, present: 35, absent: 3, percent: 92 },
      ],
    },
  });
};

exports.getParentOverview = async (req, res) => {
  res.json({
    success: true,
    data: {
      childName: "Yengeshwaran J",
      rollNumber: "7376222AD101",
      department: "Artificial Intelligence & Data Science",
      year: "3rd Year",
      cgpa: 8.6,
      attendance: 92,
      mentorName: "Dr. Ramesh Sharma",
      mentorContact: "ramesh@aura.edu",
      recentAlerts: [
        { id: "a1", type: "warning", message: "Operating Systems attendance is below 75%", date: "2026-08-18" },
        { id: "a2", type: "success", message: "Scored 92/100 in Data Science Project", date: "2026-08-15" },
      ],
    },
  });
};

exports.getChildAttendance = async (req, res) => {
  res.json({
    success: true,
    data: [
      { code: "22AI701", name: "Data Visualisation", total: 45, present: 21, absent: 24, percent: 46 },
      { code: "22AI702", name: "Natural Language Processing", total: 40, present: 34, absent: 6, percent: 85 },
      { code: "22AI703", name: "Ethics and AI", total: 42, present: 39, absent: 3, percent: 92 },
      { code: "22AI704", name: "Machine Learning Lab", total: 38, present: 35, absent: 3, percent: 92 },
    ],
  });
};

exports.getChildGrades = async (req, res) => {
  res.json({
    success: true,
    data: {
      cgpa: 8.6,
      semesters: [
        { sem: "Sem 1", gpa: 8.2 },
        { sem: "Sem 2", gpa: 8.4 },
        { sem: "Sem 3", gpa: 8.5 },
        { sem: "Sem 4", gpa: 8.6 },
        { sem: "Sem 5", gpa: 8.7 },
        { sem: "Sem 6", gpa: 8.6 },
      ],
    },
  });
};

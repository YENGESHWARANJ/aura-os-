const mentorRepository = require("../repositories/mentorRepository");
const notificationService = require("./notificationService");
const User = require("../models/User");

const getMentorDashboard = async (userId) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  const students = await mentorRepository.getAssignedStudents(mentor._id);
  const now = new Date();
  const upcomingMeetings = (mentor.meetings || [])
    .filter((meeting) => new Date(meeting.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const riskStudents = students.filter((student) => {
    const attendanceRisk = typeof student.attendance === "number" && student.attendance < 75;
    const cgpaRisk = typeof student.cgpa === "number" && student.cgpa < 6.0;
    return attendanceRisk || cgpaRisk;
  });

  return {
    assignedStudents: students.length,
    studentsRequiringAttention: riskStudents.length,
    upcomingMeetings: upcomingMeetings.slice(0, 4).map((meeting) => ({
      studentId: meeting.student,
      date: meeting.date,
      purpose: meeting.purpose,
      status: meeting.status,
    })),
    pendingFollowUps: (mentor.meetings || []).filter((meeting) => meeting.status === "follow-up").length,
    attendanceAlerts: riskStudents.filter((student) => typeof student.attendance === "number" && student.attendance < 75).length,
    academicAlerts: riskStudents.filter((student) => typeof student.cgpa === "number" && student.cgpa < 6.0).length,
    recentActivity: mentor.activity.slice(-5).reverse(),
  };
};

const getAssignedStudents = async (userId) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  return mentorRepository.getAssignedStudents(mentor._id);
};

const ensureStudentAuthorization = async (mentor, studentId, userRole) => {
  if (userRole === "admin") {
    return true;
  }
  return mentorRepository.findAssignedStudent(mentor, studentId);
};

const getStudentProgress = async (userId, studentId, userRole) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  const authorized = await ensureStudentAuthorization(mentor, studentId, userRole);
  if (!authorized) {
    return null;
  }

  const student = await User.findById(studentId).lean();
  if (!student) {
    return null;
  }

  return {
    id: student._id,
    name: student.name,
    email: student.email,
    college: student.college,
    department: student.department,
    semester: student.semester,
    cgpa: student.cgpa || 0,
    attendance: student.attendance || 0,
    skills: Array.isArray(student.skills) ? student.skills : [],
    projects: student.projects || [],
    assignmentsPending: student.assignmentsPending || 0,
    achievements: student.achievements || [],
    history: [
      { label: "Attendance review", value: `${student.attendance || 0}%`, date: "2024-05-18" },
      { label: "CGPA update", value: `${student.cgpa || 0}`, date: "2024-05-08" },
    ],
  };
};

const getRiskStudents = async (userId) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  const students = await mentorRepository.getAssignedStudents(mentor._id);
  return students.filter((student) => {
    const attendanceRisk = typeof student.attendance === "number" && student.attendance < 75;
    const cgpaRisk = typeof student.cgpa === "number" && student.cgpa < 6.0;
    return attendanceRisk || cgpaRisk || (student.assignmentsPending || 0) > 2;
  });
};

const getMeetings = async (userId) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  return mentor.meetings || [];
};

const createMeeting = async (userId, meetingData, userRole) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  const studentAuthorized = await ensureStudentAuthorization(mentor, meetingData.student, userRole);
  if (!studentAuthorized) {
    return null;
  }

  const meeting = await mentorRepository.addMeeting(mentor._id, meetingData);

  if (meeting) {
    notificationService.createNotification({
      recipient: meetingData.student,
      sender: userId,
      type: "MENTOR_MEETING",
      title: "Mentor meeting scheduled",
      message: `Your mentor scheduled a meeting on ${new Date(meetingData.date).toLocaleString()}.`,
      data: { meetingId: meeting._id },
      priority: "high",
    }).catch(() => undefined);
  }

  return meeting;
};

const getNotes = async (userId) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  return mentor.notes || [];
};

const createNote = async (userId, noteData, userRole) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  const studentAuthorized = await ensureStudentAuthorization(mentor, noteData.student, userRole);
  if (!studentAuthorized) {
    return null;
  }

  const note = await mentorRepository.addNote(mentor._id, noteData);

  if (note) {
    notificationService.createNotification({
      recipient: noteData.student,
      sender: userId,
      type: "MENTOR_MESSAGE",
      title: "New mentor note added",
      message: "Your mentor added a note for your progress.",
      data: { noteId: note._id },
      priority: "medium",
    }).catch(() => undefined);
  }

  return note;
};

const getGoals = async (userId) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  return mentor.goals || [];
};

const createGoal = async (userId, goalData, userRole) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  const studentAuthorized = await ensureStudentAuthorization(mentor, goalData.student, userRole);
  if (!studentAuthorized) {
    return null;
  }
  return mentorRepository.addGoal(mentor._id, goalData);
};

const updateGoal = async (userId, goalId, updates) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  return mentorRepository.updateGoal(mentor._id, goalId, updates);
};

const getRecommendations = async (userId) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  if ((mentor.recommendations || []).length > 0) {
    return mentor.recommendations;
  }
  return [
    { title: "Encourage project-based learning", description: "Recommend students work on one new project this term." },
    { title: "Review attendance trends weekly", description: "Identify students whose attendance drops below 80%." },
  ];
};

const getReports = async (userId) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  const students = await mentorRepository.getAssignedStudents(mentor._id);

  return {
    totalStudents: students.length,
    activeMeetings: (mentor.meetings || []).filter((meeting) => meeting.status === "scheduled").length,
    completedMeetings: (mentor.meetings || []).filter((meeting) => meeting.status === "completed").length,
    riskStudents: students.filter((student) => {
      const attendanceRisk = typeof student.attendance === "number" && student.attendance < 75;
      const cgpaRisk = typeof student.cgpa === "number" && student.cgpa < 6.0;
      return attendanceRisk || cgpaRisk || (student.assignmentsPending || 0) > 2;
    }).length,
  };
};

const getNotifications = async (userId) => {
  const mentor = await mentorRepository.findOrCreateMentor(userId);
  return mentor.notifications || [];
};

module.exports = {
  getMentorDashboard,
  getAssignedStudents,
  getStudentProgress,
  getRiskStudents,
  getMeetings,
  createMeeting,
  getNotes,
  createNote,
  getGoals,
  createGoal,
  updateGoal,
  getRecommendations,
  getReports,
};

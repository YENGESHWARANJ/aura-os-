const mentorService = require("../services/mentorService");

const getMentorDashboard = async (req, res) => {
  const data = await mentorService.getMentorDashboard(req.user.id);
  return res.json({ success: true, data });
};

const getAssignedStudents = async (req, res) => {
  const students = await mentorService.getAssignedStudents(req.user.id);
  return res.json({ success: true, data: students });
};

const getStudentProgress = async (req, res) => {
  const progress = await mentorService.getStudentProgress(req.user.id, req.params.studentId, req.user.role);
  if (!progress) {
    return res.status(403).json({ success: false, message: "Unauthorized student access" });
  }
  return res.json({ success: true, data: progress });
};

const getRiskStudents = async (req, res) => {
  const data = await mentorService.getRiskStudents(req.user.id);
  return res.json({ success: true, data });
};

const getMeetings = async (req, res) => {
  const meetings = await mentorService.getMeetings(req.user.id);
  return res.json({ success: true, data: meetings });
};

const createMeeting = async (req, res) => {
  const meeting = await mentorService.createMeeting(req.user.id, req.body, req.user.role);
  if (!meeting) {
    return res.status(403).json({ success: false, message: "Unauthorized to schedule meeting for this student" });
  }
  return res.json({ success: true, data: meeting });
};

const getNotes = async (req, res) => {
  const notes = await mentorService.getNotes(req.user.id);
  return res.json({ success: true, data: notes });
};

const createNote = async (req, res) => {
  const note = await mentorService.createNote(req.user.id, req.body, req.user.role);
  if (!note) {
    return res.status(403).json({ success: false, message: "Unauthorized to add note for this student" });
  }
  return res.json({ success: true, data: note });
};

const getGoals = async (req, res) => {
  const goals = await mentorService.getGoals(req.user.id);
  return res.json({ success: true, data: goals });
};

const createGoal = async (req, res) => {
  const goal = await mentorService.createGoal(req.user.id, req.body, req.user.role);
  if (!goal) {
    return res.status(403).json({ success: false, message: "Unauthorized to create goal for this student" });
  }
  return res.json({ success: true, data: goal });
};

const updateGoal = async (req, res) => {
  const goal = await mentorService.updateGoal(req.user.id, req.params.goalId, req.body);
  if (!goal) {
    return res.status(404).json({ success: false, message: "Goal not found" });
  }
  return res.json({ success: true, data: goal });
};

const getRecommendations = async (req, res) => {
  const recommendations = await mentorService.getRecommendations(req.user.id);
  return res.json({ success: true, data: recommendations });
};

const getNotifications = async (req, res) => {
  const notifications = await mentorService.getNotifications(req.user.id);
  return res.json({ success: true, data: notifications });
};

const getReports = async (req, res) => {
  const reports = await mentorService.getReports(req.user.id);
  return res.json({ success: true, data: reports });
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
  getNotifications,
  getReports,
};

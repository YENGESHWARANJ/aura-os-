import api from "../api";

export const getMentorDashboard = () => api.get("/mentor/dashboard");
export const getMentorAssignedStudents = () => api.get("/mentor/assigned-students");
export const getMentorStudentProgress = (studentId) => api.get(`/mentor/student-progress/${studentId}`);
export const getMentorRiskStudents = () => api.get("/mentor/risk-students");
export const getMentorMeetings = () => api.get("/mentor/meetings");
export const createMentorMeeting = (data) => api.post("/mentor/meetings", data);
export const getMentorNotes = () => api.get("/mentor/notes");
export const createMentorNote = (data) => api.post("/mentor/notes", data);
export const getMentorGoals = () => api.get("/mentor/goals");
export const createMentorGoal = (data) => api.post("/mentor/goals", data);
export const updateMentorGoal = (goalId, data) => api.patch(`/mentor/goals/${goalId}`, data);
export const getMentorRecommendations = () => api.get("/mentor/recommendations");
export const getMentorNotifications = () => api.get("/mentor/notifications");
export const getMentorReports = () => api.get("/mentor/reports");

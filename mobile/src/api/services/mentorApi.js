import api from "../client";

export const mentorApi = {
  getDashboard: async () => {
    const response = await api.get("/mentor/dashboard");
    return response.data;
  },

  getAssignedStudents: async () => {
    const response = await api.get("/mentor/assigned-students");
    return response.data;
  },

  getStudentProgress: async (studentId) => {
    const response = await api.get(`/mentor/student-progress/${studentId}`);
    return response.data;
  },

  getRiskStudents: async () => {
    const response = await api.get("/mentor/risk-students");
    return response.data;
  },

  getMeetings: async () => {
    const response = await api.get("/mentor/meetings");
    return response.data;
  },

  createMeeting: async (meetingData) => {
    const response = await api.post("/mentor/meetings", meetingData);
    return response.data;
  },

  getNotes: async () => {
    const response = await api.get("/mentor/notes");
    return response.data;
  },

  createNote: async (noteData) => {
    const response = await api.post("/mentor/notes", noteData);
    return response.data;
  },

  getGoals: async () => {
    const response = await api.get("/mentor/goals");
    return response.data;
  },

  createGoal: async (goalData) => {
    const response = await api.post("/mentor/goals", goalData);
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get("/mentor/recommendations");
    return response.data;
  },

  getReports: async () => {
    const response = await api.get("/mentor/reports");
    return response.data;
  },
};

export default mentorApi;

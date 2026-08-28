import api from "../client";

export const studentApi = {
  getOverview: async () => {
    const response = await api.get("/student/overview");
    return response.data;
  },

  getAcademics: async () => {
    const response = await api.get("/student/academics");
    return response.data;
  },

  getAttendance: async () => {
    const response = await api.get("/student/attendance");
    return response.data;
  },
};

export default studentApi;

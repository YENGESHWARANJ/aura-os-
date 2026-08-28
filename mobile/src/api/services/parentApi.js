import api from "../client";

export const parentApi = {
  getOverview: async () => {
    const res = await api.get("/parent/overview");
    return res.data;
  },
  getChildAttendance: async () => {
    const res = await api.get("/parent/attendance");
    return res.data;
  },
  getChildGrades: async () => {
    const res = await api.get("/parent/grades");
    return res.data;
  },
};

export default parentApi;

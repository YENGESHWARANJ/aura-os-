import api from "../client";

export const analyticsApi = {
  getOverview: async () => {
    const res = await api.get("/analytics/overview");
    return res.data;
  },
  getAttendanceAnalytics: async () => {
    const res = await api.get("/analytics/attendance");
    return res.data;
  },
  getAcademicAnalytics: async () => {
    const res = await api.get("/analytics/academics");
    return res.data;
  },
  getRiskAnalytics: async () => {
    const res = await api.get("/analytics/risk");
    return res.data;
  },
};

export default analyticsApi;

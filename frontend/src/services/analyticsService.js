import api from "./api";

export const getAnalyticsOverview = async (semester = "All") => {
  const response = await api.get("/analytics/overview", { params: { semester } });
  return response.data;
};

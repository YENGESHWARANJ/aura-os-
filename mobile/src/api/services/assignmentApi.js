import api from "../client";

export const assignmentApi = {
  getAssignments: async () => {
    const response = await api.get("/assignments");
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/assignments/stats");
    return response.data;
  },

  getUpcoming: async () => {
    const response = await api.get("/assignments/upcoming");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  submit: async (id, formData) => {
    const response = await api.post(`/assignments/${id}/submit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

export default assignmentApi;

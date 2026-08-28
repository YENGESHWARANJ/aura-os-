import api from "../client";

export const adminApi = {
  getStats: async () => {
    const res = await api.get("/admin/stats");
    return res.data;
  },
  getUsers: async (params = {}) => {
    const res = await api.get("/admin/users", { params });
    return res.data;
  },
  createUser: async (userData) => {
    const res = await api.post("/admin/users", userData);
    return res.data;
  },
  updateUser: async (id, userData) => {
    const res = await api.put(`/admin/users/${id}`, userData);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
  getDepartments: async () => {
    const res = await api.get("/admin/departments");
    return res.data;
  },
  getLogs: async () => {
    const res = await api.get("/admin/logs");
    return res.data;
  },
};

export default adminApi;

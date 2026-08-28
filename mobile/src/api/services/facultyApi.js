import api from "../client";

export const facultyApi = {
  getDashboard: async () => {
    const response = await api.get("/faculty/dashboard");
    return response.data;
  },
};

export default facultyApi;

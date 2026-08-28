import api from "../client";

export const projectApi = {
  getStats: async () => {
    const response = await api.get("/projects/stats");
    return response.data;
  },

  getBatches: async () => {
    const response = await api.get("/projects/batches");
    return response.data;
  },

  getBatchById: async (batchId) => {
    const response = await api.get(`/projects/batches/${batchId}`);
    return response.data;
  },

  getAvailableProjects: async () => {
    const response = await api.get("/projects/available");
    return response.data;
  },

  getStudentTeam: async () => {
    const response = await api.get("/projects/team");
    return response.data;
  },

  createTeam: async (teamData) => {
    const response = await api.post("/projects/teams/create", teamData);
    return response.data;
  },

  joinTeam: async (joinCode) => {
    const response = await api.post("/projects/teams/join", { joinCode });
    return response.data;
  },

  selectProject: async (projectId) => {
    const response = await api.post("/projects/select", { projectId });
    return response.data;
  },

  getSubmissions: async () => {
    const response = await api.get("/projects/submissions");
    return response.data;
  },
};

export default projectApi;

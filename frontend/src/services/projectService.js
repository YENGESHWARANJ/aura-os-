import api from "./api";

export const getProjectStats = async (studentId) => {
  const response = await api.get("/projects/stats", { params: { studentId } });
  return response.data;
};

export const getProjectBatches = async () => {
  const response = await api.get("/projects/batches");
  return response.data;
};

export const getBatchById = async (batchId) => {
  const response = await api.get(`/projects/batches/${batchId}`);
  return response.data;
};

export const getAvailableProjects = async (params = {}) => {
  const response = await api.get("/projects/available", { params });
  return response.data;
};

export const getStudentTeam = async (batchId) => {
  const response = await api.get("/projects/team", { params: { batchId } });
  return response.data;
};

export const createTeam = async (payload) => {
  const response = await api.post("/projects/teams/create", payload);
  return response.data;
};

export const joinTeam = async (payload) => {
  const response = await api.post("/projects/teams/join", payload);
  return response.data;
};

export const selectProject = async (payload) => {
  const response = await api.post("/projects/select", payload);
  return response.data;
};

export const getTeamSubmissions = async (teamId, phaseNumber) => {
  const response = await api.get("/projects/submissions", { params: { teamId, phaseNumber } });
  return response.data;
};

export const submitDeliverable = async (payload, file) => {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });
  const response = await api.post("/projects/deliverables/submit", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

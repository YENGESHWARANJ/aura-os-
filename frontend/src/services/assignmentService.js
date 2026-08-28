import api from "./api";

export const getAssignments = async (params = {}) => {
  const response = await api.get("/assignments", { params });
  return response.data;
};

export const getAssignmentStats = async () => {
  const response = await api.get("/assignments/stats");
  return response.data;
};

export const getUpcomingDeadlines = async () => {
  const response = await api.get("/assignments/upcoming");
  return response.data;
};

export const getAssignmentById = async (id) => {
  const response = await api.get(`/assignments/${id}`);
  return response.data;
};

export const submitAssignment = async (id, file, notes) => {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  if (notes) {
    formData.append("notes", notes);
  }

  const response = await api.post(`/assignments/${id}/submit`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const resubmitAssignment = async (id, file, notes) => {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  if (notes) {
    formData.append("notes", notes);
  }

  const response = await api.put(`/assignments/${id}/submission`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

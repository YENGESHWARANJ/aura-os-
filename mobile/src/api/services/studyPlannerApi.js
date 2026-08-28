import api from "../client";

export const studyPlannerApi = {
  getSchedule: async () => {
    const response = await api.get("/study-planner/schedule");
    return response.data;
  },

  getTasks: async () => {
    const response = await api.get("/study-planner/tasks");
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post("/study-planner/tasks", taskData);
    return response.data;
  },

  updateTask: async (taskId, updates) => {
    const response = await api.patch(`/study-planner/tasks/${taskId}`, updates);
    return response.data;
  },

  getGoals: async () => {
    const response = await api.get("/study-planner/goals");
    return response.data;
  },

  createGoal: async (goalData) => {
    const response = await api.post("/study-planner/goals", goalData);
    return response.data;
  },

  logSession: async (sessionData) => {
    const response = await api.post("/study-planner/sessions", sessionData);
    return response.data;
  },
};

export default studyPlannerApi;

import api from "./api";

const interventionService = {
  // Get student academic baseline and problem areas
  getStatus: async (studentId) => {
    const params = studentId ? { studentId } : {};
    const response = await api.get("/interventions/status", { params });
    return response.data;
  },

  // Run counterfactual simulation with scenario list
  simulate: async (scenarios = [], studentId = null) => {
    const payload = { scenarios };
    if (studentId) payload.studentId = studentId;
    const response = await api.post("/interventions/simulate", payload);
    return response.data;
  },

  // Get saved intervention plans
  getPlans: async () => {
    const response = await api.get("/interventions/plans");
    return response.data;
  },

  // Save/submit a new plan
  savePlan: async (planData) => {
    const response = await api.post("/interventions/plans", planData);
    return response.data;
  },

  // Mentor approval or feedback submission
  reviewPlan: async (planId, status, comment) => {
    const response = await api.patch(`/interventions/plans/${planId}/approval`, {
      status,
      comment,
    });
    return response.data;
  },
};

export default interventionService;

import api from "../client";

export const skillsApi = {
  getMySkills: async () => {
    const response = await api.get("/skills/my-skills");
    return response.data;
  },

  getAllSkills: async () => {
    const response = await api.get("/skills");
    return response.data;
  },

  addSkill: async (skillData) => {
    const response = await api.post("/skills", skillData);
    return response.data;
  },

  submitEvidence: async (evidenceData) => {
    const response = await api.post("/skills/evidence", evidenceData);
    return response.data;
  },

  getGoals: async () => {
    const response = await api.get("/skills/goals");
    return response.data;
  },

  createGoal: async (goalData) => {
    const response = await api.post("/skills/goals", goalData);
    return response.data;
  },
};

export default skillsApi;

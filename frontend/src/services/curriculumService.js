import api from "./api";

const curriculumService = {
  // Get curriculum intelligence observatory metrics
  getObservatory: async () => {
    const response = await api.get("/curriculum/observatory");
    return response.data;
  },

  // Submit faculty review and decision on a curriculum suggestion
  submitFacultyReview: async ({ suggestionId, decision, feedback }) => {
    const response = await api.post("/curriculum/review", {
      suggestionId,
      decision,
      feedback,
    });
    return response.data;
  },
};

export default curriculumService;

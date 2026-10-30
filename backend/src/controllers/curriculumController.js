const curriculumService = require("../services/curriculumService");

/**
 * Controller for Self-Evolving Curriculum and Skill Gap Observatory
 */
class CurriculumController {
  // GET /api/v1/curriculum/observatory
  async getObservatory(req, res) {
    try {
      const data = await curriculumService.getObservatoryMetrics();
      res.json({ success: true, data });
    } catch (err) {
      console.error("Curriculum getObservatory error:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to load curriculum observatory data" });
    }
  }

  // POST /api/v1/curriculum/review
  async submitReview(req, res) {
    try {
      const { suggestionId, decision, feedback } = req.body;
      if (!suggestionId || !decision) {
        return res.status(400).json({ success: false, message: "suggestionId and decision are required" });
      }

      const updatedSuggestion = await curriculumService.submitFacultyReview(
        req.user.id,
        req.user.name,
        { suggestionId, decision, feedback }
      );

      res.json({
        success: true,
        data: updatedSuggestion,
        message: "Faculty review recorded successfully",
      });
    } catch (err) {
      console.error("Curriculum submitReview error:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to record faculty review" });
    }
  }
}

module.exports = new CurriculumController();

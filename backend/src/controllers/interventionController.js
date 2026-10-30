const interventionService = require("../services/interventionService");

/**
 * Controller for Counterfactual Academic Intervention Simulator
 */
class InterventionController {
  // GET /api/v1/interventions/status
  async getStatus(req, res) {
    try {
      const studentId = req.query.studentId || req.user.id;
      const data = await interventionService.getStudentBaseline(studentId);
      res.json({ success: true, data });
    } catch (err) {
      console.error("Intervention getStatus error:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to get academic status" });
    }
  }

  // POST /api/v1/interventions/simulate
  async simulate(req, res) {
    try {
      const studentId = req.body.studentId || req.user.id;
      const { scenarios } = req.body; // Array of scenario IDs e.g. ["attendance_boost", "mentor_meetings"]
      const data = await interventionService.simulateScenarios(studentId, scenarios || []);
      res.json({ success: true, data });
    } catch (err) {
      console.error("Intervention simulate error:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to run simulation" });
    }
  }

  // GET /api/v1/interventions/plans
  async getPlans(req, res) {
    try {
      const data = await interventionService.getPlans(req.user.id, req.user.role);
      res.json({ success: true, data });
    } catch (err) {
      console.error("Intervention getPlans error:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to load intervention plans" });
    }
  }

  // POST /api/v1/interventions/plans
  async savePlan(req, res) {
    try {
      const plan = await interventionService.savePlan(req.user.id, req.body);
      res.status(201).json({ success: true, data: plan });
    } catch (err) {
      console.error("Intervention savePlan error:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to save intervention plan" });
    }
  }

  // PATCH /api/v1/interventions/plans/:id/approval
  async reviewPlan(req, res) {
    try {
      const { status, comment } = req.body;
      const plan = await interventionService.reviewPlan(req.params.id, req.user.id, { status, comment });
      res.json({ success: true, data: plan, message: `Intervention plan ${status} successfully` });
    } catch (err) {
      console.error("Intervention reviewPlan error:", err);
      res.status(500).json({ success: false, message: err.message || "Failed to review plan" });
    }
  }
}

module.exports = new InterventionController();

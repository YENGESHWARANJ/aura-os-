const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const skillController = require("../../controllers/skillController");

// All skill endpoints are protected by JWT authentication
router.use(authenticate);

router.get("/overview", skillController.getOverview);
router.get("/matrix", skillController.getSkillMatrix);
router.get("/gaps", skillController.getSkillGapAnalysis);
router.get("/readiness", skillController.getCareerReadiness);
router.get("/roadmap", skillController.getLearningRoadmap);
router.get("/goals", skillController.getSkillGoals);
router.post("/goals", skillController.createSkillGoal);
router.put("/goals/:id", skillController.updateSkillGoal);
router.delete("/goals/:id", skillController.deleteSkillGoal);

router.get("/evidence", skillController.getSkillEvidence);
router.post("/evidence", skillController.addSkillEvidence);

router.get("/assessments", skillController.getSkillAssessments);
router.get("/insights", skillController.getAIInsights);
router.get("/recommendations", skillController.getRecommendedSkills);
router.get("/activity", skillController.getRecentActivity);

router.get("/", skillController.getSkills);
router.post("/", skillController.addSkill);
router.put("/:id", skillController.updateSkill);
router.delete("/:id", skillController.deleteSkill);

module.exports = router;

const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const projectUpload = require("../../middleware/projectUploadMiddleware");
const {
  getStats,
  getBatches,
  getBatchById,
  getAvailableProjects,
  getStudentTeam,
  createTeam,
  joinTeam,
  selectProject,
  getTeamSubmissions,
  submitDeliverable
} = require("../../controllers/projectController");

router.use(authenticate);

router.get("/stats", getStats);
router.get("/batches", getBatches);
router.get("/batches/:batchId", getBatchById);
router.get("/available", getAvailableProjects);
router.get("/team", getStudentTeam);
router.post("/teams/create", createTeam);
router.post("/teams/join", joinTeam);
router.post("/select", selectProject);
router.get("/submissions", getTeamSubmissions);
router.post("/deliverables/submit", projectUpload.single("file"), submitDeliverable);

module.exports = router;

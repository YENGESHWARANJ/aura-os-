const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const upload = require("../../middleware/uploadMiddleware");
const {
  getAssignments,
  getAssignmentStats,
  getUpcomingDeadlines,
  getAssignmentById,
  submitAssignment
} = require("../../controllers/assignmentController");

router.use(authenticate);

router.get("/", getAssignments);
router.get("/stats", getAssignmentStats);
router.get("/upcoming", getUpcomingDeadlines);
router.get("/:id", getAssignmentById);
router.post("/:id/submit", upload.single("file"), submitAssignment);
router.put("/:id/submission", upload.single("file"), submitAssignment);

module.exports = router;

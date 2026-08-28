const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const authorize = require("../../middleware/auth/authorize");
const mentorController = require("../../controllers/mentorController");

router.get("/dashboard", authenticate, authorize("mentor", "admin"), mentorController.getMentorDashboard);
router.get("/assigned-students", authenticate, authorize("mentor", "admin"), mentorController.getAssignedStudents);
router.get("/student-progress/:studentId", authenticate, authorize("mentor", "admin"), mentorController.getStudentProgress);
router.get("/risk-students", authenticate, authorize("mentor", "admin"), mentorController.getRiskStudents);
router.get("/meetings", authenticate, authorize("mentor", "admin"), mentorController.getMeetings);
router.post("/meetings", authenticate, authorize("mentor", "admin"), mentorController.createMeeting);
router.get("/notes", authenticate, authorize("mentor", "admin"), mentorController.getNotes);
router.post("/notes", authenticate, authorize("mentor", "admin"), mentorController.createNote);
router.get("/goals", authenticate, authorize("mentor", "admin"), mentorController.getGoals);
router.post("/goals", authenticate, authorize("mentor", "admin"), mentorController.createGoal);
router.patch("/goals/:goalId", authenticate, authorize("mentor", "admin"), mentorController.updateGoal);
router.get("/recommendations", authenticate, authorize("mentor", "admin"), mentorController.getRecommendations);
router.get("/notifications", authenticate, authorize("mentor", "admin"), mentorController.getNotifications);
router.get("/reports", authenticate, authorize("mentor", "admin"), mentorController.getReports);

module.exports = router;

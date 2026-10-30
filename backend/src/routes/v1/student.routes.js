const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const studentCtrl = require("../../controllers/studentController");

// ── PUBLIC / DEMO ACCESSIBLE ENDPOINTS ─────────────────────────
// List all students (Step 13: GET /api/students)
router.get("/", studentCtrl.getStudents);
router.get("/sample", studentCtrl.getSampleStudents);

// Authenticated overview & academic endpoints
router.get("/overview", authenticate, studentCtrl.getStudentOverview);
router.get("/academics", authenticate, studentCtrl.getAcademics);
router.get("/attendance", authenticate, studentCtrl.getAttendance);

// ── STUDENT SPECIFIC ENDPOINTS (Step 13) ─────────────────────────
// Resolved by studentId (e.g. AURA2026AI001), rollNumber (22AI701), or Mongo _id
router.get("/:studentId", studentCtrl.getStudentById);
router.get("/:studentId/attendance", studentCtrl.getStudentAttendance);
router.get("/:studentId/performance", studentCtrl.getStudentPerformance);
router.get("/:studentId/assignments", studentCtrl.getStudentAssignments);
router.get("/:studentId/skills", studentCtrl.getStudentSkills);
router.get("/:studentId/alerts", studentCtrl.getStudentAlerts);
router.get("/:studentId/notifications", studentCtrl.getStudentNotifications);

module.exports = router;

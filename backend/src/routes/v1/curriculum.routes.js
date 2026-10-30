const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const authorize = require("../../middleware/auth/authorize");
const curriculumCtrl = require("../../controllers/curriculumController");

// Protect curriculum routes
router.use(authenticate);

// Observatory data readable by faculty, mentor, admin, student
router.get("/observatory", curriculumCtrl.getObservatory);

// Faculty review submissions (Faculty and Admin only)
router.post(
  "/review",
  authorize("faculty", "admin", "super-admin"),
  curriculumCtrl.submitReview
);

module.exports = router;

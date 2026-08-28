const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const authorize = require("../../middleware/auth/authorize");
const { getFacultyDashboard } = require("../../controllers/faculty/facultyDashboardController");

router.get("/dashboard", authenticate, authorize("faculty", "admin"), getFacultyDashboard);

module.exports = router;

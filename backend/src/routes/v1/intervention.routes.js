const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const authorize = require("../../middleware/auth/authorize");
const interventionCtrl = require("../../controllers/interventionController");

// Protect all intervention routes
router.use(authenticate);

// Student & Mentor simulation status and what-if calculations
router.get("/status", interventionCtrl.getStatus);
router.post("/simulate", interventionCtrl.simulate);

// Intervention Plans CRUD
router.get("/plans", interventionCtrl.getPlans);
router.post("/plans", interventionCtrl.savePlan);

// Mentor approval workflow (Mentor and Admin only)
router.patch(
  "/plans/:id/approval",
  authorize("mentor", "admin", "super-admin"),
  interventionCtrl.reviewPlan
);

module.exports = router;

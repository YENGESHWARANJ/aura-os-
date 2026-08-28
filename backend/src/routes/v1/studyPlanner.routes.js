const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const ctrl = require("../../controllers/studyPlannerController");

// All routes are protected
router.use(authenticate);

// Overview (aggregated)
router.get("/overview", ctrl.getOverview);

// Tasks
router.get("/tasks", ctrl.getTasks);
router.post("/tasks", ctrl.createTask);
router.put("/tasks/:id", ctrl.updateTask);
router.delete("/tasks/:id", ctrl.deleteTask);

// Sessions
router.get("/today", ctrl.getTodaySessions);
router.get("/schedule", ctrl.getSchedule);
router.post("/sessions", ctrl.createSession);
router.put("/sessions/:id", ctrl.updateSession);
router.post("/sessions/:id/start", ctrl.startSession);
router.post("/sessions/:id/complete", ctrl.completeSession);

// Deadlines
router.get("/deadlines", ctrl.getDeadlines);

// Analytics
router.get("/analytics", ctrl.getAnalytics);

// Goals
router.get("/goals", ctrl.getGoals);
router.post("/goals", ctrl.createGoal);
router.put("/goals/:id", ctrl.updateGoal);
router.delete("/goals/:id", ctrl.deleteGoal);

// Smart Plan
router.post("/generate-plan", ctrl.generatePlan);

// Needs Attention
router.get("/needs-attention", ctrl.getNeedsAttention);

// Weekly Insights
router.get("/insights", ctrl.getInsights);

module.exports = router;

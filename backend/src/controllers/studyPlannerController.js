const studyPlannerService = require("../services/studyPlannerService");

// ─── Overview ────────────────────────────────────────────
exports.getOverview = async (req, res) => {
  try {
    const data = await studyPlannerService.getOverview(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Study Planner overview error:", err);
    res.status(500).json({ success: false, message: "Failed to load overview" });
  }
};

// ─── Tasks ───────────────────────────────────────────────
exports.getTasks = async (req, res) => {
  try {
    const tasks = await studyPlannerService.getTasks(req.user.id, req.query);
    res.json({ success: true, data: tasks });
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ success: false, message: "Failed to load tasks" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, subject, type, dueDate, priority } = req.body;
    if (!title || !subject || !dueDate || !priority) {
      return res.status(400).json({
        success: false,
        message: "Title, subject, due date and priority are required",
      });
    }
    const task = await studyPlannerService.createTask(req.user.id, req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await studyPlannerService.updateTask(
      req.user.id,
      req.params.id,
      req.body
    );
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ success: false, message: "Failed to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await studyPlannerService.deleteTask(
      req.user.id,
      req.params.id
    );
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ success: false, message: "Failed to delete task" });
  }
};

// ─── Sessions ────────────────────────────────────────────
exports.getTodaySessions = async (req, res) => {
  try {
    const sessions = await studyPlannerService.getTodaySessions(req.user.id);
    res.json({ success: true, data: sessions });
  } catch (err) {
    console.error("Get today sessions error:", err);
    res.status(500).json({ success: false, message: "Failed to load sessions" });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const sessions = await studyPlannerService.getSchedule(
      req.user.id,
      req.query
    );
    res.json({ success: true, data: sessions });
  } catch (err) {
    console.error("Get schedule error:", err);
    res.status(500).json({ success: false, message: "Failed to load schedule" });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { subject, date, startTime, endTime } = req.body;
    if (!subject || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Subject, date, start time and end time are required",
      });
    }
    const result = await studyPlannerService.createSession(
      req.user.id,
      req.body
    );
    if (result.conflict) {
      return res.status(409).json({ success: false, ...result });
    }
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error("Create session error:", err);
    res.status(500).json({ success: false, message: "Failed to create session" });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await studyPlannerService.updateSession(
      req.user.id,
      req.params.id,
      req.body
    );
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }
    res.json({ success: true, data: session });
  } catch (err) {
    console.error("Update session error:", err);
    res.status(500).json({ success: false, message: "Failed to update session" });
  }
};

exports.startSession = async (req, res) => {
  try {
    const session = await studyPlannerService.startSession(
      req.user.id,
      req.params.id
    );
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }
    res.json({ success: true, data: session });
  } catch (err) {
    console.error("Start session error:", err);
    res.status(500).json({ success: false, message: "Failed to start session" });
  }
};

exports.completeSession = async (req, res) => {
  try {
    const session = await studyPlannerService.completeSession(
      req.user.id,
      req.params.id,
      req.body
    );
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }
    res.json({ success: true, data: session });
  } catch (err) {
    console.error("Complete session error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to complete session" });
  }
};

// ─── Deadlines ───────────────────────────────────────────
exports.getDeadlines = async (req, res) => {
  try {
    const deadlines = await studyPlannerService.getDeadlines(req.user.id);
    res.json({ success: true, data: deadlines });
  } catch (err) {
    console.error("Get deadlines error:", err);
    res.status(500).json({ success: false, message: "Failed to load deadlines" });
  }
};

// ─── Analytics ───────────────────────────────────────────
exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await studyPlannerService.getAnalytics(
      req.user.id,
      req.query
    );
    res.json({ success: true, data: analytics });
  } catch (err) {
    console.error("Get analytics error:", err);
    res.status(500).json({ success: false, message: "Failed to load analytics" });
  }
};

// ─── Goals ───────────────────────────────────────────────
exports.getGoals = async (req, res) => {
  try {
    const goals = await studyPlannerService.getGoals(req.user.id);
    res.json({ success: true, data: goals });
  } catch (err) {
    console.error("Get goals error:", err);
    res.status(500).json({ success: false, message: "Failed to load goals" });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const { title, targetValue, targetDate } = req.body;
    if (!title || !targetValue || !targetDate) {
      return res.status(400).json({
        success: false,
        message: "Title, target value and target date are required",
      });
    }
    const goal = await studyPlannerService.createGoal(req.user.id, req.body);
    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    console.error("Create goal error:", err);
    res.status(500).json({ success: false, message: "Failed to create goal" });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await studyPlannerService.updateGoal(
      req.user.id,
      req.params.id,
      req.body
    );
    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }
    res.json({ success: true, data: goal });
  } catch (err) {
    console.error("Update goal error:", err);
    res.status(500).json({ success: false, message: "Failed to update goal" });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await studyPlannerService.deleteGoal(
      req.user.id,
      req.params.id
    );
    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }
    res.json({ success: true, message: "Goal deleted" });
  } catch (err) {
    console.error("Delete goal error:", err);
    res.status(500).json({ success: false, message: "Failed to delete goal" });
  }
};

// ─── Smart Plan ──────────────────────────────────────────
exports.generatePlan = async (req, res) => {
  try {
    const plan = await studyPlannerService.generatePlan(req.user.id);
    res.json({ success: true, data: plan });
  } catch (err) {
    console.error("Generate plan error:", err);
    res.status(500).json({ success: false, message: "Failed to generate plan" });
  }
};

// ─── Needs Attention ─────────────────────────────────────
exports.getNeedsAttention = async (req, res) => {
  try {
    const items = await studyPlannerService.getNeedsAttention(req.user.id);
    res.json({ success: true, data: items });
  } catch (err) {
    console.error("Get needs attention error:", err);
    res.status(500).json({ success: false, message: "Failed to load attention items" });
  }
};

// ─── Weekly Insights ─────────────────────────────────────
exports.getInsights = async (req, res) => {
  try {
    const insights = await studyPlannerService.getInsights(req.user.id);
    res.json({ success: true, data: insights });
  } catch (err) {
    console.error("Get insights error:", err);
    res.status(500).json({ success: false, message: "Failed to load insights" });
  }
};

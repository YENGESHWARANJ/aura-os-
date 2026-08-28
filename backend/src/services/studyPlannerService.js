const StudyTask = require("../models/StudyTask");
const StudySession = require("../models/StudySession");
const StudyGoal = require("../models/StudyGoal");
const Assignment = require("../models/Assignment");
const Project = require("../models/Project");

// ─── Helpers ─────────────────────────────────────────────
const startOfDay = (d = new Date()) => {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  return s;
};
const endOfDay = (d = new Date()) => {
  const e = new Date(d);
  e.setHours(23, 59, 59, 999);
  return e;
};
const startOfWeek = (d = new Date()) => {
  const s = new Date(d);
  const day = s.getDay();
  s.setDate(s.getDate() - (day === 0 ? 6 : day - 1));
  s.setHours(0, 0, 0, 0);
  return s;
};
const endOfWeek = (d = new Date()) => {
  const s = startOfWeek(d);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
};

const minutesToHM = (m) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h ${min}m` : `${min}m`;
};

// ─── Overview (aggregated) ──────────────────────────────
exports.getOverview = async (studentId) => {
  const now = new Date();
  const todayStart = startOfDay();
  const todayEnd = endOfDay();
  const weekStart = startOfWeek();
  const weekEnd = endOfWeek();

  // Today's tasks
  const todayTasks = await StudyTask.find({
    student: studentId,
    dueDate: { $gte: todayStart, $lte: todayEnd },
  });
  const todayCompleted = todayTasks.filter((t) => t.status === "Completed").length;

  // Study time today
  const todaySessions = await StudySession.find({
    student: studentId,
    date: { $gte: todayStart, $lte: todayEnd },
    status: "Completed",
  });
  const studyTimeToday = todaySessions.reduce(
    (sum, s) => sum + (s.actualMinutes || 0),
    0
  );

  // Upcoming deadlines (next 30 days)
  const upcomingDeadlines = await StudyTask.find({
    student: studentId,
    dueDate: { $gte: now },
    status: { $nin: ["Completed"] },
  })
    .sort({ dueDate: 1 })
    .limit(10);

  // Weekly progress
  const weekTasks = await StudyTask.find({
    student: studentId,
    dueDate: { $gte: weekStart, $lte: weekEnd },
  });
  const weekCompleted = weekTasks.filter((t) => t.status === "Completed").length;
  const weekProgress = weekTasks.length > 0
    ? Math.round((weekCompleted / weekTasks.length) * 100)
    : 0;

  // Last week comparison
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(weekStart);
  lastWeekEnd.setMilliseconds(-1);
  const lastWeekTasks = await StudyTask.find({
    student: studentId,
    dueDate: { $gte: lastWeekStart, $lte: lastWeekEnd },
  });
  const lastWeekCompleted = lastWeekTasks.filter(
    (t) => t.status === "Completed"
  ).length;
  const lastWeekProgress = lastWeekTasks.length > 0
    ? Math.round((lastWeekCompleted / lastWeekTasks.length) * 100)
    : 0;
  const weekChange = weekProgress - lastWeekProgress;

  // Nearest deadline text
  let nearestDeadlineText = "None";
  if (upcomingDeadlines.length > 0) {
    const d = upcomingDeadlines[0].dueDate;
    const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    nearestDeadlineText =
      diff <= 0 ? "Today" : diff === 1 ? "Tomorrow" : `${diff} days`;
  }

  // Goals summary
  const goals = await StudyGoal.find({
    student: studentId,
    status: { $in: ["Active", "Behind"] },
  });

  // Recent activity (last 5 events)
  const recentTasks = await StudyTask.find({ student: studentId })
    .sort({ updatedAt: -1 })
    .limit(5)
    .lean();
  const recentSessions = await StudySession.find({ student: studentId })
    .sort({ updatedAt: -1 })
    .limit(5)
    .lean();
  const recentActivity = [...recentTasks.map(t => ({
    type: t.status === "Completed" ? "Completed Task" : "Updated Task",
    title: t.title,
    subject: t.subject,
    time: t.updatedAt,
  })), ...recentSessions.map(s => ({
    type: s.status === "Completed" ? "Completed Session" : s.status === "Rescheduled" ? "Rescheduled Session" : "Created Session",
    title: s.topic || s.subject,
    subject: s.subject,
    time: s.updatedAt,
  }))]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 8);

  // Recommendations (rule-based)
  const recommendations = generateRecommendations(
    todayTasks,
    upcomingDeadlines,
    goals,
    weekProgress
  );

  return {
    todayTasks: {
      total: todayTasks.length,
      completed: todayCompleted,
    },
    studyTime: {
      minutes: studyTimeToday,
      display: minutesToHM(studyTimeToday),
      goalMinutes: 240,
    },
    upcomingDeadlines: {
      total: upcomingDeadlines.length,
      nearest: nearestDeadlineText,
      items: upcomingDeadlines,
    },
    weeklyProgress: {
      percent: weekProgress,
      change: weekChange,
    },
    goals: goals.map((g) => ({
      _id: g._id,
      title: g.title,
      progress: g.progress,
      currentValue: g.currentValue,
      targetValue: g.targetValue,
      unit: g.unit,
    })),
    recentActivity,
    recommendations,
  };
};

// ─── Recommendations engine ──────────────────────────────
function generateRecommendations(todayTasks, deadlines, goals, weekProgress) {
  const recs = [];
  const now = new Date();

  // Check for overdue tasks
  const overdue = todayTasks.filter(
    (t) => t.status !== "Completed" && t.dueDate < now
  );
  overdue.forEach((t) => {
    recs.push({
      type: "urgent",
      message: `"${t.title}" is overdue. Complete it as soon as possible.`,
      taskId: t._id,
    });
  });

  // Check deadlines within 2 days
  deadlines.slice(0, 5).forEach((t) => {
    const diff = Math.ceil((t.dueDate - now) / (1000 * 60 * 60 * 24));
    if (diff <= 2 && diff >= 0) {
      recs.push({
        type: "high",
        message: `"${t.title}" is due ${diff === 0 ? "today" : diff === 1 ? "tomorrow" : `in ${diff} days`}. Complete it before starting lower-priority tasks.`,
        taskId: t._id,
      });
    }
  });

  // Check goals behind schedule
  goals.forEach((g) => {
    if (g.progress < 50 && g.status === "Active") {
      recs.push({
        type: "medium",
        message: `Your goal "${g.title}" is at ${g.progress}%. Schedule more study time to stay on track.`,
      });
    }
  });

  // Weekly progress
  if (weekProgress < 50) {
    recs.push({
      type: "medium",
      message: `Your weekly progress is currently ${weekProgress}%. Try to complete more tasks this week.`,
    });
  }

  return recs.slice(0, 6);
}

// ─── Tasks CRUD ──────────────────────────────────────────
exports.getTasks = async (studentId, query = {}) => {
  const filter = { student: studentId };

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.type) filter.type = query.type;
  if (query.subject) filter.subject = { $regex: query.subject, $options: "i" };
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { subject: { $regex: query.search, $options: "i" } },
      { topic: { $regex: query.search, $options: "i" } },
    ];
  }

  // Tab filters
  if (query.tab === "today") {
    filter.dueDate = { $gte: startOfDay(), $lte: endOfDay() };
  } else if (query.tab === "upcoming") {
    filter.dueDate = { $gt: endOfDay() };
    filter.status = { $ne: "Completed" };
  } else if (query.tab === "overdue") {
    filter.dueDate = { $lt: startOfDay() };
    filter.status = { $nin: ["Completed"] };
  } else if (query.tab === "completed") {
    filter.status = "Completed";
  }

  // Sort
  let sort = { dueDate: 1 };
  if (query.sort === "priority") {
    sort = { priority: -1, dueDate: 1 };
  } else if (query.sort === "newest") {
    sort = { createdAt: -1 };
  } else if (query.sort === "oldest") {
    sort = { createdAt: 1 };
  }

  const tasks = await StudyTask.find(filter).sort(sort).lean();

  // Auto-mark overdue
  const now = new Date();
  for (const t of tasks) {
    if (
      t.status !== "Completed" &&
      t.status !== "Overdue" &&
      new Date(t.dueDate) < startOfDay()
    ) {
      await StudyTask.findByIdAndUpdate(t._id, { status: "Overdue" });
      t.status = "Overdue";
    }
  }

  return tasks;
};

exports.createTask = async (studentId, data) => {
  const task = new StudyTask({ ...data, student: studentId });
  return task.save();
};

exports.updateTask = async (studentId, taskId, data) => {
  if (data.status === "Completed" && !data.completedAt) {
    data.completedAt = new Date();
  }
  const task = await StudyTask.findOneAndUpdate(
    { _id: taskId, student: studentId },
    data,
    { new: true }
  );
  return task;
};

exports.deleteTask = async (studentId, taskId) => {
  return StudyTask.findOneAndDelete({ _id: taskId, student: studentId });
};

// ─── Sessions ────────────────────────────────────────────
exports.getTodaySessions = async (studentId) => {
  const sessions = await StudySession.find({
    student: studentId,
    date: { $gte: startOfDay(), $lte: endOfDay() },
  })
    .sort({ startTime: 1 })
    .lean();

  // Auto-mark missed
  const now = new Date();
  const currentTime =
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0");

  for (const s of sessions) {
    if (s.status === "Scheduled" && s.endTime < currentTime) {
      await StudySession.findByIdAndUpdate(s._id, { status: "Missed" });
      s.status = "Missed";
    }
  }

  return sessions;
};

exports.getSchedule = async (studentId, query = {}) => {
  const filter = { student: studentId };

  if (query.startDate && query.endDate) {
    filter.date = {
      $gte: new Date(query.startDate),
      $lte: new Date(query.endDate),
    };
  } else {
    filter.date = {
      $gte: startOfWeek(),
      $lte: endOfWeek(),
    };
  }

  return StudySession.find(filter).sort({ date: 1, startTime: 1 }).lean();
};

exports.createSession = async (studentId, data) => {
  // Conflict detection
  const conflicts = await StudySession.find({
    student: studentId,
    date: {
      $gte: startOfDay(new Date(data.date)),
      $lte: endOfDay(new Date(data.date)),
    },
    status: { $nin: ["Missed", "Rescheduled"] },
    $or: [
      { startTime: { $lt: data.endTime }, endTime: { $gt: data.startTime } },
    ],
  });

  if (conflicts.length > 0) {
    return {
      conflict: true,
      conflictingSessions: conflicts,
      message: "Schedule conflict detected. Choose another time or reschedule the existing session.",
    };
  }

  // Calculate planned minutes
  const [sh, sm] = data.startTime.split(":").map(Number);
  const [eh, em] = data.endTime.split(":").map(Number);
  const plannedMinutes = (eh * 60 + em) - (sh * 60 + sm);

  const session = new StudySession({
    ...data,
    student: studentId,
    plannedMinutes: plannedMinutes > 0 ? plannedMinutes : 60,
  });

  return session.save();
};

exports.updateSession = async (studentId, sessionId, data) => {
  return StudySession.findOneAndUpdate(
    { _id: sessionId, student: studentId },
    data,
    { new: true }
  );
};

exports.startSession = async (studentId, sessionId) => {
  return StudySession.findOneAndUpdate(
    { _id: sessionId, student: studentId },
    { status: "In Progress", startedAt: new Date() },
    { new: true }
  );
};

exports.completeSession = async (studentId, sessionId, data = {}) => {
  const session = await StudySession.findOne({
    _id: sessionId,
    student: studentId,
  });
  if (!session) return null;

  const completedAt = new Date();
  let actualMinutes = data.actualMinutes || 0;
  if (session.startedAt && !actualMinutes) {
    actualMinutes = Math.round((completedAt - session.startedAt) / 60000);
  }

  session.status = "Completed";
  session.completedAt = completedAt;
  session.actualMinutes = actualMinutes;
  await session.save();

  // Update related task progress
  if (session.task) {
    const task = await StudyTask.findById(session.task);
    if (task) {
      task.actualMinutes = (task.actualMinutes || 0) + actualMinutes;
      if (task.estimatedMinutes > 0) {
        task.progress = Math.min(
          100,
          Math.round((task.actualMinutes / task.estimatedMinutes) * 100)
        );
      }
      await task.save();
    }
  }

  return session;
};

// ─── Analytics ───────────────────────────────────────────
exports.getAnalytics = async (studentId, query = {}) => {
  const now = new Date();
  let dateFilter;

  if (query.period === "today") {
    dateFilter = { $gte: startOfDay(), $lte: endOfDay() };
  } else if (query.period === "month") {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    dateFilter = { $gte: monthStart, $lte: monthEnd };
  } else {
    dateFilter = { $gte: startOfWeek(), $lte: endOfWeek() };
  }

  const sessions = await StudySession.find({
    student: studentId,
    date: dateFilter,
    status: "Completed",
  }).lean();

  const totalMinutes = sessions.reduce(
    (sum, s) => sum + (s.actualMinutes || 0),
    0
  );

  // Daily breakdown for the week
  const weekSessions = await StudySession.find({
    student: studentId,
    date: { $gte: startOfWeek(), $lte: endOfWeek() },
    status: "Completed",
  }).lean();

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dailyData = dayNames.map((name, i) => {
    const dayStart = new Date(startOfWeek());
    dayStart.setDate(dayStart.getDate() + i);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const daySessions = weekSessions.filter((s) => {
      const d = new Date(s.date);
      return d >= dayStart && d <= dayEnd;
    });
    const mins = daySessions.reduce(
      (sum, s) => sum + (s.actualMinutes || 0),
      0
    );
    return { day: name, minutes: mins, hours: Math.round((mins / 60) * 10) / 10 };
  });

  // Subject progress
  const allSessions = await StudySession.find({
    student: studentId,
    status: "Completed",
  }).lean();
  const allTasks = await StudyTask.find({ student: studentId }).lean();

  const subjectMap = {};
  allTasks.forEach((t) => {
    if (!subjectMap[t.subject]) {
      subjectMap[t.subject] = { total: 0, completed: 0 };
    }
    subjectMap[t.subject].total++;
    if (t.status === "Completed") subjectMap[t.subject].completed++;
  });

  const subjectProgress = Object.entries(subjectMap).map(
    ([subject, data]) => ({
      subject,
      progress:
        data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      total: data.total,
      completed: data.completed,
    })
  );

  // Study streak
  const streak = await calculateStreak(studentId);

  // Productivity score
  const allTaskCount = allTasks.length;
  const completedTasks = allTasks.filter(
    (t) => t.status === "Completed"
  ).length;
  const overdueTasks = allTasks.filter((t) => t.status === "Overdue").length;

  const taskScore = allTaskCount > 0 ? (completedTasks / allTaskCount) * 40 : 20;
  const overdueDeduction = Math.min(20, overdueTasks * 5);
  const streakBonus = Math.min(20, streak.current * 3);
  const consistencyScore = dailyData.filter((d) => d.minutes > 0).length * (20 / 7);
  const productivityScore = Math.min(
    100,
    Math.round(taskScore - overdueDeduction + streakBonus + consistencyScore)
  );

  return {
    totalMinutes,
    totalDisplay: minutesToHM(totalMinutes),
    completedSessions: sessions.length,
    averageDailyMinutes: Math.round(totalMinutes / 7),
    dailyData,
    subjectProgress,
    streak,
    productivityScore: Math.max(0, productivityScore),
  };
};

async function calculateStreak(studentId) {
  const sessions = await StudySession.find({
    student: studentId,
    status: "Completed",
  })
    .sort({ date: -1 })
    .lean();

  if (sessions.length === 0) {
    return { current: 0, longest: 0, weeklyGoal: { current: 0, target: 7 } };
  }

  // Current streak
  let currentStreak = 0;
  let checkDate = startOfDay();

  // Check if today has a session
  const todaySession = sessions.find(
    (s) => new Date(s.date) >= startOfDay() && new Date(s.date) <= endOfDay()
  );
  if (!todaySession) {
    // Check yesterday
    const yesterday = new Date(checkDate);
    yesterday.setDate(yesterday.getDate() - 1);
    checkDate = yesterday;
  }

  const dateSet = new Set(
    sessions.map((s) => startOfDay(new Date(s.date)).toISOString())
  );

  let d = new Date(checkDate);
  while (dateSet.has(startOfDay(d).toISOString())) {
    currentStreak++;
    d.setDate(d.getDate() - 1);
  }

  // Longest streak (simplified)
  let longestStreak = currentStreak;
  let tempStreak = 0;
  const sortedDates = [...dateSet].sort();
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);
      tempStreak = diff <= 1 ? tempStreak + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  // Weekly goal (how many days this week had sessions)
  const weekStart_ = startOfWeek();
  const weekDays = sessions.filter(
    (s) => new Date(s.date) >= weekStart_
  );
  const uniqueWeekDays = new Set(
    weekDays.map((s) => startOfDay(new Date(s.date)).toISOString())
  );

  return {
    current: currentStreak,
    longest: longestStreak,
    weeklyGoal: { current: uniqueWeekDays.size, target: 7 },
  };
}

// ─── Deadlines ───────────────────────────────────────────
exports.getDeadlines = async (studentId) => {
  const now = new Date();

  // Study task deadlines
  const taskDeadlines = await StudyTask.find({
    student: studentId,
    dueDate: { $gte: now },
    status: { $nin: ["Completed"] },
  })
    .sort({ dueDate: 1 })
    .limit(10)
    .lean();

  // Assignment deadlines
  let assignmentDeadlines = [];
  try {
    const assignments = await Assignment.find({
      status: "active",
      deadline: { $gte: now },
    })
      .sort({ deadline: 1 })
      .limit(5)
      .lean();
    assignmentDeadlines = assignments.map((a) => ({
      _id: a._id,
      title: a.title,
      subject: a.subject,
      dueDate: a.deadline,
      type: "Assignment",
      priority: a.priority || "Medium",
    }));
  } catch (e) {
    // Assignment module may not be available
  }

  const combined = [
    ...taskDeadlines.map((t) => ({
      _id: t._id,
      title: t.title,
      subject: t.subject,
      dueDate: t.dueDate,
      type: t.type,
      priority: t.priority,
    })),
    ...assignmentDeadlines,
  ].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return combined.slice(0, 15);
};

// ─── Needs Attention ─────────────────────────────────────
exports.getNeedsAttention = async (studentId) => {
  const now = new Date();
  const items = [];

  // Overdue tasks
  const overdueTasks = await StudyTask.find({
    student: studentId,
    status: "Overdue",
  }).lean();
  overdueTasks.forEach((t) => {
    const daysOverdue = Math.ceil((now - t.dueDate) / (1000 * 60 * 60 * 24));
    items.push({
      _id: t._id,
      title: t.title,
      type: "overdue",
      message: `Overdue by ${daysOverdue} day${daysOverdue > 1 ? "s" : ""}`,
    });
  });

  // Missed sessions
  const missed = await StudySession.find({
    student: studentId,
    status: "Missed",
    date: { $gte: startOfDay(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) },
  }).lean();
  missed.forEach((s) => {
    items.push({
      _id: s._id,
      title: s.subject + (s.topic ? ` - ${s.topic}` : ""),
      type: "missed",
      message: "Missed study session",
    });
  });

  // Goals behind schedule
  const behindGoals = await StudyGoal.find({
    student: studentId,
    status: "Behind",
  }).lean();
  behindGoals.forEach((g) => {
    items.push({
      _id: g._id,
      title: g.title,
      type: "goal_behind",
      message: `Goal at ${g.progress}% – behind schedule`,
    });
  });

  return items.slice(0, 10);
};

// ─── Goals ───────────────────────────────────────────────
exports.getGoals = async (studentId) => {
  return StudyGoal.find({ student: studentId }).sort({ targetDate: 1 }).lean();
};

exports.createGoal = async (studentId, data) => {
  const goal = new StudyGoal({ ...data, student: studentId });
  return goal.save();
};

exports.updateGoal = async (studentId, goalId, data) => {
  if (data.currentValue !== undefined && data.targetValue) {
    data.progress = Math.min(
      100,
      Math.round((data.currentValue / data.targetValue) * 100)
    );
    if (data.progress >= 100) {
      data.status = "Completed";
    }
  }
  return StudyGoal.findOneAndUpdate(
    { _id: goalId, student: studentId },
    data,
    { new: true }
  );
};

exports.deleteGoal = async (studentId, goalId) => {
  return StudyGoal.findOneAndDelete({ _id: goalId, student: studentId });
};

// ─── Smart Daily Plan Generator ──────────────────────────
exports.generatePlan = async (studentId) => {
  const today = startOfDay();
  const now = new Date();

  // 1. Fetch existing tasks
  let tasks = await StudyTask.find({
    student: studentId,
    status: { $in: ["Pending", "Scheduled", "In Progress", "Overdue"] },
  }).lean();

  // If student has no or few tasks, generate standard curriculum tasks
  if (!tasks || tasks.length < 3) {
    const defaultTaskSeeds = [
      {
        title: "Data Structures - Trees & Graphs",
        subject: "Data Structures",
        type: "Revision",
        topic: "Binary Search Trees, Traversal & Graph BFS/DFS",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: "High",
        estimatedMinutes: 60,
      },
      {
        title: "DBMS Assignment & Query Optimization",
        subject: "DBMS",
        type: "Assignment",
        topic: "SQL Joins, Indexing & Normalization",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        priority: "Urgent",
        estimatedMinutes: 90,
      },
      {
        title: "Machine Learning Regression Practice",
        subject: "Machine Learning",
        type: "Study",
        topic: "Linear Regression, Cost Function & Gradient Descent",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        priority: "Medium",
        estimatedMinutes: 60,
      },
      {
        title: "Computer Networks Protocols Review",
        subject: "Computer Networks",
        type: "Exam Preparation",
        topic: "TCP/IP Stack, Subnetting & Routing",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        priority: "High",
        estimatedMinutes: 60,
      },
    ];

    for (const seed of defaultTaskSeeds) {
      const created = await StudyTask.create({
        student: studentId,
        ...seed,
        status: "Pending",
        progress: 0,
      });
      tasks.push(created.toObject());
    }
  }

  // 2. Clear previous unsaved scheduled sessions for today or get existing
  const existingCompleted = await StudySession.find({
    student: studentId,
    date: { $gte: today, $lte: endOfDay() },
    status: "Completed",
  }).lean();

  // Remove existing pending/scheduled auto sessions to regenerate fresh plan
  await StudySession.deleteMany({
    student: studentId,
    date: { $gte: today, $lte: endOfDay() },
    status: "Scheduled",
  });

  // 3. Define intelligent daily time schedule
  const defaultScheduleSlots = [
    { start: "08:00 AM", end: "09:00 AM", startTime: "08:00", endTime: "09:00", duration: 60 },
    { start: "10:30 AM", end: "11:30 AM", startTime: "10:30", endTime: "11:30", duration: 60 },
    { start: "02:30 PM", end: "04:00 PM", startTime: "14:30", endTime: "16:00", duration: 90 },
    { start: "04:30 PM", end: "05:30 PM", startTime: "16:30", endTime: "17:30", duration: 60 },
    { start: "07:00 PM", end: "08:00 PM", startTime: "19:00", endTime: "20:00", duration: 60 },
  ];

  const planSlots = [];

  // Sort tasks by priority
  const priorityWeight = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
  tasks.sort((a, b) => (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1));

  for (let i = 0; i < defaultScheduleSlots.length; i++) {
    const slot = defaultScheduleSlots[i];
    const task = tasks[i % tasks.length];

    if (!task) break;

    // Create a real session in DB for today's plan
    const session = await StudySession.create({
      student: studentId,
      subject: task.subject,
      topic: task.topic || task.title,
      task: task._id,
      date: today,
      startTime: slot.start,
      endTime: slot.end,
      plannedMinutes: slot.duration,
      status: "Scheduled",
      priority: task.priority || "Medium",
    });

    planSlots.push({
      _id: session._id,
      taskId: task._id,
      title: task.title,
      subject: task.subject,
      topic: task.topic || task.title,
      time: `${slot.start} - ${slot.end}`,
      startTime: slot.start,
      endTime: slot.end,
      duration: slot.duration,
      priority: task.priority || "Medium",
      isBreak: false,
      reason:
        task.priority === "Urgent"
          ? "Urgent Deadline Approaching"
          : task.priority === "High"
          ? "High Priority Focus Subject"
          : "Daily Curriculum Goal Target",
    });

    // Add rest interval after intense sessions
    if (i === 1 || i === 3) {
      planSlots.push({
        title: "Short Rest & Hydration Break",
        time: i === 1 ? "11:30 AM - 11:45 AM" : "05:30 PM - 05:45 PM",
        isBreak: true,
        duration: 15,
        reason: "Mental Refresh & Energy Recovery",
      });
    }
  }

  return planSlots;
};

// ─── Weekly Insights ─────────────────────────────────────
exports.getInsights = async (studentId) => {
  const weekStart_ = startOfWeek();
  const weekEnd_ = endOfWeek();

  const weekSessions = await StudySession.find({
    student: studentId,
    date: { $gte: weekStart_, $lte: weekEnd_ },
    status: "Completed",
  }).lean();

  const weekTasks = await StudyTask.find({
    student: studentId,
    updatedAt: { $gte: weekStart_, $lte: weekEnd_ },
  }).lean();

  const totalMinutes = weekSessions.reduce(
    (sum, s) => sum + (s.actualMinutes || 0),
    0
  );
  const completedTasks = weekTasks.filter(
    (t) => t.status === "Completed"
  ).length;

  // Most studied subject
  const subjectTime = {};
  weekSessions.forEach((s) => {
    subjectTime[s.subject] =
      (subjectTime[s.subject] || 0) + (s.actualMinutes || 0);
  });
  const mostStudied =
    Object.entries(subjectTime).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  // Goals
  const goals = await StudyGoal.find({
    student: studentId,
    status: { $in: ["Active", "Completed", "Behind"] },
  }).lean();
  const goalCompletion =
    goals.length > 0
      ? Math.round(
          goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
        )
      : 0;

  // Consistency (how many days this week had sessions)
  const uniqueDays = new Set(
    weekSessions.map((s) => startOfDay(new Date(s.date)).toISOString())
  );
  const consistency = Math.round((uniqueDays.size / 7) * 100);

  return {
    totalStudyTime: minutesToHM(totalMinutes),
    totalMinutes,
    tasksCompleted: { done: completedTasks, total: weekTasks.length },
    sessionsCompleted: { done: weekSessions.length, total: weekSessions.length },
    mostStudiedSubject: mostStudied,
    goalCompletion,
    consistency,
  };
};

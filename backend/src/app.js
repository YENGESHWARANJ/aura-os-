const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

// Routes Imports
const authRoutes = require("./routes/v1/auth.routes");
const studentRoutes = require("./routes/v1/student.routes");
const facultyRoutes = require("./routes/v1/faculty.routes");
const mentorRoutes = require("./routes/v1/mentor.routes");
const parentRoutes = require("./routes/v1/parent.routes");
const adminRoutes = require("./routes/v1/admin.routes");
const notificationRoutes = require("./routes/v1/notification.routes");
const assignmentRoutes = require("./routes/v1/assignment.routes");
const projectRoutes = require("./routes/v1/project.routes");
const skillRoutes = require("./routes/v1/skill.routes");
const studyPlannerRoutes = require("./routes/v1/studyPlanner.routes");
const analyticsRoutes = require("./routes/v1/analytics.routes");
const aiRoutes = require("./routes/v1/ai.routes");
const profileRoutes = require("./routes/v1/profile.routes");
const settingsRoutes = require("./routes/v1/settings.routes");

const app = express();

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Mount v1 Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/mentor", mentorRoutes);
app.use("/api/v1/parent", parentRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/assignments", assignmentRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/skills", skillRoutes);
app.use("/api/v1/study-planner", studyPlannerRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/settings", settingsRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AURA OS Backend API v1 Running 🚀",
  });
});

module.exports = app;
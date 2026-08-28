const mongoose = require("mongoose");

const StudySessionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    topic: { type: String, trim: true },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudyTask",
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // "HH:mm" format
    endTime: { type: String, required: true },
    plannedMinutes: { type: Number, default: 60 },
    actualMinutes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Missed", "Rescheduled"],
      default: "Scheduled",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    sessionType: {
      type: String,
      enum: ["Focus", "Deep Study", "Pomodoro", "Custom"],
      default: "Focus",
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    relatedAssignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
    },
    relatedExam: { type: String, default: "" },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

StudySessionSchema.index({ student: 1, date: 1 });
StudySessionSchema.index({ student: 1, status: 1 });

module.exports = mongoose.model("StudySession", StudySessionSchema);

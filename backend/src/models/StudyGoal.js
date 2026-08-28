const mongoose = require("mongoose");

const StudyGoalSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "Study Hours",
        "Topic Completion",
        "Practice Days",
        "Task Completion",
        "Exam Preparation",
        "Custom",
      ],
      default: "Study Hours",
    },
    subject: { type: String, trim: true },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    unit: {
      type: String,
      default: "Hours",
    },
    startDate: { type: Date, default: Date.now },
    targetDate: { type: Date, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Behind", "Paused"],
      default: "Active",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

StudyGoalSchema.index({ student: 1, status: 1 });

module.exports = mongoose.model("StudyGoal", StudyGoalSchema);

const mongoose = require("mongoose");

const StudyTaskSchema = new mongoose.Schema(
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
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "Study",
        "Revision",
        "Assignment",
        "Exam Preparation",
        "Project Work",
        "Practice",
        "Reading",
        "Research",
        "Lab Work",
        "Personal",
      ],
      default: "Study",
    },
    topic: { type: String, trim: true },
    description: { type: String, default: "" },
    dueDate: { type: Date, required: true },
    dueTime: { type: String, default: "23:59" },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    estimatedMinutes: { type: Number, default: 60 },
    actualMinutes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Scheduled", "In Progress", "Completed", "Overdue"],
      default: "Pending",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    relatedAssignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
    },
    relatedExam: { type: String, default: "" },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    reminder: { type: Date },
    notes: { type: String, default: "" },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

StudyTaskSchema.index({ student: 1, status: 1 });
StudyTaskSchema.index({ student: 1, dueDate: 1 });

module.exports = mongoose.model("StudyTask", StudyTaskSchema);

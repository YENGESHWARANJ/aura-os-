const mongoose = require("mongoose");

const SkillGoalSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    skillName: {
      type: String,
      required: true,
      trim: true
    },
    currentLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    targetLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    targetDate: {
      type: Date,
      required: true
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    status: {
      type: String,
      enum: ["In Progress", "Completed", "Paused"],
      default: "In Progress"
    },
    progressPercentage: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillGoal", SkillGoalSchema);

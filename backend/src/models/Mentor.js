const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    assignedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    meetings: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
        purpose: {
          type: String,
          trim: true,
        },
        notes: {
          type: String,
          trim: true,
        },
        status: {
          type: String,
          enum: ["scheduled", "completed", "cancelled", "follow-up"],
          default: "scheduled",
        },
        followUp: {
          type: String,
          trim: true,
        },
      },
    ],
    notes: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        title: {
          type: String,
          trim: true,
        },
        content: {
          type: String,
          trim: true,
        },
        private: {
          type: Boolean,
          default: true,
        },
      },
    ],
    goals: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        type: {
          type: String,
          enum: ["academic", "skill", "career"],
          default: "academic",
        },
        description: {
          type: String,
          trim: true,
        },
        targetDate: {
          type: Date,
        },
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        status: {
          type: String,
          enum: ["planned", "in-progress", "completed"],
          default: "planned",
        },
      },
    ],
    recommendations: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        title: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    activity: [
      {
        title: {
          type: String,
          trim: true,
        },
        detail: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notifications: [
      {
        title: {
          type: String,
          trim: true,
        },
        detail: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["info", "warning", "action-required"],
          default: "info",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentor", MentorSchema);

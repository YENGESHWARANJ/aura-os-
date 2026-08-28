const mongoose = require("mongoose");

const ScheduleEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, default: "11:59 PM" },
  status: { type: String, enum: ["Completed", "Current", "Upcoming"], default: "Upcoming" },
  description: { type: String, default: "" }
});

const PhaseConfigSchema = new mongoose.Schema({
  phaseNumber: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  startDate: Date,
  submissionDeadline: Date,
  reviewDate: Date,
  maxMarks: { type: Number, default: 50 },
  rubrics: [
    {
      title: String,
      description: String,
      maxMarks: Number,
      order: Number
    }
  ],
  deliverables: [
    {
      type: { type: String, required: true },
      title: { type: String, required: true },
      description: String,
      allowedFileTypes: [String]
    }
  ]
});

const ProjectBatchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    academicYear: {
      type: String,
      default: "2025-2026"
    },
    year: {
      type: String,
      default: "3rd Year"
    },
    semester: {
      type: Number,
      default: 6
    },
    type: {
      type: String,
      enum: ["Mini Project", "Main Project", "Capstone Project", "Innovation Project", "Research Project"],
      default: "Mini Project"
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    teamFormationStart: Date,
    teamFormationEnd: Date,
    projectSelectionStart: Date,
    projectSelectionEnd: Date,
    submissionStart: Date,
    submissionEnd: Date,
    status: {
      type: String,
      enum: ["UPCOMING", "ACTIVE", "COMPLETED", "LOCKED"],
      default: "ACTIVE"
    },
    currentPhase: {
      type: Number,
      default: 1
    },
    maxTeamSize: {
      type: Number,
      default: 4
    },
    minTeamSize: {
      type: Number,
      default: 2
    },
    schedule: [ScheduleEventSchema],
    phases: [PhaseConfigSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ProjectBatch", ProjectBatchSchema);

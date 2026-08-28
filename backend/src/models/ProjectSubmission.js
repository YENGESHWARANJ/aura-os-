const mongoose = require("mongoose");

const DeliverableSubmissionSchema = new mongoose.Schema({
  deliverableTitle: { type: String, required: true },
  deliverableType: { type: String, required: true },
  title: String,
  description: String,
  file: {
    name: String,
    path: String,
    mimetype: String,
    size: Number
  },
  githubUrl: String,
  demoUrl: String,
  notes: String,
  version: { type: Number, default: 1 },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Pending", "Uploaded", "Submitted", "Verified", "Rejected", "Needs Changes"],
    default: "Submitted"
  }
});

const RubricScoreSchema = new mongoose.Schema({
  title: String,
  description: String,
  maxMarks: Number,
  obtainedMarks: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["NOT STARTED", "SUBMITTED", "VERIFIED", "NEEDS IMPROVEMENT", "COMPLETED"],
    default: "NOT STARTED"
  },
  feedback: String
});

const FacultyFeedbackSchema = new mongoose.Schema({
  facultyName: { type: String, required: true },
  phaseNumber: Number,
  criterion: String,
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Approved" }
});

const ProjectSubmissionSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectTeam",
      required: true
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectBatch",
      required: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },
    phaseNumber: {
      type: Number,
      required: true
    },
    phaseName: String,
    deliverables: [DeliverableSubmissionSchema],
    rubrics: [RubricScoreSchema],
    obtainedMarks: { type: Number, default: 0 },
    maxMarks: { type: Number, default: 50 },
    feedback: [FacultyFeedbackSchema],
    status: {
      type: String,
      enum: ["LOCKED", "UPCOMING", "ACTIVE", "SUBMITTED", "UNDER REVIEW", "COMPLETED"],
      default: "ACTIVE"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ProjectSubmission", ProjectSubmissionSchema);

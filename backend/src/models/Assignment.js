const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
});

const SubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  file: {
    name: String,
    path: String,
    mimetype: String,
    size: Number
  },
  notes: { type: String, default: "" },
  submittedAt: { type: Date, default: Date.now },
  isLate: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["SUBMITTED", "GRADED"],
    default: "SUBMITTED"
  },
  marksObtained: { type: Number, default: null },
  grade: { type: String, default: null },
  feedback: { type: String, default: "" },
  gradedAt: Date,
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const AssignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    instructions: {
      type: String,
      default: ""
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    subjectCode: {
      type: String,
      required: true,
      trim: true
    },
    faculty: {
      type: String,
      required: true,
      trim: true
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    semester: {
      type: Number,
      default: 4
    },
    assignedDate: {
      type: Date,
      default: Date.now
    },
    deadline: {
      type: Date,
      required: true
    },
    maxMarks: {
      type: Number,
      default: 100
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium"
    },
    attachments: [AttachmentSchema],
    submissions: [SubmissionSchema],
    allowLateSubmission: {
      type: Boolean,
      default: true
    },
    allowResubmission: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ["active", "closed", "archived"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Assignment", AssignmentSchema);

const mongoose = require("mongoose");

const SkillAssessmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    assessmentName: {
      type: String,
      required: true
    },
    skillName: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    maxScore: {
      type: Number,
      default: 100
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate"
    },
    status: {
      type: String,
      enum: ["Passed", "Needs Review", "Failed"],
      default: "Passed"
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillAssessment", SkillAssessmentSchema);

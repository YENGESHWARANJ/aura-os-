const mongoose = require("mongoose");

const InterventionScenarioSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "attendance_boost",
        "submit_assignments",
        "mentor_meetings",
        "skill_mastery",
        "quiz_retention",
        "custom",
      ],
    },
    title: { type: String, required: true },
    description: { type: String },
    parameterValue: { type: Number, default: 0 }, // e.g. +10 (%)
    applied: { type: Boolean, default: false },
    expectedDeltaScore: { type: Number, default: 0 },
    expectedDeltaRisk: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 85 }, // percentage confidence
    effortLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    recommendationReason: { type: String },
  },
  { _id: true }
);

const InterventionPlanSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    academicBaseline: {
      marks: { type: Number, default: 75 },
      attendance: { type: Number, default: 68 },
      assignmentScore: { type: Number, default: 70 },
      quizScore: { type: Number, default: 65 },
      weightedScore: { type: Number, default: 70 },
      riskIndex: { type: Number, default: 40.5 },
      riskLevel: {
        type: String,
        enum: ["Low", "Moderate", "High", "Critical"],
        default: "Moderate",
      },
    },
    projectedOutcome: {
      weightedScore: { type: Number, default: 82.5 },
      riskIndex: { type: Number, default: 17.5 },
      riskLevel: {
        type: String,
        enum: ["Low", "Moderate", "High", "Critical"],
        default: "Low",
      },
      netScoreImprovement: { type: Number, default: 12.5 },
      netRiskReduction: { type: Number, default: 23 },
      overallConfidence: { type: Number, default: 91 },
    },
    selectedInterventions: [InterventionScenarioSchema],
    highestImpactIntervention: {
      type: String,
      default: "Attend weekly mentor sessions",
    },
    aiExplanation: {
      type: String,
      default:
        "Increasing attendance above the 75% threshold drastically reduces the penalty factor in the Risk Index formula, yielding the highest compound gain.",
    },
    approvalStatus: {
      type: String,
      enum: ["draft", "submitted_to_mentor", "approved", "revision_requested", "rejected"],
      default: "draft",
    },
    mentorFeedback: {
      comment: { type: String, default: "" },
      reviewedAt: { type: Date },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterventionPlan", InterventionPlanSchema);

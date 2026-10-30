const mongoose = require("mongoose");

const SyllabusTopicSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  courseName: { type: String, required: true },
  topicName: { type: String, required: true },
  status: {
    type: String,
    enum: ["current", "outdated", "critical_gap", "emerging"],
    default: "current",
  },
  failureRatePercent: { type: Number, default: 0 },
  studentStruggleScore: { type: Number, default: 0 }, // 0 to 100
  practicalActivityScore: { type: Number, default: 0 }, // 0 to 100
  industryRelevanceScore: { type: Number, default: 0 }, // 0 to 100
});

const IndustrySkillBenchmarkSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  domain: { type: String, required: true },
  marketDemandTrend: { type: String, enum: ["Surging", "Stable", "Declining"], default: "Surging" },
  curriculumCoveragePercent: { type: Number, default: 0 },
  studentMasteryPercent: { type: Number, default: 0 },
  gapSeverity: { type: String, enum: ["Critical", "Moderate", "Minor"], default: "Moderate" },
});

const CurriculumSuggestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  courseCode: { type: String, required: true },
  title: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "outdated_topic_replacement",
      "practical_lab_addition",
      "missing_industry_skill",
      "concept_remediation",
    ],
    required: true,
  },
  description: { type: String, required: true },
  evidence: {
    failureRate: { type: Number },
    industryDemandIncrease: { type: String },
    studentSurveyGap: { type: String },
    sampleJobPostingsCount: { type: Number },
  },
  recommendedAction: { type: String, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  status: {
    type: String,
    enum: ["proposed", "under_faculty_review", "approved", "incorporated", "rejected"],
    default: "proposed",
  },
  facultyReviews: [
    {
      reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reviewerName: { type: String },
      decision: { type: String, enum: ["Approved", "Needs Revision", "Rejected"] },
      feedback: { type: String },
      reviewedAt: { type: Date, default: Date.now },
    },
  ],
});

const CurriculumIntelligenceSchema = new mongoose.Schema(
  {
    department: { type: String, default: "Artificial Intelligence & Data Science" },
    semester: { type: Number, default: 6 },
    academicYear: { type: String, default: "2025-2026" },
    overallCurriculumHealthScore: { type: Number, default: 78.4 },
    skillGapIndex: { type: Number, default: 34.2 },
    topics: [SyllabusTopicSchema],
    benchmarks: [IndustrySkillBenchmarkSchema],
    suggestions: [CurriculumSuggestionSchema],
    lastAnalyzedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CurriculumIntelligence", CurriculumIntelligenceSchema);

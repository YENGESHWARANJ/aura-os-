const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: [
        "Technical",
        "Programming",
        "Frontend",
        "Backend",
        "Frameworks",
        "Database",
        "Tools",
        "Cloud",
        "DevOps",
        "Soft Skills",
        "Domain Skills",
        "Design",
        "AI / ML",
      ],
      default: "Programming"
    },
    proficiencyLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate"
    },
    proficiencyPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    learningStatus: {
      type: String,
      enum: ["Learning", "Practicing", "Proficient", "Verified", "Needs Improvement"],
      default: "Learning"
    },
    experienceLevel: {
      type: String,
      default: "1 year"
    },
    targetProficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 80
    },
    targetDate: {
      type: Date
    },
    description: {
      type: String,
      default: ""
    },
    verificationStatus: {
      type: String,
      enum: ["Self Declared", "Evidence Added", "Faculty Verified", "System Verified"],
      default: "Self Declared"
    },
    verifiedBy: {
      type: String,
      default: ""
    },
    verifiedAt: {
      type: Date
    },
    evidenceCount: {
      type: Number,
      default: 0
    },
    relatedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
      }
    ],
    relatedCertificates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certificate"
      }
    ],
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Prevent duplicate skill for the same student
SkillSchema.index({ student: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Skill", SkillSchema);

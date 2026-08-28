const mongoose = require("mongoose");

const SkillEvidenceSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: [
        "Project",
        "Certificate",
        "Assignment",
        "Assessment",
        "GitHub Repository",
        "Coding Profile",
        "Course",
        "Competition",
        "Hackathon",
        "Internship"
      ],
      default: "Project"
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId
    },
    verificationStatus: {
      type: String,
      enum: ["Self Declared", "Evidence Added", "Faculty Verified", "System Verified"],
      default: "Evidence Added"
    },
    verifiedBy: {
      type: String,
      default: ""
    },
    verifiedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillEvidence", SkillEvidenceSchema);

const mongoose = require("mongoose");

const AuditEntrySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "created",
        "updated",
        "submitted_for_verification",
        "verified",
        "rejected",
        "disclosure_updated",
        "public_viewed",
      ],
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    actorName: { type: String, default: "System" },
    actorRole: { type: String, default: "student" },
    timestamp: { type: Date, default: Date.now },
    comment: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
  },
  { _id: false }
);

const AcademicEvidenceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    registerNumber: { type: String, default: "" },
    department: { type: String, default: "Artificial Intelligence & Data Science" },

    title: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "marks",
        "certificate",
        "project",
        "skill",
        "internship",
        "faculty_approval",
        "mentor_evaluation",
        "course_completion",
      ],
      required: true,
    },
    issuer: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String, default: "AURA OS Academic Registry" },
      role: { type: String, default: "faculty" },
      institution: { type: String, default: "AURA Institute of Technology" },
    },
    issuedDate: { type: Date, default: Date.now },
    expirationDate: { type: Date },

    // Primary evidence payload
    payload: {
      scoreOrGrade: { type: String },
      credits: { type: Number },
      courseCode: { type: String },
      skillsDemonstrated: [String],
      projectRepository: { type: String },
      evaluationNotes: { type: String },
      externalCredentialId: { type: String },
    },

    // Cryptographic proof
    verificationId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    tamperEvidentHash: {
      type: String,
      required: true,
    },
    previousHash: {
      type: String,
      default: "0000000000000000000000000000000000000000000000000000000000000000",
    },
    digitalSignature: {
      type: String,
    },

    // Verification state
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },
    verifierRemarks: { type: String, default: "" },
    verifiedAt: { type: Date },

    // Student Selective Disclosure settings
    selectiveDisclosure: {
      sharePublicly: { type: Boolean, default: true },
      revealStudentName: { type: Boolean, default: true },
      revealRegisterNumber: { type: Boolean, default: false },
      revealExactScores: { type: Boolean, default: true },
      revealEvaluatorNotes: { type: Boolean, default: false },
      revealSkills: { type: Boolean, default: true },
    },

    auditTrail: [AuditEntrySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademicEvidence", AcademicEvidenceSchema);

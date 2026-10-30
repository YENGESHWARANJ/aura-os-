const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    issuingOrganization: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      enum: [
        "Programming",
        "Frontend",
        "Backend",
        "Full Stack",
        "Database",
        "Cloud",
        "DevOps",
        "AI/ML",
        "Data Science",
        "Cyber Security",
        "Mobile Development",
        "Design",
        "Tools",
        "Soft Skills",
        "Other"
      ],
      default: "Other"
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate"
    },
    skills: [
      {
        type: String,
        trim: true
      }
    ],
    credentialUrl: {
      type: String,
      default: ""
    },
    imageUrl: {
      type: String,
      default: ""
    },
    issuedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    issueDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date
    },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected", "Expired"],
      default: "Pending"
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    verifiedAt: {
      type: Date
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Indexes for common queries
CertificateSchema.index({ issuedTo: 1, category: 1 });
CertificateSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model("Certificate", CertificateSchema);

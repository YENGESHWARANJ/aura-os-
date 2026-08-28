const mongoose = require("mongoose");

const ProjectTeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    teamCode: {
      type: String,
      required: true,
      unique: true
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectBatch",
      required: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    guide: {
      name: { type: String, default: "Dr. Ramesh Sharma" },
      department: { type: String, default: "Computer Science & Engineering" },
      email: { type: String, default: "ramesh.sharma@aura.edu" }
    },
    domainPreference: {
      type: String,
      default: "Web Development"
    },
    status: {
      type: String,
      enum: ["NOT FORMED", "FORMING", "COMPLETED", "LOCKED"],
      default: "COMPLETED"
    },
    githubRepositoryUrl: {
      type: String,
      default: ""
    },
    githubBranch: {
      type: String,
      default: "main"
    },
    githubLatestCommit: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ProjectTeam", ProjectTeamSchema);

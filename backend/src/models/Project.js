const mongoose = require("mongoose");

const SRSSchema = new mongoose.Schema({
  introduction: String,
  problemStatement: String,
  objectives: [String],
  scope: String,
  userRoles: [String],
  functionalRequirements: [String],
  nonFunctionalRequirements: [String],
  systemArchitecture: String,
  modules: [
    {
      name: String,
      description: String
    }
  ],
  databaseDesign: String,
  apiRequirements: [String],
  securityRequirements: [String],
  testingRequirements: [String],
  deploymentRequirements: [String],
  expectedDeliverables: [String]
});

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: String,
    domain: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "Artificial Intelligence",
        "Machine Learning",
        "Data Science",
        "IoT",
        "Cyber Security",
        "Cloud Computing",
        "Blockchain",
        "Embedded Systems"
      ],
      default: "Web Development"
    },
    type: {
      type: String,
      default: "Mini Project"
    },
    description: {
      type: String,
      required: true
    },
    problemStatement: String,
    objectives: [String],
    scope: String,
    expectedOutcome: String,
    technologyStack: [String],
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Premium"],
      default: "Intermediate"
    },
    requirements: {
      functional: [String],
      nonFunctional: [String],
      hardware: [String],
      software: [String]
    },
    srs: SRSSchema,
    available: {
      type: Boolean,
      default: true
    },
    maxTeams: {
      type: Number,
      default: 2
    },
    assignedTeamsCount: {
      type: Number,
      default: 0
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectBatch"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", ProjectSchema);

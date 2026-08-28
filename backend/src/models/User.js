const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "faculty", "mentor", "parent", "admin", "super-admin"],
      default: "student",
    },
    phone: String,
    avatar: String,
    college: String,
    department: String,
    semester: Number,
    cgpa: Number,
    attendance: Number,
    skills: [String],
    assignmentsPending: {
      type: Number,
      default: 0,
    },
    projects: [
      {
        title: String,
        description: String,
        status: String,
      },
    ],
    achievements: [String],

    // Extended Student Profile Fields
    bio: { type: String, default: "" },
    dob: { type: Date },
    gender: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "India" },
    alternateEmail: { type: String, default: "" },
    degree: { type: String, default: "B.Tech" },
    specialization: { type: String, default: "Artificial Intelligence" },
    registerNumber: { type: String, default: "" },
    batch: { type: String, default: "2023 - 2027" },
    graduationYear: { type: Number, default: 2027 },
    careerGoal: { type: String, default: "" },
    preferredRole: { type: String, default: "" },
    interestedDomains: [String],
    preferredTechnologies: [String],
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      leetcode: { type: String, default: "" },
      hackerrank: { type: String, default: "" },
      codechef: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    resume: {
      url: { type: String, default: "" },
      fileName: { type: String, default: "" },
      updatedAt: { type: Date },
    },

    refreshToken: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "active",
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
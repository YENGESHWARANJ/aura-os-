const mongoose = require("mongoose");

const SubjectItemSchema = new mongoose.Schema(
  {
    subjectId: String,
    subjectName: String,
    attendance: Number,
    presentDays: Number,
    totalDays: Number,
    percent: Number,
    internalMarks: Number,
    assignmentMarks: Number,
    quizMarks: Number,
    semesterMarks: Number,
    totalMarks: Number,
  },
  { _id: false }
);

const AssignmentItemSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    subject: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ["COMPLETED", "PENDING", "OVERDUE"],
      default: "PENDING",
    },
    submittedAt: Date,
    marks: Number,
  },
  { _id: false }
);

const SkillItemSchema = new mongoose.Schema(
  {
    skillName: String,
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    verified: { type: Boolean, default: false },
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CertificationItemSchema = new mongoose.Schema(
  {
    name: String,
    issuer: String,
    status: {
      type: String,
      enum: ["VERIFIED", "PENDING", "EXPIRED"],
      default: "VERIFIED",
    },
    issuedAt: Date,
    expiryDate: Date,
  },
  { _id: false }
);

const AlertItemSchema = new mongoose.Schema(
  {
    id: String,
    type: { type: String },
    title: String,
    message: String,
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: Date,
  },
  { _id: false }
);

const NotificationListItemSchema = new mongoose.Schema(
  {
    id: String,
    type: { type: String },
    title: String,
    message: String,
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    readAt: Date,
  },
  { _id: false }
);

const EvidenceItemSchema = new mongoose.Schema(
  {
    id: String,
    type: { type: String },
    title: String,
    description: String,
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

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

    // Extended Student Identification & Demo Flag
    studentId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    rollNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    isDemoData: {
      type: Boolean,
      default: false,
      index: true,
    },
    program: {
      type: String,
      default: "B.Tech AI & Data Science",
    },
    academicYear: {
      type: String,
      default: "2026-2027",
    },
    section: {
      type: String,
      default: "Sec A",
    },

    // Detailed Attendance Breakdown
    attendanceDetails: {
      overall: { type: Number, default: 0 },
      presentDays: { type: Number, default: 0 },
      absentDays: { type: Number, default: 0 },
      totalWorkingDays: { type: Number, default: 100 },
      subjectWise: [
        {
          subjectId: String,
          subjectName: String,
          attendance: Number,
          presentDays: Number,
          totalDays: Number,
          percent: Number,
        },
      ],
    },

    // Detailed Academic Scoring
    academic: {
      cgpa: { type: Number, default: 0 },
      sgpa: { type: Number, default: 0 },
      internalMarks: { type: Number, default: 0 },
      assignmentMarks: { type: Number, default: 0 },
      quizMarks: { type: Number, default: 0 },
      semesterMarks: { type: Number, default: 0 },
    },

    // Subject Performance (6 Core Subjects)
    subjects: [SubjectItemSchema],

    // Assignments
    assignments: {
      total: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      overdue: { type: Number, default: 0 },
      list: [AssignmentItemSchema],
    },

    // Skills & Verifications
    skillsList: [SkillItemSchema],

    // Certifications
    certifications: [CertificationItemSchema],

    // AI Academic Risk Assessment
    aiRisk: {
      score: { type: Number, default: 0 },
      level: {
        type: String,
        enum: ["LOW", "MODERATE", "HIGH", "CRITICAL"],
        default: "LOW",
      },
      factors: [String],
      explanation: String,
      calculatedAt: { type: Date, default: Date.now },
      components: {
        attendanceRisk: Number,
        academicRisk: Number,
        assignmentRisk: Number,
        quizRisk: Number,
        engagementRisk: Number,
      },
    },

    // Study Progress
    studyProgress: {
      weeklyProgress: { type: Number, default: 0 },
      monthlyProgress: { type: Number, default: 0 },
      completedModules: { type: Number, default: 0 },
      totalModules: { type: Number, default: 10 },
    },

    // Mentor Information
    mentorInfo: {
      mentorId: String,
      mentorName: String,
      lastMeetingDate: Date,
    },

    // Real-Time Alerts
    alerts: [AlertItemSchema],

    // Real-Time Notifications
    notificationsList: [NotificationListItemSchema],

    // Verifiable Evidence Wallet
    evidenceWallet: [EvidenceItemSchema],

    lastActivityAt: { type: Date, default: Date.now },

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
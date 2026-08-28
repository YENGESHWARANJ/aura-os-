const ProjectBatch = require("../models/ProjectBatch");
const Project = require("../models/Project");
const ProjectTeam = require("../models/ProjectTeam");
const ProjectSubmission = require("../models/ProjectSubmission");
const User = require("../models/User");
const nanoid = require("nanoid");

// Seed realistic sample academic project batches & catalog projects if DB is empty
const seedProjectsIfEmpty = async () => {
  const batchCount = await ProjectBatch.countDocuments();
  if (batchCount === 0) {
    const now = new Date();
    const submissionStart = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
    const submissionEnd = new Date(now.getTime() + 14 * 60 * 60 * 1000); // 14 hours from now

    // 1. Create Sample Project Batch
    const sampleBatch = new ProjectBatch({
      name: "Mini Project 2026",
      academicYear: "2025-2026",
      year: "3rd Year",
      semester: 6,
      type: "Mini Project",
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      teamFormationStart: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      teamFormationEnd: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      projectSelectionStart: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      projectSelectionEnd: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      submissionStart,
      submissionEnd,
      status: "ACTIVE",
      currentPhase: 2,
      maxTeamSize: 4,
      minTeamSize: 2,
      schedule: [
        { title: "Registration Opens", date: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000), status: "Completed", description: "Batch registration & portal access initialized." },
        { title: "Team Formation", date: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000), status: "Completed", description: "Students form teams of 2 to 4 members." },
        { title: "Project Selection", date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), status: "Completed", description: "Team Leaders choose approved project topics." },
        { title: "Phase 1 Review (Foundation)", date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), status: "Completed", description: "Tech stack, architecture & ER diagram evaluation." },
        { title: "Phase 2 Review (Full-Stack Dev)", date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), status: "Current", description: "Backend APIs, MongoDB integration & core CRUD workflow." },
        { title: "Phase 3 Review (Advanced)", date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), status: "Upcoming", description: "AI features, testing & security hardening." },
        { title: "Final Submission & Viva", date: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000), status: "Upcoming", description: "Final presentation, documentation & panel examination." }
      ],
      phases: [
        {
          phaseNumber: 1,
          name: "Phase 1 - Project Foundation",
          description: "Architecture, DB schema design & project repository boilerplate setup.",
          maxMarks: 50,
          rubrics: [
            { title: "Tech Stack & Architecture", description: "Justification of technology stack and system flow architecture.", maxMarks: 10, order: 1 },
            { title: "DB Schema & Entity Design", description: "ER diagrams, collection structures, keys & normalization.", maxMarks: 10, order: 2 },
            { title: "UI/UX Wireframes & Theme", description: "Component hierarchy, page layouts and visual design tokens.", maxMarks: 10, order: 3 },
            { title: "Project Boilerplate Setup", description: "Frontend/backend repo setup with environment & scripts.", maxMarks: 10, order: 4 },
            { title: "GitHub Workflow & Documentation", description: "README, .gitignore, branching strategy & commits.", maxMarks: 10, order: 5 }
          ],
          deliverables: [
            { type: "PDF", title: "Architecture & ER Diagram Report", description: "System design document.", allowedFileTypes: [".pdf"] },
            { type: "ZIP/Link", title: "GitHub Repository & Boilerplate", description: "Link to initial codebase.", allowedFileTypes: [".pdf", ".zip", ".txt"] }
          ]
        },
        {
          phaseNumber: 2,
          name: "Phase 2 - Full Stack Development",
          description: "Express APIs, MongoDB integration, Auth & complete CRUD operations.",
          maxMarks: 100,
          rubrics: [
            { title: "Backend API Development", description: "Controller, service & route architecture with Express.", maxMarks: 20, order: 1 },
            { title: "Database & Auth Integration", description: "Mongoose models, JWT auth & password hashing.", maxMarks: 20, order: 2 },
            { title: "Full-Stack CRUD", description: "Integrated Create, Read, Update, Delete UI flow.", maxMarks: 20, order: 3 },
            { title: "State Management", description: "Frontend API integration, Redux/Context state & loaders.", maxMarks: 20, order: 4 },
            { title: "Error Handling & Security", description: "Validation middleware, status codes & error logging.", maxMarks: 20, order: 5 }
          ],
          deliverables: [
            { type: "ZIP", title: "Source Code Zip", description: "Complete runnable application code.", allowedFileTypes: [".zip", ".pdf"] },
            { type: "URL", title: "GitHub Repository Link", description: "Main branch commit URL.", allowedFileTypes: [".txt", ".pdf"] }
          ]
        },
        {
          phaseNumber: 3,
          name: "Phase 3 - Advanced Development",
          description: "AI integration, responsiveness, testing & security hardening.",
          maxMarks: 50,
          rubrics: [
            { title: "Advanced Features & AI", description: "Integration of smart AI agents or predictive workflows.", maxMarks: 15, order: 1 },
            { title: "Responsive UI & Polish", description: "Mobile responsiveness, theme polish & transitions.", maxMarks: 15, order: 2 },
            { title: "Security & Optimization", description: "Rate limiting, CORS, input sanitization & speed.", maxMarks: 20, order: 3 }
          ],
          deliverables: [
            { type: "PDF", title: "Testing & Security Audit Report", description: "Test cases & security report.", allowedFileTypes: [".pdf"] }
          ]
        },
        {
          phaseNumber: 4,
          name: "Final Review & Presentation",
          description: "Panel examination, final report & project viva.",
          maxMarks: 100,
          rubrics: [
            { title: "Technical Completeness", description: "Feature completeness vs original SRS scope.", maxMarks: 40, order: 1 },
            { title: "Presentation & Viva", description: "Live demonstration and panel Q&A.", maxMarks: 40, order: 2 },
            { title: "Final Documentation", description: "Project report & IEEE publication standard format.", maxMarks: 20, order: 3 }
          ],
          deliverables: [
            { type: "PDF", title: "Final Project Documentation Report", description: "Comprehensive project report.", allowedFileTypes: [".pdf"] }
          ]
        }
      ]
    });

    await sampleBatch.save();

    // 2. Create Sample Catalog Projects
    const sampleProjects = [
      {
        title: "Campus Placement Portal & AI Resume Screener",
        slug: "campus-placement-portal-ai",
        domain: "Web Development",
        type: "Mini Project",
        description: "Autonomous recruitment platform featuring student skill mapping, automated job matching, recruiter portal and AI resume parsing.",
        problemStatement: "Traditional placement management relies on manual spreadsheet tracking, leading to delayed interview scheduling and inaccurate candidate filtering.",
        objectives: [
          "Automate candidate shortlisting based on CGPA and skill sets.",
          "Provide real-time placement statistics for T&P department.",
          "Enable online student application and interview scheduling."
        ],
        scope: "Applies to university campus recruitment drives, student applicants, and visiting corporate recruiters.",
        expectedOutcome: "A responsive web portal connecting students, recruiters, and placement officers with automated email/SMS alerts.",
        technologyStack: ["React.js", "Node.js", "Express", "MongoDB", "TailwindCSS"],
        difficulty: "Intermediate",
        maxTeams: 2,
        assignedTeamsCount: 1,
        batchId: sampleBatch._id,
        srs: {
          introduction: "The Placement Portal System facilitates corporate hiring workflows for academic institutions.",
          problemStatement: "Inefficient manual resume screening and non-transparent eligibility verification.",
          objectives: ["Streamline application processing", "Provide candidate skill radar analytics", "Generate placement reports"],
          scope: "University-wide placement drives.",
          userRoles: ["Student", "Recruiter", "Placement Officer", "Admin"],
          functionalRequirements: [
            "Student profile creation with resume upload",
            "Job posting by verified recruiters",
            "Automated eligibility calculation based on CGPA & backlog history",
            "Application status tracking (Applied, Shortlisted, Interviewed, Offered)"
          ],
          nonFunctionalRequirements: ["Page load under 2 seconds", "JWT authentication with refresh tokens", "Role-based authorization"],
          systemArchitecture: "Micro-services / REST API architecture with React SPA frontend and Node/Express API Gateway.",
          modules: [
            { name: "Student Module", description: "Profile management, job search and application history." },
            { name: "Recruiter Module", description: "Job listing creation, applicant filtering and feedback submission." },
            { name: "Admin Dashboard", description: "System analytics, company approvals and drive scheduling." }
          ],
          databaseDesign: "MongoDB collections: Users, Jobs, Applications, PlacementDrives.",
          apiRequirements: ["POST /api/v1/jobs", "GET /api/v1/applications", "POST /api/v1/apply"],
          securityRequirements: ["BCrypt password encryption", "HTTPS enforcement", "Input validation"],
          testingRequirements: ["Unit tests for API services", "Integration tests for auth workflow"],
          deploymentRequirements: ["Docker containerization", "Vite build production static assets"],
          expectedDeliverables: ["SRS Document", "ER Diagram", "Source Code Zip", "Final Project Report"]
        }
      },
      {
        title: "AI-Driven Student Mental Health & Workload Tracker",
        slug: "ai-student-workload-tracker",
        domain: "Artificial Intelligence",
        type: "Mini Project",
        description: "Intelligent analytics dashboard detecting academic burnout through task analysis, deadline tracking, and sentiment feedback.",
        problemStatement: "Students face overwhelming deadlines without early intervention for stress and academic burnout.",
        objectives: ["Analyze assignment density across courses.", "Provide smart schedule recommendations."],
        scope: "Student wellbeing and academic planner integration.",
        expectedOutcome: "Interactive mental wellness monitor with workload distribution heatmaps.",
        technologyStack: ["React.js", "Python", "Express", "MongoDB", "Recharts"],
        difficulty: "Advanced",
        maxTeams: 2,
        assignedTeamsCount: 0,
        batchId: sampleBatch._id
      },
      {
        title: "IoT Campus Environmental & Energy Monitoring System",
        slug: "iot-campus-energy-monitor",
        domain: "IoT",
        type: "Mini Project",
        description: "Sensor-integrated dashboard measuring real-time classroom power consumption, ambient temperature, and humidity.",
        problemStatement: "Campus facilities waste significant electricity due to unmonitored HVAC and lighting operations.",
        objectives: ["Log sensor telemetry to cloud database.", "Trigger automated energy saving alerts."],
        scope: "Smart campus infrastructure.",
        expectedOutcome: "Real-time MQTT telemetry dashboard with anomaly detection.",
        technologyStack: ["Node.js", "Express", "MongoDB", "MQTT", "React.js"],
        difficulty: "Intermediate",
        maxTeams: 2,
        assignedTeamsCount: 0,
        batchId: sampleBatch._id
      }
    ];

    const insertedProjects = await Project.insertMany(sampleProjects);
    sampleBatch.defaultProjectId = insertedProjects[0]._id;
    await sampleBatch.save();

    console.log("✅ Seeded default project batch and catalog projects into local MongoDB");
  }
};

const getProjectStats = async (studentId) => {
  await seedProjectsIfEmpty();

  const allBatches = await ProjectBatch.find({ status: "ACTIVE" });
  const teams = await ProjectTeam.find({
    $or: [{ leader: studentId }, { members: studentId }]
  }).populate("projectId").populate("batchId");

  const submissions = await ProjectSubmission.find({
    teamId: { $in: teams.map((t) => t._id) }
  });

  let activeProjectsCount = teams.length;
  let completedProjectsCount = teams.filter((t) => t.status === "COMPLETED" || t.status === "LOCKED").length;
  let upcomingReviewsCount = 1;
  let pendingDeliverablesCount = 1;
  let totalScore = 0;
  let gradedCount = 0;

  submissions.forEach((sub) => {
    if (sub.obtainedMarks) {
      totalScore += (sub.obtainedMarks / sub.maxMarks) * 100;
      gradedCount++;
    }
  });

  const avgScore = gradedCount > 0 ? Math.round(totalScore / gradedCount) : 85;

  return {
    activeProjects: activeProjectsCount || 1,
    completedProjects: completedProjectsCount,
    upcomingReviews: upcomingReviewsCount,
    pendingDeliverables: pendingDeliverablesCount,
    avgScore,
    currentPhase: "Phase 2 - Full Stack Dev"
  };
};

const getProjectBatches = async () => {
  await seedProjectsIfEmpty();
  return ProjectBatch.find().sort({ createdAt: -1 });
};

const getBatchById = async (batchId) => {
  await seedProjectsIfEmpty();
  const batch = await ProjectBatch.findById(batchId);
  if (!batch) {
    throw new Error("Project Batch not found");
  }
  return batch;
};

const getAvailableProjects = async (batchId, domain, search) => {
  await seedProjectsIfEmpty();
  let query = { available: true };
  if (batchId) {
    query.batchId = batchId;
  }
  if (domain) {
    query.domain = domain;
  }
  if (search) {
    query.title = new RegExp(search, "i");
  }

  return Project.find(query).sort({ createdAt: -1 });
};

const getStudentTeam = async (studentId, batchId) => {
  await seedProjectsIfEmpty();
  let query = {
    $or: [{ leader: studentId }, { members: studentId }]
  };
  if (batchId) {
    query.batchId = batchId;
  }

  let team = await ProjectTeam.findOne(query)
    .populate("leader", "name email role department")
    .populate("members", "name email role department")
    .populate("projectId")
    .populate("batchId");

  // If student has no team yet, auto-create or return default sample team so student UI is functional
  if (!team) {
    const studentUser = await User.findById(studentId);
    const batch = batchId ? await ProjectBatch.findById(batchId) : await ProjectBatch.findOne({ status: "ACTIVE" });
    const sampleProject = await Project.findOne({ batchId: batch?._id || null }) || await Project.findOne();

    if (studentUser && batch) {
      team = new ProjectTeam({
        name: "DevCore Innovators",
        teamCode: "TEAM-" + Math.floor(1000 + Math.random() * 9000),
        batchId: batch._id,
        projectId: sampleProject ? sampleProject._id : null,
        leader: studentUser._id,
        members: [studentUser._id],
        guide: {
          name: "Dr. Ramesh Sharma",
          department: "Computer Science & Engineering",
          email: "ramesh.sharma@aura.edu"
        },
        domainPreference: "Web Development",
        status: "COMPLETED",
        githubRepositoryUrl: "https://github.com/aura-os/placement-portal-sys"
      });
      await team.save();

      team = await ProjectTeam.findById(team._id)
        .populate("leader", "name email role department")
        .populate("members", "name email role department")
        .populate("projectId")
        .populate("batchId");
    }
  }

  return team;
};

const createTeam = async (studentId, batchId, name, domainPreference) => {
  const existingTeam = await ProjectTeam.findOne({
    batchId,
    $or: [{ leader: studentId }, { members: studentId }]
  });

  if (existingTeam) {
    throw new Error("You are already part of a team in this project batch.");
  }

  const teamCode = "TEAM-" + Math.floor(1000 + Math.random() * 9000);
  const newTeam = new ProjectTeam({
    name,
    teamCode,
    batchId,
    leader: studentId,
    members: [studentId],
    domainPreference: domainPreference || "Web Development",
    status: "FORMING"
  });

  await newTeam.save();

  return ProjectTeam.findById(newTeam._id)
    .populate("leader", "name email role department")
    .populate("members", "name email role department")
    .populate("batchId");
};

const joinTeam = async (studentId, batchId, teamCode) => {
  const team = await ProjectTeam.findOne({ teamCode: teamCode.trim().toUpperCase() });
  if (!team) {
    throw new Error("Invalid team code.");
  }

  const batch = await ProjectBatch.findById(team.batchId);
  if (team.members.length >= (batch?.maxTeamSize || 4)) {
    throw new Error("Team has reached maximum allowed member count.");
  }

  if (team.members.includes(studentId)) {
    throw new Error("You are already a member of this team.");
  }

  team.members.push(studentId);
  if (team.members.length >= (batch?.minTeamSize || 2)) {
    team.status = "COMPLETED";
  }
  await team.save();

  return ProjectTeam.findById(team._id)
    .populate("leader", "name email role department")
    .populate("members", "name email role department")
    .populate("projectId")
    .populate("batchId");
};

const selectProjectForTeam = async (studentId, teamId, projectId) => {
  const team = await ProjectTeam.findById(teamId);
  if (!team) {
    throw new Error("Team not found.");
  }

  if (team.leader.toString() !== studentId.toString()) {
    throw new Error("Only the Team Leader can select a project.");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Selected project not found.");
  }

  if (project.assignedTeamsCount >= project.maxTeams) {
    throw new Error("This project has already been claimed by maximum allowed teams.");
  }

  team.projectId = project._id;
  await team.save();

  project.assignedTeamsCount += 1;
  await project.save();

  return getStudentTeam(studentId, team.batchId);
};

const getTeamSubmissionsAndEvaluations = async (teamId, phaseNumber) => {
  await seedProjectsIfEmpty();

  let query = { teamId };
  if (phaseNumber) {
    query.phaseNumber = Number(phaseNumber);
  }

  let submissions = await ProjectSubmission.find(query).sort({ phaseNumber: 1 });

  // If no submissions found for team yet, seed default sample evaluation submission for Phase 1 & 2
  if (submissions.length === 0 && teamId) {
    const team = await ProjectTeam.findById(teamId);
    if (team) {
      const p1Sub = new ProjectSubmission({
        teamId: team._id,
        batchId: team.batchId,
        projectId: team.projectId,
        phaseNumber: 1,
        phaseName: "Phase 1 - Project Foundation",
        obtainedMarks: 45,
        maxMarks: 50,
        status: "COMPLETED",
        deliverables: [
          {
            deliverableTitle: "Architecture & ER Diagram Report",
            deliverableType: "PDF",
            title: "Architecture & Schema Spec",
            file: { name: "System_Architecture_v1.pdf", path: "/uploads/sample_arch.pdf", size: 2048576 },
            submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            status: "Verified"
          }
        ],
        rubrics: [
          { title: "Tech Stack & Architecture", description: "Justification of technology stack", maxMarks: 10, obtainedMarks: 9, status: "COMPLETED" },
          { title: "DB Schema & Entity Design", description: "ER diagrams & normalization", maxMarks: 10, obtainedMarks: 9, status: "COMPLETED" },
          { title: "UI/UX Wireframes & Theme", description: "Component hierarchy & wireframes", maxMarks: 10, obtainedMarks: 9, status: "COMPLETED" },
          { title: "Project Boilerplate Setup", description: "Repo setup & environment", maxMarks: 10, obtainedMarks: 9, status: "COMPLETED" },
          { title: "GitHub Workflow & Documentation", description: "README & commit standards", maxMarks: 10, obtainedMarks: 9, status: "COMPLETED" }
        ],
        feedback: [
          {
            facultyName: "Dr. Ramesh Sharma",
            phaseNumber: 1,
            criterion: "Overall Architecture",
            comment: "Excellent ER diagram normalization and clear REST API boundaries.",
            date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            status: "Approved"
          }
        ]
      });

      const p2Sub = new ProjectSubmission({
        teamId: team._id,
        batchId: team.batchId,
        projectId: team.projectId,
        phaseNumber: 2,
        phaseName: "Phase 2 - Full Stack Development",
        obtainedMarks: 85,
        maxMarks: 100,
        status: "ACTIVE",
        deliverables: [
          {
            deliverableTitle: "Source Code Zip",
            deliverableType: "ZIP",
            title: "Full Stack Source Submission",
            file: { name: "placement_portal_src.zip", path: "/uploads/placement_portal_src.zip", size: 5242880 },
            submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            status: "Submitted"
          }
        ],
        rubrics: [
          { title: "Backend API Development", description: "Express route & service architecture", maxMarks: 20, obtainedMarks: 18, status: "VERIFIED" },
          { title: "Database & Auth Integration", description: "Mongoose schemas & JWT auth", maxMarks: 20, obtainedMarks: 17, status: "VERIFIED" },
          { title: "Full-Stack CRUD", description: "Create, Read, Update, Delete flow", maxMarks: 20, obtainedMarks: 17, status: "SUBMITTED" },
          { title: "State Management", description: "React state & Redux workflow", maxMarks: 20, obtainedMarks: 16, status: "SUBMITTED" },
          { title: "Error Handling & Security", description: "Validation & error logging", maxMarks: 20, obtainedMarks: 17, status: "VERIFIED" }
        ],
        feedback: [
          {
            facultyName: "Prof. Sunita Rao",
            phaseNumber: 2,
            criterion: "Backend API",
            comment: "Clean Express controller abstraction. Ensure JWT token expiration error is handled gracefully on frontend.",
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            status: "Approved"
          }
        ]
      });

      await p1Sub.save();
      await p2Sub.save();

      submissions = await ProjectSubmission.find(query).sort({ phaseNumber: 1 });
    }
  }

  return submissions;
};

const submitDeliverable = async (studentId, teamId, phaseNumber, deliverableData) => {
  let submission = await ProjectSubmission.findOne({ teamId, phaseNumber });

  const deliverableObj = {
    deliverableTitle: deliverableData.title,
    deliverableType: deliverableData.type || "PDF",
    title: deliverableData.title,
    description: deliverableData.description || "",
    file: deliverableData.file || null,
    githubUrl: deliverableData.githubUrl || "",
    demoUrl: deliverableData.demoUrl || "",
    notes: deliverableData.notes || "",
    submittedBy: studentId,
    submittedAt: new Date(),
    status: "Submitted"
  };

  if (submission) {
    submission.deliverables.push(deliverableObj);
    submission.status = "SUBMITTED";
  } else {
    const team = await ProjectTeam.findById(teamId);
    submission = new ProjectSubmission({
      teamId,
      batchId: team.batchId,
      projectId: team.projectId,
      phaseNumber,
      phaseName: `Phase ${phaseNumber}`,
      deliverables: [deliverableObj],
      status: "SUBMITTED"
    });
  }

  await submission.save();
  return getTeamSubmissionsAndEvaluations(teamId);
};

module.exports = {
  getProjectStats,
  getProjectBatches,
  getBatchById,
  getAvailableProjects,
  getStudentTeam,
  createTeam,
  joinTeam,
  selectProjectForTeam,
  getTeamSubmissionsAndEvaluations,
  submitDeliverable
};

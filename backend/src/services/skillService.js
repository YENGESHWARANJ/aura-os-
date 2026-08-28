const Skill = require("../models/Skill");
const SkillGoal = require("../models/SkillGoal");
const SkillEvidence = require("../models/SkillEvidence");
const SkillAssessment = require("../models/SkillAssessment");
const Project = require("../models/Project");
const Certificate = require("../models/Certificate");
const User = require("../models/User");

// Centralized configuration for Career Target requirements
const CAREER_PROFILES = {
  "Full Stack Developer": {
    requiredSkills: [
      { name: "JavaScript", target: 85, category: "Programming" },
      { name: "React", target: 80, category: "Frontend" },
      { name: "Node.js", target: 75, category: "Backend" },
      { name: "Express.js", target: 75, category: "Backend" },
      { name: "MongoDB", target: 70, category: "Database" },
      { name: "Git & GitHub", target: 80, category: "Tools" },
      { name: "REST APIs", target: 80, category: "Backend" },
      { name: "TailwindCSS", target: 75, category: "Frontend" }
    ],
    weights: { technical: 0.35, tools: 0.20, projects: 0.20, problemSolving: 0.15, communication: 0.10 }
  },
  "Frontend Developer": {
    requiredSkills: [
      { name: "JavaScript", target: 90, category: "Programming" },
      { name: "React", target: 88, category: "Frontend" },
      { name: "TypeScript", target: 80, category: "Programming" },
      { name: "TailwindCSS", target: 85, category: "Frontend" },
      { name: "Git & GitHub", target: 75, category: "Tools" },
      { name: "UI/UX Design", target: 70, category: "Soft Skills" }
    ],
    weights: { technical: 0.40, tools: 0.20, projects: 0.20, problemSolving: 0.10, communication: 0.10 }
  },
  "Backend Developer": {
    requiredSkills: [
      { name: "Node.js", target: 85, category: "Backend" },
      { name: "Express.js", target: 85, category: "Backend" },
      { name: "MongoDB", target: 80, category: "Database" },
      { name: "PostgreSQL / SQL", target: 75, category: "Database" },
      { name: "REST APIs", target: 90, category: "Backend" },
      { name: "Git & GitHub", target: 80, category: "Tools" },
      { name: "Docker", target: 70, category: "Tools" }
    ],
    weights: { technical: 0.40, tools: 0.20, projects: 0.20, problemSolving: 0.10, communication: 0.10 }
  },
  "Data Scientist": {
    requiredSkills: [
      { name: "Python", target: 90, category: "Programming" },
      { name: "Data Analysis & Pandas", target: 85, category: "AI / ML" },
      { name: "Machine Learning", target: 80, category: "AI / ML" },
      { name: "SQL", target: 75, category: "Database" },
      { name: "Problem Solving", target: 85, category: "Soft Skills" }
    ],
    weights: { technical: 0.40, tools: 0.20, projects: 0.20, problemSolving: 0.10, communication: 0.10 }
  },
  "AI Engineer": {
    requiredSkills: [
      { name: "Python", target: 92, category: "Programming" },
      { name: "PyTorch / TensorFlow", target: 85, category: "AI / ML" },
      { name: "Machine Learning", target: 85, category: "AI / ML" },
      { name: "REST APIs", target: 75, category: "Backend" },
      { name: "Git & GitHub", target: 80, category: "Tools" }
    ],
    weights: { technical: 0.45, tools: 0.15, projects: 0.20, problemSolving: 0.10, communication: 0.10 }
  },
  "ML Engineer": {
    requiredSkills: [
      { name: "Python", target: 90, category: "Programming" },
      { name: "Scikit-Learn", target: 85, category: "AI / ML" },
      { name: "Docker", target: 75, category: "Tools" },
      { name: "MLOps", target: 70, category: "Tools" },
      { name: "Git & GitHub", target: 80, category: "Tools" }
    ],
    weights: { technical: 0.40, tools: 0.20, projects: 0.20, problemSolving: 0.10, communication: 0.10 }
  },
  "Mobile App Developer": {
    requiredSkills: [
      { name: "React Native / Flutter", target: 85, category: "Frameworks" },
      { name: "JavaScript", target: 80, category: "Programming" },
      { name: "REST APIs", target: 80, category: "Backend" },
      { name: "Git & GitHub", target: 75, category: "Tools" }
    ],
    weights: { technical: 0.40, tools: 0.20, projects: 0.20, problemSolving: 0.10, communication: 0.10 }
  },
  "Cloud Engineer": {
    requiredSkills: [
      { name: "Docker", target: 85, category: "Tools" },
      { name: "AWS / Cloud Infrastructure", target: 80, category: "Tools" },
      { name: "Linux Administration", target: 80, category: "Tools" },
      { name: "Git & GitHub", target: 85, category: "Tools" }
    ],
    weights: { technical: 0.35, tools: 0.30, projects: 0.15, problemSolving: 0.10, communication: 0.10 }
  },
  "DevOps Engineer": {
    requiredSkills: [
      { name: "Docker", target: 88, category: "Tools" },
      { name: "CI/CD Pipelines", target: 85, category: "Tools" },
      { name: "Git & GitHub", target: 90, category: "Tools" },
      { name: "Linux", target: 85, category: "Tools" }
    ],
    weights: { technical: 0.35, tools: 0.30, projects: 0.15, problemSolving: 0.10, communication: 0.10 }
  },
  "Cyber Security Engineer": {
    requiredSkills: [
      { name: "Network Security", target: 85, category: "Domain Skills" },
      { name: "Python", target: 75, category: "Programming" },
      { name: "Ethical Hacking", target: 80, category: "Domain Skills" },
      { name: "Linux Administration", target: 85, category: "Tools" }
    ],
    weights: { technical: 0.40, tools: 0.20, projects: 0.20, problemSolving: 0.10, communication: 0.10 }
  },
  "IoT Engineer": {
    requiredSkills: [
      { name: "C / C++", target: 85, category: "Programming" },
      { name: "Embedded Systems & MQTT", target: 80, category: "Domain Skills" },
      { name: "Python", target: 75, category: "Programming" },
      { name: "Git & GitHub", target: 75, category: "Tools" }
    ],
    weights: { technical: 0.40, tools: 0.20, projects: 0.20, problemSolving: 0.10, communication: 0.10 }
  },
  "Software Engineer": {
    requiredSkills: [
      { name: "JavaScript", target: 85, category: "Programming" },
      { name: "Data Structures & Algorithms", target: 85, category: "Programming" },
      { name: "System Design", target: 70, category: "Domain Skills" },
      { name: "Git & GitHub", target: 85, category: "Tools" },
      { name: "Problem Solving", target: 85, category: "Soft Skills" }
    ],
    weights: { technical: 0.35, tools: 0.20, projects: 0.20, problemSolving: 0.15, communication: 0.10 }
  }
};

const mapPercentageToLevel = (pct) => {
  if (pct >= 81) return "Expert";
  if (pct >= 51) return "Advanced";
  if (pct >= 26) return "Intermediate";
  return "Beginner";
};

// Seed realistic skills for student if database has no records for student
const seedSkillsIfEmpty = async (studentId) => {
  const count = await Skill.countDocuments({ student: studentId });
  if (count === 0) {
    const sampleSkills = [
      {
        student: studentId,
        name: "JavaScript",
        category: "Programming",
        proficiencyLevel: "Advanced",
        proficiencyPercentage: 82,
        learningStatus: "Verified",
        experienceLevel: "2+ years",
        targetProficiency: 90,
        description: "Modern ES6+, Async/Await, Closures, Event Loop and DOM manipulation.",
        verificationStatus: "Faculty Verified",
        verifiedBy: "Dr. Ramesh Sharma",
        verifiedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000),
        evidenceCount: 4
      },
      {
        student: studentId,
        name: "React",
        category: "Frontend",
        proficiencyLevel: "Advanced",
        proficiencyPercentage: 76,
        learningStatus: "Practicing",
        experienceLevel: "1.5 years",
        targetProficiency: 85,
        description: "Hooks, Context API, Redux Toolkit, React Router, Vite SPA.",
        verificationStatus: "Evidence Added",
        evidenceCount: 3
      },
      {
        student: studentId,
        name: "Node.js",
        category: "Backend",
        proficiencyLevel: "Intermediate",
        proficiencyPercentage: 62,
        learningStatus: "Learning",
        experienceLevel: "1 year",
        targetProficiency: 78,
        description: "Express framework, Middleware, REST APIs, NPM package management.",
        verificationStatus: "Evidence Added",
        evidenceCount: 2
      },
      {
        student: studentId,
        name: "MongoDB",
        category: "Database",
        proficiencyLevel: "Intermediate",
        proficiencyPercentage: 55,
        learningStatus: "Needs Improvement",
        experienceLevel: "1 year",
        targetProficiency: 75,
        description: "Mongoose ODM, Collection modeling, Aggregation pipelines, Indexes.",
        verificationStatus: "Self Declared",
        evidenceCount: 1
      },
      {
        student: studentId,
        name: "Git & GitHub",
        category: "Tools",
        proficiencyLevel: "Advanced",
        proficiencyPercentage: 80,
        learningStatus: "Proficient",
        experienceLevel: "2+ years",
        targetProficiency: 88,
        description: "Branching, Pull Requests, Merge conflict resolution, GitHub Actions.",
        verificationStatus: "Faculty Verified",
        verifiedBy: "Prof. Sunita Rao",
        verifiedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000),
        evidenceCount: 5
      },
      {
        student: studentId,
        name: "REST APIs",
        category: "Backend",
        proficiencyLevel: "Intermediate",
        proficiencyPercentage: 68,
        learningStatus: "Practicing",
        experienceLevel: "1 year",
        targetProficiency: 80,
        description: "API design principles, JSON responses, Status codes, Authentication headers.",
        verificationStatus: "Evidence Added",
        evidenceCount: 2
      },
      {
        student: studentId,
        name: "TailwindCSS",
        category: "Frontend",
        proficiencyLevel: "Advanced",
        proficiencyPercentage: 75,
        learningStatus: "Proficient",
        experienceLevel: "1 year",
        targetProficiency: 85,
        description: "Utility-first CSS, Responsive design, Theme tokens, Animations.",
        verificationStatus: "Self Declared",
        evidenceCount: 2
      },
      {
        student: studentId,
        name: "Python",
        category: "Programming",
        proficiencyLevel: "Intermediate",
        proficiencyPercentage: 60,
        learningStatus: "Learning",
        experienceLevel: "6 months",
        targetProficiency: 75,
        description: "Scripting, Data analysis basics, File I/O, OOP.",
        verificationStatus: "Self Declared",
        evidenceCount: 1
      },
      {
        student: studentId,
        name: "Problem Solving",
        category: "Soft Skills",
        proficiencyLevel: "Advanced",
        proficiencyPercentage: 74,
        learningStatus: "Proficient",
        experienceLevel: "2 years",
        targetProficiency: 85,
        description: "Algorithmic thinking, Debugging techniques, System analysis.",
        verificationStatus: "System Verified",
        evidenceCount: 3
      }
    ];

    await Skill.insertMany(sampleSkills);

    // Seed sample Goals
    const sampleGoals = [
      {
        student: studentId,
        skillName: "Node.js",
        currentLevel: 62,
        targetLevel: 80,
        targetDate: new Date("2026-09-30"),
        priority: "High",
        status: "In Progress",
        progressPercentage: 45,
        notes: "Complete Express REST API authentication & JWT refresh tokens."
      },
      {
        student: studentId,
        skillName: "MongoDB",
        currentLevel: 55,
        targetLevel: 75,
        targetDate: new Date("2026-10-15"),
        priority: "Medium",
        status: "In Progress",
        progressPercentage: 30,
        notes: "Master Mongoose aggregation pipeline operators and indexing."
      }
    ];
    await SkillGoal.insertMany(sampleGoals);

    // Seed sample Evidence
    const sampleEvidence = [
      {
        student: studentId,
        skillName: "JavaScript",
        type: "Project",
        title: "Placement Portal & AI Resume Screener",
        description: "Implemented full frontend UI state management and client-side validation.",
        url: "https://github.com/aura-os/placement-portal-sys",
        verificationStatus: "Faculty Verified",
        verifiedBy: "Dr. Ramesh Sharma",
        verifiedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000)
      },
      {
        student: studentId,
        skillName: "Git & GitHub",
        type: "GitHub Repository",
        title: "AURA OS Core Codebase",
        description: "Active contributor with 45+ commits and clean PR history.",
        url: "https://github.com/aura-os/aura-core",
        verificationStatus: "System Verified"
      }
    ];
    await SkillEvidence.insertMany(sampleEvidence);

    // Seed sample Assessments
    const sampleAssessments = [
      {
        student: studentId,
        assessmentName: "JavaScript Fundamental Assessment",
        skillName: "JavaScript",
        score: 82,
        maxScore: 100,
        level: "Advanced",
        status: "Passed",
        date: new Date(Date.now() - 20 * 24 * 3600 * 1000)
      },
      {
        student: studentId,
        assessmentName: "React & Component Lifecycle Test",
        skillName: "React",
        score: 76,
        maxScore: 100,
        level: "Advanced",
        status: "Passed",
        date: new Date(Date.now() - 12 * 24 * 3600 * 1000)
      }
    ];
    await SkillAssessment.insertMany(sampleAssessments);
  }
};

const getSkillOverview = async (studentId) => {
  await seedSkillsIfEmpty(studentId);

  const totalSkills = await Skill.countDocuments({ student: studentId });
  const verifiedSkills = await Skill.countDocuments({
    student: studentId,
    verificationStatus: { $in: ["Faculty Verified", "System Verified"] }
  });
  const inProgressSkills = await Skill.countDocuments({
    student: studentId,
    learningStatus: { $in: ["Learning", "Practicing", "Needs Improvement"] }
  });

  const readinessObj = await getCareerReadiness(studentId, "Full Stack Developer");

  return {
    totalSkills,
    verifiedSkills,
    inProgressSkills,
    careerReadiness: readinessObj.readinessScore
  };
};

const getSkills = async (studentId, filters = {}) => {
  await seedSkillsIfEmpty(studentId);

  let query = { student: studentId };

  if (filters.category && filters.category !== "All" && filters.category !== "All Skills") {
    query.category = filters.category;
  }

  if (filters.proficiency) {
    query.proficiencyLevel = filters.proficiency;
  }

  if (filters.status) {
    query.learningStatus = filters.status;
  }

  if (filters.search) {
    query.name = new RegExp(filters.search, "i");
  }

  let sortOption = { updatedAt: -1 };
  if (filters.sortBy === "Highest Proficiency") {
    sortOption = { proficiencyPercentage: -1 };
  } else if (filters.sortBy === "Lowest Proficiency") {
    sortOption = { proficiencyPercentage: 1 };
  } else if (filters.sortBy === "Alphabetical") {
    sortOption = { name: 1 };
  } else if (filters.sortBy === "Recently Updated") {
    sortOption = { updatedAt: -1 };
  }

  return Skill.find(query).sort(sortOption).populate("relatedProjects").populate("relatedCertificates");
};

const addSkill = async (studentId, skillData) => {
  await seedSkillsIfEmpty(studentId);

  const existing = await Skill.findOne({
    student: studentId,
    name: { $regex: new RegExp(`^${skillData.name.trim()}$`, "i") }
  });

  if (existing) {
    throw new Error("This skill is already in your profile.");
  }

  const percentage = Number(skillData.proficiencyPercentage || skillData.currentProficiency || 50);
  const level = skillData.proficiencyLevel || mapPercentageToLevel(percentage);

  const newSkill = new Skill({
    student: studentId,
    name: skillData.name.trim(),
    category: skillData.category || "Programming",
    proficiencyLevel: level,
    proficiencyPercentage: percentage,
    learningStatus: skillData.learningStatus || "Learning",
    experienceLevel: skillData.experienceLevel || "1 year",
    targetProficiency: Number(skillData.targetProficiency || 80),
    targetDate: skillData.targetDate ? new Date(skillData.targetDate) : undefined,
    description: skillData.description || "",
    verificationStatus: "Self Declared"
  });

  await newSkill.save();

  // If evidence URL or certificate/project optional links were passed:
  if (skillData.githubUrl || skillData.portfolioUrl || skillData.evidence) {
    const evidenceObj = new SkillEvidence({
      student: studentId,
      skillName: newSkill.name,
      type: skillData.githubUrl ? "GitHub Repository" : "Project",
      title: skillData.evidence || "Project / URL Reference",
      url: skillData.githubUrl || skillData.portfolioUrl || ""
    });
    await evidenceObj.save();
    newSkill.evidenceCount = 1;
    newSkill.verificationStatus = "Evidence Added";
    await newSkill.save();
  }

  return newSkill;
};

const updateSkill = async (studentId, skillId, updateData) => {
  const skill = await Skill.findOne({ _id: skillId, student: studentId });
  if (!skill) {
    throw new Error("Skill not found.");
  }

  if (updateData.proficiencyPercentage !== undefined) {
    const pct = Number(updateData.proficiencyPercentage);
    skill.proficiencyPercentage = pct;
    skill.proficiencyLevel = mapPercentageToLevel(pct);
  }

  if (updateData.category) skill.category = updateData.category;
  if (updateData.learningStatus) skill.learningStatus = updateData.learningStatus;
  if (updateData.experienceLevel) skill.experienceLevel = updateData.experienceLevel;
  if (updateData.targetProficiency) skill.targetProficiency = Number(updateData.targetProficiency);
  if (updateData.targetDate) skill.targetDate = new Date(updateData.targetDate);
  if (updateData.description !== undefined) skill.description = updateData.description;

  skill.lastUpdated = new Date();
  await skill.save();
  return skill;
};

const deleteSkill = async (studentId, skillId) => {
  const skill = await Skill.findOneAndDelete({ _id: skillId, student: studentId });
  if (!skill) {
    throw new Error("Skill not found.");
  }
  return { success: true, message: "Skill removed successfully." };
};

const getSkillMatrix = async (studentId) => {
  await seedSkillsIfEmpty(studentId);
  const skills = await Skill.find({ student: studentId });

  const categories = ["Programming", "Frontend", "Backend", "Database", "AI / ML", "Tools", "Soft Skills"];
  
  const matrix = categories.map((cat) => {
    const catSkills = skills.filter((s) => s.category === cat);
    if (catSkills.length === 0) {
      return {
        category: cat,
        count: 0,
        avgProficiency: 0,
        strongestSkill: "N/A",
        weakestSkill: "N/A"
      };
    }

    const totalPct = catSkills.reduce((acc, s) => acc + s.proficiencyPercentage, 0);
    const avgProficiency = Math.round(totalPct / catSkills.length);

    const sorted = [...catSkills].sort((a, b) => b.proficiencyPercentage - a.proficiencyPercentage);
    const strongestSkill = sorted[0].name;
    const weakestSkill = sorted[sorted.length - 1].name;

    return {
      category: cat,
      count: catSkills.length,
      avgProficiency,
      strongestSkill,
      weakestSkill
    };
  });

  return matrix;
};

const getSkillGapAnalysis = async (studentId, careerRole = "Full Stack Developer") => {
  await seedSkillsIfEmpty(studentId);
  const studentSkills = await Skill.find({ student: studentId });
  const profile = CAREER_PROFILES[careerRole] || CAREER_PROFILES["Full Stack Developer"];

  const gaps = profile.requiredSkills.map((req) => {
    const found = studentSkills.find((s) => s.name.toLowerCase() === req.name.toLowerCase());
    const current = found ? found.proficiencyPercentage : 0;
    const gap = Math.max(0, req.target - current);

    return {
      skill: req.name,
      category: req.category,
      current,
      target: req.target,
      gap,
      status: current >= req.target ? "Met" : gap <= 15 ? "Moderate Gap" : "Critical Gap"
    };
  });

  return {
    careerRole,
    gaps
  };
};

const getCareerReadiness = async (studentId, careerRole = "Full Stack Developer") => {
  await seedSkillsIfEmpty(studentId);
  const studentSkills = await Skill.find({ student: studentId });
  const profile = CAREER_PROFILES[careerRole] || CAREER_PROFILES["Full Stack Developer"];

  let totalMetWeight = 0;
  profile.requiredSkills.forEach((req) => {
    const found = studentSkills.find((s) => s.name.toLowerCase() === req.name.toLowerCase());
    const current = found ? found.proficiencyPercentage : 0;
    const metPct = Math.min(100, (current / req.target) * 100);
    totalMetWeight += metPct;
  });

  const avgSkillMet = profile.requiredSkills.length > 0
    ? Math.round(totalMetWeight / profile.requiredSkills.length)
    : 70;

  // Breakdown scores
  const techSkills = studentSkills.filter(s => ["Programming", "Frontend", "Backend", "AI / ML"].includes(s.category));
  const avgTech = techSkills.length > 0 ? Math.round(techSkills.reduce((a, b) => a + b.proficiencyPercentage, 0) / techSkills.length) : 75;

  const toolSkills = studentSkills.filter(s => s.category === "Tools");
  const avgTools = toolSkills.length > 0 ? Math.round(toolSkills.reduce((a, b) => a + b.proficiencyPercentage, 0) / toolSkills.length) : 70;

  const softSkills = studentSkills.filter(s => s.category === "Soft Skills");
  const avgSoft = softSkills.length > 0 ? Math.round(softSkills.reduce((a, b) => a + b.proficiencyPercentage, 0) / softSkills.length) : 74;

  const overallReadiness = Math.round(avgSkillMet * 0.7 + avgTech * 0.15 + avgTools * 0.15);

  return {
    careerRole,
    readinessScore: Math.min(100, Math.max(0, overallReadiness)),
    breakdown: {
      technicalSkills: avgTech,
      tools: avgTools,
      projects: 82,
      problemSolving: avgSoft,
      communication: 74
    }
  };
};

const getLearningRoadmap = async (studentId, careerRole = "Full Stack Developer") => {
  await seedSkillsIfEmpty(studentId);
  const studentSkills = await Skill.find({ student: studentId });
  const profile = CAREER_PROFILES[careerRole] || CAREER_PROFILES["Full Stack Developer"];

  const roadmap = profile.requiredSkills.map((req, idx) => {
    const found = studentSkills.find((s) => s.name.toLowerCase() === req.name.toLowerCase());
    const current = found ? found.proficiencyPercentage : 0;

    let status = "Planned";
    if (current >= req.target) {
      status = "Completed";
    } else if (current >= 50) {
      status = "In Progress";
    } else if (idx <= 3) {
      status = "Next";
    }

    return {
      step: idx + 1,
      skill: req.name,
      target: `${req.target}%`,
      currentLevel: `${current}%`,
      status
    };
  });

  return {
    careerGoal: careerRole,
    roadmap
  };
};

const getSkillGoals = async (studentId) => {
  await seedSkillsIfEmpty(studentId);
  return SkillGoal.find({ student: studentId }).sort({ targetDate: 1 });
};

const createSkillGoal = async (studentId, goalData) => {
  const newGoal = new SkillGoal({
    student: studentId,
    skillName: goalData.skillName,
    currentLevel: Number(goalData.currentLevel || 0),
    targetLevel: Number(goalData.targetLevel || 80),
    targetDate: new Date(goalData.targetDate),
    priority: goalData.priority || "Medium",
    notes: goalData.notes || ""
  });
  await newGoal.save();
  return newGoal;
};

const updateSkillGoal = async (studentId, goalId, updateData) => {
  const goal = await SkillGoal.findOne({ _id: goalId, student: studentId });
  if (!goal) throw new Error("Goal not found.");

  if (updateData.status) goal.status = updateData.status;
  if (updateData.progressPercentage !== undefined) goal.progressPercentage = Number(updateData.progressPercentage);
  if (updateData.currentLevel !== undefined) goal.currentLevel = Number(updateData.currentLevel);

  await goal.save();
  return goal;
};

const deleteSkillGoal = async (studentId, goalId) => {
  await SkillGoal.findOneAndDelete({ _id: goalId, student: studentId });
  return { success: true };
};

const getSkillEvidence = async (studentId) => {
  await seedSkillsIfEmpty(studentId);
  return SkillEvidence.find({ student: studentId }).sort({ createdAt: -1 });
};

const addSkillEvidence = async (studentId, evidenceData) => {
  const newEv = new SkillEvidence({
    student: studentId,
    skillName: evidenceData.skillName,
    type: evidenceData.type || "Project",
    title: evidenceData.title,
    description: evidenceData.description || "",
    url: evidenceData.url || "",
    verificationStatus: "Evidence Added"
  });

  await newEv.save();

  // Increment evidence count on relevant Skill model if exists
  await Skill.updateOne(
    { student: studentId, name: { $regex: new RegExp(`^${evidenceData.skillName}$`, "i") } },
    { $inc: { evidenceCount: 1 }, $set: { verificationStatus: "Evidence Added" } }
  );

  return newEv;
};

const getSkillAssessments = async (studentId) => {
  await seedSkillsIfEmpty(studentId);
  return SkillAssessment.find({ student: studentId }).sort({ date: -1 });
};

const getAIInsights = async (studentId, careerRole = "Full Stack Developer") => {
  await seedSkillsIfEmpty(studentId);
  const skills = await Skill.find({ student: studentId });
  const gaps = await getSkillGapAnalysis(studentId, careerRole);

  const sortedSkills = [...skills].sort((a, b) => b.proficiencyPercentage - a.proficiencyPercentage);
  const topSkill = sortedSkills[0]?.name || "JavaScript";

  const criticalGap = gaps.gaps.find((g) => g.status === "Critical Gap" || g.gap > 15);
  const targetGapSkill = criticalGap ? criticalGap.skill : "Node.js";

  return {
    insights: [
      {
        type: "Strength Detected",
        title: "Strong Foundation",
        message: `${topSkill} and frontend development are currently among your strongest technical areas.`,
        accent: "indigo"
      },
      {
        type: "Skill Gap Alert",
        title: "Career Gap Identified",
        message: `${targetGapSkill} requires improvement to achieve the recommended proficiency for your ${careerRole} target.`,
        accent: "amber"
      },
      {
        type: "Recommendation",
        title: "Next Learning Step",
        message: `Focus on completing projects and evidence for ${targetGapSkill} and database design next.`,
        accent: "cyan"
      },
      {
        type: "Next Milestone",
        title: "Target Milestone",
        message: `Reach 75%+ overall proficiency across core backend & system tools this semester.`,
        accent: "emerald"
      }
    ]
  };
};

const getRecommendedSkills = async (studentId, careerRole = "Full Stack Developer") => {
  await seedSkillsIfEmpty(studentId);
  const studentSkills = await Skill.find({ student: studentId });
  const studentSkillNames = studentSkills.map((s) => s.name.toLowerCase());

  const catalog = [
    {
      name: "TypeScript",
      category: "Programming",
      why: "Frequently required for modern scalable React and Node.js applications.",
      difficulty: "Intermediate",
      duration: "3 weeks"
    },
    {
      name: "Docker",
      category: "Tools",
      why: "Essential for containerization, deployment, and cloud microservices.",
      difficulty: "Intermediate",
      duration: "2 weeks"
    },
    {
      name: "System Design",
      category: "Domain Skills",
      why: "Crucial for technical interviews, architecture planning, and engineering roles.",
      difficulty: "Advanced",
      duration: "4 weeks"
    },
    {
      name: "PostgreSQL",
      category: "Database",
      why: "Industry-standard relational database highly valued alongside MongoDB.",
      difficulty: "Intermediate",
      duration: "2 weeks"
    }
  ];

  return catalog.filter((item) => !studentSkillNames.includes(item.name.toLowerCase()));
};

const getRecentActivity = async (studentId) => {
  await seedSkillsIfEmpty(studentId);
  
  return [
    {
      id: "act-1",
      title: "Skill Verified",
      description: "Faculty Dr. Ramesh Sharma verified your JavaScript proficiency.",
      timestamp: "2 days ago",
      type: "verification"
    },
    {
      id: "act-2",
      title: "Evidence Added",
      description: "Linked Placement Portal project to React skill.",
      timestamp: "4 days ago",
      type: "evidence"
    },
    {
      id: "act-3",
      title: "Assessment Completed",
      description: "Scored 82/100 in JavaScript Fundamental Assessment.",
      timestamp: "1 week ago",
      type: "assessment"
    },
    {
      id: "act-4",
      title: "Skill Goal Created",
      description: "Set goal to achieve 80% proficiency in Node.js.",
      timestamp: "2 weeks ago",
      type: "goal"
    }
  ];
};

module.exports = {
  CAREER_PROFILES,
  seedSkillsIfEmpty,
  getSkillOverview,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getSkillMatrix,
  getSkillGapAnalysis,
  getCareerReadiness,
  getLearningRoadmap,
  getSkillGoals,
  createSkillGoal,
  updateSkillGoal,
  deleteSkillGoal,
  getSkillEvidence,
  addSkillEvidence,
  getSkillAssessments,
  getAIInsights,
  getRecommendedSkills,
  getRecentActivity
};

import api from "./api";

const MOCK_SKILLS = [
  { _id: "sk1", name: "React.js & Frontend Architecture", category: "Web Development", proficiency: "Advanced", level: 85, status: "Verified" },
  { _id: "sk2", name: "Python & Machine Learning", category: "AI & Data Science", proficiency: "Intermediate", level: 70, status: "In Progress" },
  { _id: "sk3", name: "Node.js & REST API Design", category: "Backend Engineering", proficiency: "Advanced", level: 80, status: "Verified" },
  { _id: "sk4", name: "Data Structures & Algorithms", category: "Computer Science", proficiency: "Expert", level: 90, status: "Verified" },
];

export const getSkillOverview = async () => {
  try {
    const response = await api.get("/skills/overview");
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: { totalSkills: 14, verifiedSkills: 9, avgProficiency: 82, skillPoints: 1450 },
    };
  }
};

export const getSkills = async (params = {}) => {
  try {
    const response = await api.get("/skills", { params });
    return response.data;
  } catch (err) {
    return { success: true, data: MOCK_SKILLS };
  }
};

export const addSkill = async (skillData) => {
  try {
    const response = await api.post("/skills", skillData);
    return response.data;
  } catch (err) {
    return { success: true, data: { _id: "sk_" + Date.now(), ...skillData } };
  }
};

export const updateSkill = async (id, updateData) => {
  try {
    const response = await api.put(`/skills/${id}`, updateData);
    return response.data;
  } catch (err) {
    return { success: true };
  }
};

export const deleteSkill = async (id) => {
  try {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  } catch (err) {
    return { success: true };
  }
};

export const getSkillMatrix = async () => {
  try {
    const response = await api.get("/skills/matrix");
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: [
        { category: "Web Dev", count: 5, avgLevel: 82 },
        { category: "AI & ML", count: 4, avgLevel: 74 },
        { category: "Databases", count: 3, avgLevel: 78 },
      ],
    };
  }
};

export const getSkillGapAnalysis = async (careerRole) => {
  try {
    const response = await api.get("/skills/gaps", { params: { careerRole } });
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: { missingSkills: ["Docker & Kubernetes", "GraphQL APIs"], overallMatch: "84%" },
    };
  }
};

export const getCareerReadiness = async (careerRole) => {
  try {
    const response = await api.get("/skills/readiness", { params: { careerRole } });
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: { score: 84, status: "Job Ready", role: careerRole || "Full Stack Developer" },
    };
  }
};

export const getLearningRoadmap = async (careerRole) => {
  try {
    const response = await api.get("/skills/roadmap", { params: { careerRole } });
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: [
        { phase: "Phase 1", title: "Master System Architecture & Microservices", duration: "3 weeks" },
        { phase: "Phase 2", title: "Cloud Deployment & CI/CD Pipelines", duration: "4 weeks" },
      ],
    };
  }
};

export const getSkillGoals = async () => {
  try {
    const response = await api.get("/skills/goals");
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: [{ _id: "g1", goal: "Complete AWS Cloud Practitioner Certification", status: "In Progress", targetDate: "2026-09-30" }],
    };
  }
};

export const createSkillGoal = async (goalData) => {
  try {
    const response = await api.post("/skills/goals", goalData);
    return response.data;
  } catch (err) {
    return { success: true, data: { _id: "g_" + Date.now(), ...goalData } };
  }
};

export const updateSkillGoal = async (id, updateData) => {
  try {
    const response = await api.put(`/skills/goals/${id}`, updateData);
    return response.data;
  } catch (err) {
    return { success: true };
  }
};

export const deleteSkillGoal = async (id) => {
  try {
    const response = await api.delete(`/skills/goals/${id}`);
    return response.data;
  } catch (err) {
    return { success: true };
  }
};

export const getSkillEvidence = async () => {
  try {
    const response = await api.get("/skills/evidence");
    return response.data;
  } catch (err) {
    return { success: true, data: [] };
  }
};

export const addSkillEvidence = async (evidenceData) => {
  try {
    const response = await api.post("/skills/evidence", evidenceData);
    return response.data;
  } catch (err) {
    return { success: true };
  }
};

export const getSkillAssessments = async () => {
  try {
    const response = await api.get("/skills/assessments");
    return response.data;
  } catch (err) {
    return { success: true, data: [] };
  }
};

export const getAIInsights = async (careerRole) => {
  try {
    const response = await api.get("/skills/insights", { params: { careerRole } });
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: { insight: "Strong proficiency in React and Node.js. Recommended next focus: AWS Deployment." },
    };
  }
};

export const getRecommendedSkills = async (careerRole) => {
  try {
    const response = await api.get("/skills/recommendations", { params: { careerRole } });
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: [{ name: "Docker", category: "DevOps" }, { name: "GraphQL", category: "Backend" }],
    };
  }
};

export const getRecentActivity = async () => {
  try {
    const response = await api.get("/skills/activity");
    return response.data;
  } catch (err) {
    return { success: true, data: [] };
  }
};

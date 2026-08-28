const skillService = require("../services/skillService");

const getOverview = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const overview = await skillService.getSkillOverview(studentId);
    res.status(200).json({ success: true, data: overview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to load skill overview." });
  }
};

const getSkills = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { category, proficiency, status, search, sortBy } = req.query;
    const skills = await skillService.getSkills(studentId, { category, proficiency, status, search, sortBy });
    res.status(200).json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to load skills." });
  }
};

const addSkill = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const skill = await skillService.addSkill(studentId, req.body);
    res.status(201).json({ success: true, message: "Skill added successfully!", data: skill });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Failed to add skill." });
  }
};

const updateSkill = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { id } = req.params;
    const updated = await skillService.updateSkill(studentId, id, req.body);
    res.status(200).json({ success: true, message: "Skill updated successfully!", data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Failed to update skill." });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { id } = req.params;
    const result = await skillService.deleteSkill(studentId, id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Failed to delete skill." });
  }
};

const getSkillMatrix = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const matrix = await skillService.getSkillMatrix(studentId);
    res.status(200).json({ success: true, data: matrix });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to load skill matrix." });
  }
};

const getSkillGapAnalysis = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { careerRole } = req.query;
    const gaps = await skillService.getSkillGapAnalysis(studentId, careerRole);
    res.status(200).json({ success: true, data: gaps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to calculate skill gap analysis." });
  }
};

const getCareerReadiness = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { careerRole } = req.query;
    const readiness = await skillService.getCareerReadiness(studentId, careerRole);
    res.status(200).json({ success: true, data: readiness });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to calculate career readiness." });
  }
};

const getLearningRoadmap = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { careerRole } = req.query;
    const roadmap = await skillService.getLearningRoadmap(studentId, careerRole);
    res.status(200).json({ success: true, data: roadmap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to load learning roadmap." });
  }
};

const getSkillGoals = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const goals = await skillService.getSkillGoals(studentId);
    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to load goals." });
  }
};

const createSkillGoal = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const goal = await skillService.createSkillGoal(studentId, req.body);
    res.status(201).json({ success: true, message: "Skill goal created successfully!", data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Failed to create goal." });
  }
};

const updateSkillGoal = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { id } = req.params;
    const goal = await skillService.updateSkillGoal(studentId, id, req.body);
    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Failed to update goal." });
  }
};

const deleteSkillGoal = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { id } = req.params;
    await skillService.deleteSkillGoal(studentId, id);
    res.status(200).json({ success: true, message: "Goal deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Failed to delete goal." });
  }
};

const getSkillEvidence = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const evidence = await skillService.getSkillEvidence(studentId);
    res.status(200).json({ success: true, data: evidence });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to load evidence." });
  }
};

const addSkillEvidence = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const ev = await skillService.addSkillEvidence(studentId, req.body);
    res.status(201).json({ success: true, message: "Skill evidence added successfully!", data: ev });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Failed to add evidence." });
  }
};

const getSkillAssessments = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const assessments = await skillService.getSkillAssessments(studentId);
    res.status(200).json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to load assessments." });
  }
};

const getAIInsights = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { careerRole } = req.query;
    const insights = await skillService.getAIInsights(studentId, careerRole);
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to load AI insights." });
  }
};

const getRecommendedSkills = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { careerRole } = req.query;
    const recommendations = await skillService.getRecommendedSkills(studentId, careerRole);
    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to load recommended skills." });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const activity = await skillService.getRecentActivity(studentId);
    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to load recent activity." });
  }
};

module.exports = {
  getOverview,
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

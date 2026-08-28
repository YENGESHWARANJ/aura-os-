const projectService = require("../services/projectService");

const getStats = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const stats = await projectService.getProjectStats(studentId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load project statistics." });
  }
};

const getBatches = async (req, res) => {
  try {
    const batches = await projectService.getProjectBatches();
    res.status(200).json({ success: true, count: batches.length, data: batches });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load project batches." });
  }
};

const getBatchById = async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await projectService.getBatchById(batchId);
    res.status(200).json({ success: true, data: batch });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message || "Batch not found." });
  }
};

const getAvailableProjects = async (req, res) => {
  try {
    const { batchId, domain, search } = req.query;
    const projects = await projectService.getAvailableProjects(batchId, domain, search);
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load available projects." });
  }
};

const getStudentTeam = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const { batchId } = req.query;
    const team = await projectService.getStudentTeam(studentId, batchId);
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load team information." });
  }
};

const createTeam = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const { batchId, name, domainPreference } = req.body;
    const team = await projectService.createTeam(studentId, batchId, name, domainPreference);
    res.status(201).json({ success: true, message: "Team created successfully!", data: team });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Team creation failed." });
  }
};

const joinTeam = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const { batchId, teamCode } = req.body;
    const team = await projectService.joinTeam(studentId, batchId, teamCode);
    res.status(200).json({ success: true, message: "Successfully joined team!", data: team });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Failed to join team." });
  }
};

const selectProject = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const { teamId, projectId } = req.body;
    const updatedTeam = await projectService.selectProjectForTeam(studentId, teamId, projectId);
    res.status(200).json({ success: true, message: "Project selected successfully!", data: updatedTeam });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Project selection failed." });
  }
};

const getTeamSubmissions = async (req, res) => {
  try {
    const { teamId, phaseNumber } = req.query;
    const submissions = await projectService.getTeamSubmissionsAndEvaluations(teamId, phaseNumber);
    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load submissions." });
  }
};

const submitDeliverable = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const { teamId, phaseNumber, title, type, githubUrl, demoUrl, notes } = req.body;

    let fileData = null;
    if (req.file) {
      fileData = {
        name: req.file.originalname,
        path: `/uploads/projects/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    }

    const updatedSubmissions = await projectService.submitDeliverable(studentId, teamId, Number(phaseNumber), {
      title,
      type,
      file: fileData,
      githubUrl,
      demoUrl,
      notes
    });

    res.status(200).json({
      success: true,
      message: "Deliverable uploaded successfully!",
      data: updatedSubmissions
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Submission failed." });
  }
};

module.exports = {
  getStats,
  getBatches,
  getBatchById,
  getAvailableProjects,
  getStudentTeam,
  createTeam,
  joinTeam,
  selectProject,
  getTeamSubmissions,
  submitDeliverable
};

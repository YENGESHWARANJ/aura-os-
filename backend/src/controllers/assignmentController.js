const assignmentService = require("../services/assignmentService");
const path = require("path");
const fs = require("fs");

const getAssignments = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const assignments = await assignmentService.getStudentAssignments(studentId, req.query);
    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to load assignments."
    });
  }
};

const getAssignmentStats = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const stats = await assignmentService.getStudentStats(studentId);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve assignment statistics."
    });
  }
};

const getUpcomingDeadlines = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const upcoming = await assignmentService.getUpcomingDeadlines(studentId);
    res.status(200).json({
      success: true,
      data: upcoming
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to load upcoming deadlines."
    });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const { id } = req.params;
    const assignment = await assignmentService.getAssignmentById(studentId, id);
    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "Assignment not found."
    });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const { id } = req.params;
    const { notes } = req.body;

    let fileData = null;
    if (req.file) {
      fileData = {
        name: req.file.originalname,
        path: `/uploads/submissions/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    } else {
      return res.status(400).json({
        success: false,
        message: "Please attach a file for submission."
      });
    }

    const updatedAssignment = await assignmentService.submitAssignment(
      studentId,
      id,
      fileData,
      notes
    );

    res.status(200).json({
      success: true,
      message: "Assignment submitted successfully!",
      data: updatedAssignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Submission failed."
    });
  }
};

module.exports = {
  getAssignments,
  getAssignmentStats,
  getUpcomingDeadlines,
  getAssignmentById,
  submitAssignment
};

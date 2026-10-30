const profileService = require("../services/profileService");

exports.getProfile = async (req, res) => {
  try {
    const data = await profileService.getProfileOverview(req.user.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }
    res.json({ success: true, data });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ success: false, message: "Failed to load profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await profileService.updateProfile(req.user.id, req.body);
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }
    const avatarUrl = `/uploads/submissions/${req.file.filename}`;
    const user = await profileService.updateAvatar(req.user.id, avatarUrl, req.body?._id);
    res.json({ success: true, avatarUrl, user });
  } catch (err) {
    console.error("Upload avatar error:", err);
    res.status(500).json({ success: false, message: "Failed to upload avatar" });
  }
};

exports.deleteAvatar = async (req, res) => {
  try {
    const user = await profileService.deleteAvatar(req.user.id, req.body?._id || req.query?._id);
    res.json({ success: true, message: "Avatar removed", user });
  } catch (err) {
    console.error("Delete avatar error:", err);
    res.status(500).json({ success: false, message: "Failed to remove avatar" });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No resume file provided" });
    }
    const resumeData = {
      url: `/uploads/submissions/${req.file.filename}`,
      fileName: req.file.originalname,
      updatedAt: new Date(),
    };
    const user = await profileService.updateResume(req.user.id, resumeData, req.body?._id);
    res.json({ success: true, resume: resumeData, user });
  } catch (err) {
    console.error("Upload resume error:", err);
    res.status(500).json({ success: false, message: "Failed to upload resume" });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const user = await profileService.deleteResume(req.user.id, req.body?._id || req.query?._id);
    res.json({ success: true, message: "Resume deleted", user });
  } catch (err) {
    console.error("Delete resume error:", err);
    res.status(500).json({ success: false, message: "Failed to delete resume" });
  }
};

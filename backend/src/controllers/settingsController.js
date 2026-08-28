const settingsService = require("../services/settingsService");

exports.getSettings = async (req, res) => {
  try {
    const settings = await settingsService.getSettings(req.user.id);
    return res.json({ success: true, data: settings });
  } catch (err) {
    console.error("Get settings error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load settings. Please try again.",
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await settingsService.updateSettings(req.user.id, req.body);
    return res.json({
      success: true,
      data: settings,
      message: "Settings updated successfully.",
    });
  } catch (err) {
    console.error("Update settings error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update settings. Please try again.",
    });
  }
};

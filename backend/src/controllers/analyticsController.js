const analyticsService = require("../services/analyticsService");

exports.getOverview = async (req, res) => {
  try {
    const semester = req.query.semester || "All";
    const data = await analyticsService.getAnalyticsOverview(req.user.id, semester);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Analytics overview error:", err);
    res.status(500).json({ success: false, message: "Failed to load analytics overview" });
  }
};

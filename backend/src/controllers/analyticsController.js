const analyticsService = require("../services/analyticsService");

exports.getOverview = async (req, res) => {
  try {
    const cohortOverview = await analyticsService.getCohortOverview();
    const semester = req.query.semester || "All";
    const personalData = req.user?.id
      ? await analyticsService.getAnalyticsOverview(req.user.id, semester).catch(() => null)
      : null;

    res.json({
      success: true,
      data: {
        ...cohortOverview,
        // Also support personal analytics breakdown
        personal: personalData,
      },
    });
  } catch (err) {
    console.error("Analytics overview error:", err);
    res.status(500).json({ success: false, message: "Failed to load analytics overview" });
  }
};

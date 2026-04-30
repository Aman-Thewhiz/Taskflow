const { calculateAnalytics } = require("../utils/analytics");

const getAnalytics = async (req, res) => {
  try {
    const analytics = await calculateAnalytics(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: analytics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      data: null,
    });
  }
};

module.exports = {
  getAnalytics,
};

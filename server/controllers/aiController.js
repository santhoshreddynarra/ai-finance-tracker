import { getFinancialInsights } from "../services/aiService.js";

// @desc    Get AI Financial Insights
// @route   GET /api/ai/insights
// @access  Private
export const getInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const insights = await getFinancialInsights(userId);

    return res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (err) {
    console.error("AI Controller error:", err);
    return res.status(500).json({ success: false, message: "Server Error generating insights" });
  }
};

import Transaction from "../models/Transaction.js";

// ─────────────────────────────────────────────
// @desc    Get top-level dashboard summary (Income, Expense, Balance)
// @route   GET /api/analytics/summary
// @access  Private
// ─────────────────────────────────────────────
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const summary = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    const stats = summary[0] || { totalIncome: 0, totalExpense: 0 };
    const netBalance = stats.totalIncome - stats.totalExpense;
    
    let savingsRate = 0;
    if (stats.totalIncome > 0) {
      savingsRate = ((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100;
      if (savingsRate < 0) savingsRate = 0;
    }

    return res.status(200).json({
      success: true,
      data: {
        totalIncome: stats.totalIncome,
        totalExpense: stats.totalExpense,
        netBalance,
        savingsRate: parseFloat(savingsRate.toFixed(2)),
      },
    });
  } catch (err) {
    console.error("Analytics summary error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

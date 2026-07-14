import Transaction from "../models/Transaction.js";

// ─────────────────────────────────────────────
// @desc    Get filtered report data (summary + transactions)
// @route   GET /api/reports
// @access  Private
// ─────────────────────────────────────────────
export const getReportData = async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;
    const userId = req.user._id;

    // Build the query object
    const query = { userId };

    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate);
      if (endDate) query.transactionDate.$lte = new Date(endDate);
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (type && type !== "All") {
      query.type = type;
    }

    // Execute aggregation for summary stats
    const summary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
    ]);

    const stats = summary[0] || { totalIncome: 0, totalExpense: 0 };
    const netSavings = stats.totalIncome - stats.totalExpense;

    // Fetch the actual transactions matching the query
    const transactions = await Transaction.find(query).sort({ transactionDate: -1 });

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome: stats.totalIncome,
          totalExpense: stats.totalExpense,
          netSavings,
        },
        transactions,
      },
    });
  } catch (err) {
    console.error("Report generation error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

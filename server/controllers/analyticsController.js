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

// ─────────────────────────────────────────────
// @desc    Get expense grouped by category
// @route   GET /api/analytics/category
// @access  Private
// ─────────────────────────────────────────────
export const getExpenseByCategory = async (req, res) => {
  try {
    const userId = req.user._id;

    const categoryData = await Transaction.aggregate([
      { $match: { userId, type: "expense" } },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const formattedData = categoryData.map(item => ({
      category: item._id,
      amount: item.totalAmount
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (err) {
    console.error("Analytics category error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─────────────────────────────────────────────
// @desc    Get monthly income/expense trends
// @route   GET /api/analytics/trends
// @access  Private
// ─────────────────────────────────────────────
export const getMonthlyTrends = async (req, res) => {
  try {
    const userId = req.user._id;

    // We'll get data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const trends = await Transaction.aggregate([
      { 
        $match: { 
          userId,
          transactionDate: { $gte: sixMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$transactionDate" },
            month: { $month: "$transactionDate" }
          },
          income: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formattedTrends = trends.map(item => {
      const date = new Date(item._id.year, item._id.month - 1);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        income: item.income,
        expense: item.expense
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedTrends,
    });
  } catch (err) {
    console.error("Analytics trends error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─────────────────────────────────────────────
// @desc    Get recent transactions
// @route   GET /api/analytics/recent
// @access  Private
// ─────────────────────────────────────────────
export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ transactionDate: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    console.error("Analytics recent transactions error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

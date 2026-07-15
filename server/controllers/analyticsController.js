import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";

// @desc    Get complete dashboard analytics data
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get the current month and year for monthly calculations
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // 1. Get Top-Level Summary (Income, Expense, Savings) for the current month
    const summary = await Transaction.aggregate([
      { 
        $match: { 
          userId,
          transactionDate: { $gte: currentMonthStart }
        } 
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
          highestIncome: {
            $max: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          largestExpense: {
            $max: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          }
        },
      },
    ]);

    const stats = summary[0] || { totalIncome: 0, totalExpense: 0, highestIncome: 0, largestExpense: 0 };
    const totalSavings = stats.totalIncome - stats.totalExpense;

    // Calculate Average Daily Spending
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const averageDailySpending = currentDay > 0 ? (stats.totalExpense / currentDay) : 0;

    // 2. Fetch User Budget to calculate Remaining Budget
    const userBudget = await Budget.findOne({ userId });
    const monthlyBudget = userBudget ? userBudget.monthlyBudget : 0;
    const remainingBudget = Math.max(0, monthlyBudget - stats.totalExpense);

    // 3. Category Breakdown (Expenses for current month)
    const categoryData = await Transaction.aggregate([
      { 
        $match: { 
          userId, 
          type: "expense",
          transactionDate: { $gte: currentMonthStart } 
        } 
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const categoryBreakdown = categoryData.map(item => ({
      name: item._id,
      value: item.totalAmount
    }));

    // 4. Monthly Trend (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // 6 months including current
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

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

    const monthlyTrend = trends.map(item => {
      const date = new Date(item._id.year, item._id.month - 1);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        income: item.income,
        expense: item.expense
      };
    });

    // 5. Last 5 Transactions
    const recentTransactions = await Transaction.find({ userId })
      .sort({ transactionDate: -1, createdAt: -1 })
      .limit(5);

    // Combine and send response
    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome: stats.totalIncome,
          totalExpense: stats.totalExpense,
          highestIncome: stats.highestIncome,
          largestExpense: stats.largestExpense,
          averageDailySpending,
          totalSavings,
          monthlyBudget,
          remainingBudget
        },
        categoryBreakdown,
        monthlyTrend,
        recentTransactions,
      },
    });
  } catch (err) {
    console.error("Dashboard Analytics error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

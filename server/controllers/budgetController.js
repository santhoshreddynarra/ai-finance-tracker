import Budget from "../models/Budget.js";

// @desc    Get user's budget
// @route   GET /api/budgets
// @access  Private
export const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user._id });
    
    // If no budget is found, return a default empty state
    if (!budget) {
      return res.status(200).json({
        success: true,
        data: {
          monthlyBudget: 0,
          categoryBudgets: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (err) {
    console.error("Get budget error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Upsert user's budget (Create or Update)
// @route   POST /api/budgets
// @access  Private
export const upsertBudget = async (req, res) => {
  try {
    const { monthlyBudget, categoryBudgets } = req.body;

    if (monthlyBudget === undefined) {
      return res.status(400).json({ success: false, message: "Please provide a monthlyBudget" });
    }

    let budget = await Budget.findOne({ userId: req.user._id });

    if (budget) {
      // Update existing
      budget.monthlyBudget = monthlyBudget;
      if (categoryBudgets) {
        budget.categoryBudgets = categoryBudgets;
      }
      await budget.save();
    } else {
      // Create new
      budget = await Budget.create({
        userId: req.user._id,
        monthlyBudget,
        categoryBudgets: categoryBudgets || [],
      });
    }

    return res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    console.error("Upsert budget error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

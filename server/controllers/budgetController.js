import Budget from "../models/Budget.js";

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });
    res.status(200).json({
      success: true,
      data: budgets,
    });
  } catch (err) {
    console.error("Get budgets error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create or update a budget for a category
// @route   POST /api/budgets
// @access  Private
export const upsertBudget = async (req, res) => {
  try {
    const { category, amount, period } = req.body;

    if (!category || !amount) {
      return res.status(400).json({ success: false, message: "Please provide category and amount" });
    }

    let budget = await Budget.findOne({ userId: req.user._id, category });

    if (budget) {
      // Update existing budget
      budget.amount = amount;
      if (period) budget.period = period;
      await budget.save();
    } else {
      // Create new budget
      budget = await Budget.create({
        userId: req.user._id,
        category,
        amount,
        period: period || "monthly",
      });
    }

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    console.error("Upsert budget error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    if (budget.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to delete this budget" });
    }

    await budget.deleteOne();

    res.status(200).json({
      success: true,
      message: "Budget deleted",
    });
  } catch (err) {
    console.error("Delete budget error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

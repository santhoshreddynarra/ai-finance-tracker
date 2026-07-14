import Transaction from "../models/Transaction.js";

// ─────────────────────────────────────────────
// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
// ─────────────────────────────────────────────
export const createTransaction = async (req, res) => {
  try {
    const { type, title, amount, category, paymentMethod, description, transactionDate } = req.body;

    const transaction = await Transaction.create({
      type,
      title,
      amount,
      category,
      paymentMethod,
      description,
      transactionDate: transactionDate || Date.now(),
      userId: req.user._id,
    });

    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    console.error("Create transaction error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─────────────────────────────────────────────
// @desc    Get all transactions for user (with pagination, filter, search, sort)
// @route   GET /api/transactions
// @access  Private
// ─────────────────────────────────────────────
export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, category, startDate, endDate, search, sort } = req.query;
    
    // Build query object
    const query = { userId: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate);
      if (endDate) query.transactionDate.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Build sort object
    let sortObj = { transactionDate: -1 }; // Default Newest
    if (sort === "oldest") sortObj = { transactionDate: 1 };
    if (sort === "highest") sortObj = { amount: -1 };
    if (sort === "lowest") sortObj = { amount: 1 };

    // Execute query with pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const total = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .sort(sortObj)
      .skip(startIndex)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: transactions,
    });
  } catch (err) {
    console.error("Get transactions error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─────────────────────────────────────────────
// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
// ─────────────────────────────────────────────
export const updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    // Ensure user owns transaction
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to update this transaction" });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    console.error("Update transaction error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─────────────────────────────────────────────
// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
// ─────────────────────────────────────────────
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    // Ensure user owns transaction
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to delete this transaction" });
    }

    await transaction.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Transaction deleted",
    });
  } catch (err) {
    console.error("Delete transaction error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

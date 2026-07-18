import Category from "../models/Category.js";

// @desc    Get all categories for user (including defaults)
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
  try {
    // Get custom categories for the user AND default categories (userId: null)
    let categories = await Category.find({
      $or: [{ userId: req.user._id }, { isDefault: true, userId: null }],
    }).sort({ type: 1, name: 1 });

    const hasDefaults = categories.some((c) => c.isDefault && c.userId === null);

    if (!hasDefaults) {
      // Seed default categories globally if none exist
      const defaultCategories = [
        { name: 'Food', type: 'expense', isDefault: true, userId: null },
        { name: 'Transport', type: 'expense', isDefault: true, userId: null },
        { name: 'Shopping', type: 'expense', isDefault: true, userId: null },
        { name: 'Bills', type: 'expense', isDefault: true, userId: null },
        { name: 'Entertainment', type: 'expense', isDefault: true, userId: null },
        { name: 'Healthcare', type: 'expense', isDefault: true, userId: null },
        { name: 'Education', type: 'expense', isDefault: true, userId: null },
        { name: 'Salary', type: 'income', isDefault: true, userId: null },
        { name: 'Freelance', type: 'income', isDefault: true, userId: null },
        { name: 'Investment', type: 'income', isDefault: true, userId: null },
        { name: 'Others', type: 'expense', isDefault: true, userId: null },
        { name: 'Others', type: 'income', isDefault: true, userId: null },
      ];
      try {
        await Category.insertMany(defaultCategories, { ordered: false });
      } catch (err) {
        // Ignore duplicate key errors from concurrent requests
      }
      
      // Fetch again after seeding
      categories = await Category.find({
        $or: [{ userId: req.user._id }, { isDefault: true, userId: null }],
      }).sort({ type: 1, name: 1 });
    }

    // Deduplicate to prevent older users with user-specific defaults from seeing duplicates
    const uniqueCategoriesMap = new Map();
    categories.forEach(cat => {
      const key = `${cat.type}-${cat.name}`;
      // Prefer user-specific over global default if there's a duplicate
      if (!uniqueCategoriesMap.has(key) || cat.userId !== null) {
        uniqueCategoriesMap.set(key, cat);
      }
    });
    categories = Array.from(uniqueCategoriesMap.values());

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create a custom category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ success: false, message: "Please provide name and type" });
    }

    const category = await Category.create({
      name,
      type,
      userId: req.user._id,
      isDefault: false,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Category with this name and type already exists" });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    console.error("Create category error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update a custom category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (category.isDefault || category.userId?.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to update this category" });
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, type },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Category with this name and type already exists" });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    console.error("Update category error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a custom category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (category.isDefault || category.userId?.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to delete this category" });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted",
    });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

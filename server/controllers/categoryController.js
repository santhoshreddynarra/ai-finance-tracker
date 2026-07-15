import Category from "../models/Category.js";

// @desc    Get all categories for user (including defaults)
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
  try {
    // Get custom categories for the user AND default categories (userId: null)
    const categories = await Category.find({
      $or: [{ userId: req.user._id }, { isDefault: true }],
    }).sort({ type: 1, name: 1 });

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

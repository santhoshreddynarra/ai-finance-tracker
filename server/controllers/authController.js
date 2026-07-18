import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Category from "../models/Category.js";

// ─────────────────────────────────────────────
// Private Helpers
// ─────────────────────────────────────────────

/**
 * Generate a signed JWT for a given user ID.
 * Uses JWT_SECRET and JWT_EXPIRE from environment variables.
 *
 * @param {string} userId - The MongoDB _id of the user.
 * @returns {string} Signed JWT token string.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

/**
 * Return a clean, safe user object — strips password and internal
 * Mongoose fields before sending to the client.
 *
 * @param {import("mongoose").Document} user - Mongoose user document.
 * @returns {object} Plain user object safe for API responses.
 */
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  preferences: user.preferences,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// ─────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
// ─────────────────────────────────────────────
export const signup = async (req, res) => {
  try {
    // 1. Extract and sanitize inputs
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    // 2. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    // 3. Check for duplicate email before attempting to save
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // 4. Create user — the model's pre-save hook handles password hashing
    const user = await User.create({ name, email, password });

    // Ensure global default categories exist
    const defaultCount = await Category.countDocuments({ isDefault: true, userId: null });
    if (defaultCount === 0) {
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
    }

    // 5. Generate JWT
    const token = generateToken(user._id);

    // 6. Return success response (201 Created)
    return res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    // Handle Mongoose validation errors explicitly for a clean response
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
    }

    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Authenticate user and return token
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    // 1. Extract inputs
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    // 2. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 3. Find user — must explicitly select password since it has select:false
    const user = await User.findOne({ email }).select("+password");

    // 4. Verify user exists and password matches
    //    Both checks run before responding to prevent user enumeration attacks.
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 5. Generate JWT
    const token = generateToken(user._id);

    // 6. Return success response (200 OK)
    return res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────────────
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
// ─────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if updating to an email that already exists
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      user: sanitizeUser(updatedUser),
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
// ─────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters.",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: "Incorrect current password.",
      });
    }

    user.password = newPassword;
    await user.save();

    // Optionally generate a new token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
      token, // return new token
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
// ─────────────────────────────────────────────
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify password before deleting
    if (!req.body.password || !(await user.matchPassword(req.body.password))) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    // Delete all associated data
    const mongoose = (await import("mongoose")).default;
    await mongoose.model("Transaction").deleteMany({ userId: user._id });
    await mongoose.model("Budget").deleteMany({ userId: user._id });
    await mongoose.model("Category").deleteMany({ userId: user._id });
    
    await user.deleteOne();

    return res.status(200).json({ success: true, message: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

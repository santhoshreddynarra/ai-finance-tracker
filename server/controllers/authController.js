import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

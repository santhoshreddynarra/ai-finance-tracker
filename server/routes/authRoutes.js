import { Router } from "express";
import { signup, login, getCurrentUser, updateProfile, changePassword, deleteAccount } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: { success: false, message: "Too many login attempts, please try again after 15 minutes" }
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 signup requests per windowMs
  message: { success: false, message: "Too many accounts created from this IP, please try again after an hour" }
});

// POST /api/auth/signup
router.post("/signup", signupLimiter, signup);

// POST /api/auth/login
router.post("/login", loginLimiter, login);

// GET /api/auth/me
router.get("/me", protect, getCurrentUser);

// PUT /api/auth/profile
router.put("/profile", protect, updateProfile);

// PUT /api/auth/password
router.put("/password", protect, changePassword);

// DELETE /api/auth/account
router.delete("/account", protect, deleteAccount);

export default router;

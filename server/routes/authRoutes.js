import { Router } from "express";
import { signup, login, getCurrentUser, updateProfile, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me
router.get("/me", protect, getCurrentUser);

// PUT /api/auth/profile
router.put("/profile", protect, updateProfile);

// PUT /api/auth/password
router.put("/password", protect, changePassword);

export default router;

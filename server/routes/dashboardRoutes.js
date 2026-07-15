import { Router } from "express";
import { getDashboardData } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

// Alias to match requested endpoint
router.get("/summary", getDashboardData);

export default router;

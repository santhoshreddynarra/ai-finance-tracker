import { Router } from "express";
import { getDashboardData } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/dashboard", getDashboardData);

export default router;

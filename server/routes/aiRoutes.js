import { Router } from "express";
import { getInsights } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/insights", getInsights);

export default router;

import { Router } from "express";
import { getReportData, downloadReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getReportData);
router.get("/download", downloadReport);

export default router;

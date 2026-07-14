import { Router } from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Protect all transaction routes
router.use(protect);

router.route("/")
  .post(createTransaction)
  .get(getTransactions);

router.route("/:id")
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;

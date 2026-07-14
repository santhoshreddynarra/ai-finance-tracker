import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Budget amount is required"],
      min: [1, "Budget must be at least 1"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    period: {
      type: String,
      enum: ["monthly", "custom"],
      default: "monthly",
    },
    startDate: {
      type: Date,
      // Optional: Used if period is custom, or to fix a specific month.
    },
    endDate: {
      type: Date,
      // Optional: Used if period is custom.
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// A user can only have one active budget per category (in a simplified monthly model).
// For a production app, we might allow different months, but keeping it simple: unique per category per user.
budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;

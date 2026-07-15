import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    monthlyBudget: {
      type: Number,
      required: [true, "Monthly budget is required"],
      min: [1, "Budget must be at least 1"],
      default: 0,
    },
    categoryBudgets: [
      {
        category: {
          type: String,
          required: true,
          trim: true,
        },
        limit: {
          type: Number,
          required: true,
          min: [1, "Category limit must be at least 1"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;

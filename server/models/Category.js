import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Category type is required"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // null if it's a default system category
      default: null, 
    },
  },
  {
    timestamps: true,
  }
);

// A user cannot have two custom categories with the exact same name and type.
// If userId is null (default category), name and type combination should also be unique.
categorySchema.index({ name: 1, type: 1, userId: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;

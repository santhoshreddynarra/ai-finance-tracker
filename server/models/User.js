import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Number of salt rounds for bcrypt — 12 is a good production balance
// between security and performance.
const SALT_ROUNDS = 12;

// ─────────────────────────────────────────────
// Schema Definition
// ─────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [60, "Name cannot exceed 60 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Always stored in lowercase
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      // Excluded from query results by default for security.
      // Use .select("+password") explicitly when needed.
      select: false,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// ─────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────
// email index is created automatically via unique:true above.
// A descending index on createdAt supports date-range queries efficiently.
userSchema.index({ createdAt: -1 });

// ─────────────────────────────────────────────
// Pre-save Hook — Password Hashing
// ─────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  // Skip hashing if the password field was not modified.
  // This prevents re-hashing on updates to other fields (e.g., name, email).
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

// ─────────────────────────────────────────────
// Instance Methods
// ─────────────────────────────────────────────

/**
 * Compare a plain-text candidate password against the stored bcrypt hash.
 * Used during login to verify user credentials.
 *
 * @param {string} candidatePassword - The raw password from the login request.
 * @returns {Promise<boolean>} Resolves to true if passwords match, false otherwise.
 */
userSchema.methods.matchPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─────────────────────────────────────────────
// Model Export
// ─────────────────────────────────────────────
const User = mongoose.model("User", userSchema);

export default User;

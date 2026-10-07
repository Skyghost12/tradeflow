import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be under 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never returned by default on queries
    },
    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }, // Cloudinary public_id, for deletion
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    tradingStyle: {
      type: String,
      enum: ["scalper", "day-trader", "swing-trader", "position-trader"],
      default: "day-trader",
    },
    experience: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "professional"],
      default: "beginner",
    },
    preferredPairs: {
      type: [String],
      default: [],
    },
    watchlist: {
      type: [String],
      default: ["EURUSD", "GBPUSD", "USDJPY", "XAUUSD"],
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving, only if it was modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare plaintext password against the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Strip sensitive fields whenever a user doc is serialized to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokenHash;
  delete obj.__v;
  return obj;
};

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export default mongoose.model("User", userSchema);

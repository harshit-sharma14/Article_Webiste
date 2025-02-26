const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["reader", "editor", "admin"],
      default: "reader",
    },
    avatar: {
      type: String, // URL for profile picture
    },
  },
  { timestamps: true }
);

// Hash password before saving

// Compare password method

module.exports = mongoose.model("User", userSchema);
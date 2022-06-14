const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    refreshToken: [String],
    confirmed: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      immutable: true, // Make `createdAt` immutable
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

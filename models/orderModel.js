const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    page: String,
    url: String,
    source: String,
    name: String,
    phone: String,
    status: { type: String, default: "New" },
    comments: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", requestSchema);

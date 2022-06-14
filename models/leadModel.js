const mongoose = require("mongoose");

const leadSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    orders: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);

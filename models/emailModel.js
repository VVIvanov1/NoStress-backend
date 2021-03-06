const mongoose = require("mongoose");

const emailSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  jwtToken: {
    type: String,
  },
  createdAt: { type: Date, expires: "3h", default: Date.now },
});

module.exports = mongoose.model("Email", emailSchema);

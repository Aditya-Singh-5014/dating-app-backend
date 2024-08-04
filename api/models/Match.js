const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  matchedUserId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Match", MatchSchema);

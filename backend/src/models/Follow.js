const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate follows and for efficient queries
followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.index({ following: 1 });
followSchema.index({ follower: 1 });

module.exports = mongoose.model("Follow", followSchema);

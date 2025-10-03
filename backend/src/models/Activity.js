const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "book_added",
        "book_reviewed",
        "book_liked",
        "user_followed",
        "profile_updated",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    relatedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    relatedReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
    metadata: {
      rating: Number,
      bookTitle: String,
      userName: String,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
activitySchema.index({ createdAt: -1 });
activitySchema.index({ user: 1 });
activitySchema.index({ type: 1 });

module.exports = mongoose.model("Activity", activitySchema);

// src/controllers/reviewController.js

const Review = require("../models/Review");
const Book = require("../models/Book");
const User = require("../models/User");
const reviewService = require("../services/reviewService");
const { createActivity } = require("./activityController");

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, reviewText } = req.body;

    const review = await reviewService.createReview(
      req.user._id,
      bookId,
      rating,
      reviewText
    );

    // Get book details for activity
    const book = await Book.findById(bookId).select("title author");

    // Update user's review count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "socialStats.reviewsCount": 1 },
    });

    // Create activity
    await createActivity({
      user: req.user._id,
      type: "book_reviewed",
      title: `Reviewed "${book.title}"`,
      description: `${req.user.name} gave ${rating} stars to "${book.title}" by ${book.author}`,
      relatedBook: bookId,
      relatedReview: review._id,
      metadata: {
        rating: rating,
        bookTitle: book.title,
      },
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding review", error: error.message });
  }
};

// Edit an existing review
exports.editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;
    const updatedReview = await reviewService.updateReview(
      reviewId,
      req.user._id,
      rating,
      reviewText
    );
    res
      .status(200)
      .json({ message: "Review updated successfully", updatedReview });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating review", error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    await reviewService.deleteReview(reviewId, req.user._id);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: error.message });
  }
};

// Get all reviews for a specific book
exports.getReviewsForBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await reviewService.getReviewsByBookId(bookId);
    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

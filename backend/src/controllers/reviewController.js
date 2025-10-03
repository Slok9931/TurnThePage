// src/controllers/reviewController.js

const Review = require("../models/Review");
const Book = require("../models/Book");
const reviewService = require("../services/reviewService");

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, reviewText } = req.body;
    const review = await reviewService.createReview(
      req.user.id,
      bookId,
      rating,
      reviewText
    );
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
      req.user.id,
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
    await reviewService.deleteReview(reviewId, req.user.id);
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

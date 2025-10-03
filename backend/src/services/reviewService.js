// src/services/reviewService.js

const Review = require("../models/Review");
const Book = require("../models/Book");

// Add a review
const addReview = async (userId, bookId, rating, reviewText) => {
  const review = new Review({ bookId, userId, rating, reviewText });
  await review.save();
  await updateAverageRating(bookId);
  return review;
};

// Edit a review
const editReview = async (reviewId, userId, updatedData) => {
  const review = await Review.findOneAndUpdate(
    { _id: reviewId, userId },
    updatedData,
    { new: true }
  );
  await updateAverageRating(review.bookId);
  return review;
};

// Delete a review
const deleteReview = async (reviewId, userId) => {
  const review = await Review.findOneAndDelete({ _id: reviewId, userId });
  await updateAverageRating(review.bookId);
  return review;
};

// Get all reviews for a book
const getReviewsByBookId = async (bookId) => {
  return await Review.find({ bookId }).populate("userId", "name");
};

// Calculate average rating for a book
const updateAverageRating = async (bookId) => {
  const reviews = await Review.find({ bookId });
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length ||
    0;
  await Book.findByIdAndUpdate(bookId, { averageRating });
};

module.exports = {
  createReview: addReview,
  updateReview: editReview,
  deleteReview,
  getReviewsByBookId,
};

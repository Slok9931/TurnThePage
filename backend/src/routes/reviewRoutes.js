const express = require("express");
const {
  addReview,
  editReview,
  deleteReview,
  getReviewsForBook,
} = require("../controllers/reviewController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Route to add a review
router.post("/:bookId", authenticate, addReview);

// Route to edit a review
router.put("/:reviewId", authenticate, editReview);

// Route to delete a review
router.delete("/:reviewId", authenticate, deleteReview);

// Route to get reviews by book ID
router.get("/book/:bookId", getReviewsForBook);

// Route to get user's reviews
router.get("/user/my-reviews", authenticate, async (req, res) => {
  try {
    const Review = require("../models/Review");
    const reviews = await Review.find({ userId: req.user.id })
      .populate("userId", "name")
      .populate("bookId", "title");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get review stats for a book
router.get("/book/:bookId/stats", async (req, res) => {
  try {
    const Review = require("../models/Review");
    const reviews = await Review.find({ bookId: req.params.bookId });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      ratingDistribution[review.rating]++;
    });

    res.json({
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

module.exports = router;

// src/controllers/analyticsController.js

const Review = require("../models/Review");
const Book = require("../models/Book");

// Get detailed analytics for a specific book
exports.getBookAnalytics = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Get all reviews for this book
    const reviews = await Review.find({ bookId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    // Rating distribution
    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    // Reviews over time (monthly)
    const reviewsOverTime = {};

    // Average rating over time
    const ratingOverTime = [];

    let runningSum = 0;
    let runningCount = 0;

    reviews.forEach((review, index) => {
      // Rating distribution
      ratingDistribution[review.rating]++;

      // Reviews over time (monthly grouping)
      const monthYear = new Date(review.createdAt)
        .toISOString()
        .substring(0, 7); // YYYY-MM format
      if (!reviewsOverTime[monthYear]) {
        reviewsOverTime[monthYear] = 0;
      }
      reviewsOverTime[monthYear]++;

      // Running average rating over time
      runningSum += review.rating;
      runningCount++;

      if (
        index % Math.max(1, Math.floor(reviews.length / 20)) === 0 ||
        index === reviews.length - 1
      ) {
        ratingOverTime.push({
          date: review.createdAt,
          averageRating: runningSum / runningCount,
          reviewCount: runningCount,
        });
      }
    });

    // Convert rating distribution to array format for charts
    const ratingDistributionArray = Object.keys(ratingDistribution).map(
      (rating) => ({
        rating: `${rating} Star${rating !== "1" ? "s" : ""}`,
        count: ratingDistribution[rating],
        percentage:
          reviews.length > 0
            ? ((ratingDistribution[rating] / reviews.length) * 100).toFixed(1)
            : 0,
      })
    );

    // Convert reviews over time to array format
    const reviewsOverTimeArray = Object.keys(reviewsOverTime)
      .sort()
      .map((monthYear) => ({
        month: monthYear,
        count: reviewsOverTime[monthYear],
      }));

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentReviews = reviews.filter(
      (review) => new Date(review.createdAt) >= sevenDaysAgo
    );

    // Daily activity for the last 7 days
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      const dayReviews = recentReviews.filter(
        (review) => review.createdAt.toISOString().split("T")[0] === dateString
      );

      dailyActivity.push({
        date: dateString,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        reviews: dayReviews.length,
        averageRating:
          dayReviews.length > 0
            ? dayReviews.reduce((sum, review) => sum + review.rating, 0) /
              dayReviews.length
            : 0,
      });
    }

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    const highestRated = reviews.filter((review) => review.rating === 5).length;
    const lowestRated = reviews.filter((review) => review.rating === 1).length;

    // Most active reviewers
    const reviewerActivity = {};
    reviews.forEach((review) => {
      const userId = review.userId._id.toString();
      const userName = review.userId.name;

      if (!reviewerActivity[userId]) {
        reviewerActivity[userId] = {
          name: userName,
          reviewCount: 0,
          averageRating: 0,
          totalRating: 0,
        };
      }

      reviewerActivity[userId].reviewCount++;
      reviewerActivity[userId].totalRating += review.rating;
      reviewerActivity[userId].averageRating =
        reviewerActivity[userId].totalRating /
        reviewerActivity[userId].reviewCount;
    });

    const topReviewers = Object.values(reviewerActivity)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 5);

    res.json({
      success: true,
      analytics: {
        overview: {
          totalReviews,
          averageRating: parseFloat(averageRating.toFixed(2)),
          highestRated,
          lowestRated,
          reviewsThisWeek: recentReviews.length,
        },
        ratingDistribution: ratingDistributionArray,
        reviewsOverTime: reviewsOverTimeArray,
        ratingOverTime: ratingOverTime.slice(-20), // Last 20 data points
        dailyActivity,
        topReviewers,
      },
    });
  } catch (error) {
    console.error("Error fetching book analytics:", error);
    res.status(500).json({
      message: "Error fetching analytics",
      error: error.message,
    });
  }
};

// Get general analytics across all books
exports.getGeneralAnalytics = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Books with most reviews
    const booksWithReviews = await Review.aggregate([
      {
        $group: {
          _id: "$bookId",
          reviewCount: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: "$book",
      },
      {
        $sort: { reviewCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          title: "$book.title",
          author: "$book.author",
          reviewCount: 1,
          averageRating: { $round: ["$averageRating", 2] },
        },
      },
    ]);

    res.json({
      success: true,
      analytics: {
        totalBooks,
        totalReviews,
        booksWithMostReviews: booksWithReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching general analytics:", error);
    res.status(500).json({
      message: "Error fetching general analytics",
      error: error.message,
    });
  }
};

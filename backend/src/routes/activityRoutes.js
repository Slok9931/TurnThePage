const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  getFeedActivities,
  getPublicActivities,
  toggleActivityLike,
  addActivityComment,
  deleteActivityComment,
  getUserActivities,
} = require("../controllers/activityController");

// Get feed activities for dashboard (following users)
router.get("/feed", authenticate, getFeedActivities);

// Get public activities (all activities)
router.get("/public", getPublicActivities);

// Get user's activities
router.get("/user/:userId", getUserActivities);

// Like/Unlike activity
router.post("/:activityId/like", authenticate, toggleActivityLike);

// Add comment to activity
router.post("/:activityId/comments", authenticate, addActivityComment);

// Delete comment from activity
router.delete(
  "/:activityId/comments/:commentId",
  authenticate,
  deleteActivityComment
);

module.exports = router;

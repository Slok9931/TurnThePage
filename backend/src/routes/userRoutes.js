const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const {
  getUserProfile,
  updateUserProfile,
  uploadProfilePic,
  uploadCoverPic,
  searchUsers,
  getSuggestedUsers,
  getUserDashboardStats,
} = require("../controllers/userController");

// Get user profile
router.get("/profile/:userId", getUserProfile);

// Update user profile
router.put("/profile", authenticate, updateUserProfile);

// Upload profile picture
router.post(
  "/profile/picture",
  authenticate,
  upload.single("profilePicture"),
  uploadProfilePic
);

// Upload cover picture
router.post(
  "/profile/cover",
  authenticate,
  upload.single("coverPicture"),
  uploadCoverPic
);

// Search users
router.get("/search", searchUsers);

// Get suggested users to follow
router.get("/suggestions", authenticate, getSuggestedUsers);

// Get user dashboard stats
router.get("/dashboard/stats", authenticate, getUserDashboardStats);

module.exports = router;

const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  acceptFollowRequest,
  declineFollowRequest,
  getPendingRequests,
  getFollowStatus,
} = require("../controllers/socialController");

// Follow/Unfollow user
router.post("/follow/:userId", authenticate, followUser);
router.delete("/unfollow/:userId", authenticate, unfollowUser);

// Get followers and following
router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);

// Follow requests management
router.get("/requests/pending", authenticate, getPendingRequests);
router.post("/requests/:followId/accept", authenticate, acceptFollowRequest);
router.post("/requests/:followId/decline", authenticate, declineFollowRequest);

// Check follow status
router.get("/status/:userId", authenticate, getFollowStatus);

module.exports = router;

const User = require("../models/User");
const Follow = require("../models/Follow");
const { createActivity } = require("./activityController");

// Follow a user
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user._id;

    // Can't follow yourself
    if (userId === followerId) {
      return res.status(400).json({
        success: false,
        message: "You can't follow yourself",
      });
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already following or pending
    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: userId,
    });

    if (existingFollow) {
      if (existingFollow.status === "pending") {
        return res.status(400).json({
          success: false,
          message: "Follow request already sent",
        });
      } else if (existingFollow.status === "accepted") {
        return res.status(400).json({
          success: false,
          message: "Already following this user",
        });
      }
    }

    // Create follow relationship
    const follow = new Follow({
      follower: followerId,
      following: userId,
      status: targetUser.isPrivate ? "pending" : "accepted",
    });

    await follow.save();

    // Update user stats if accepted
    if (follow.status === "accepted") {
      await User.findByIdAndUpdate(followerId, {
        $inc: { "socialStats.followingCount": 1 },
      });

      await User.findByIdAndUpdate(userId, {
        $inc: { "socialStats.followersCount": 1 },
      });

      console.log(req);
      // Create activity
      await createActivity({
        user: followerId,
        type: "user_followed",
        title: `Started following ${targetUser.name}`,
        description: `${req.user.name} is now following ${targetUser.name}`,
        relatedUser: userId,
        metadata: {
          userName: targetUser.name,
        },
      });
    }

    res.json({
      success: true,
      data: {
        follow,
        message:
          follow.status === "pending"
            ? "Follow request sent"
            : "Successfully followed user",
      },
    });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({
      success: false,
      message: "Error following user",
    });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user._id;

    const follow = await Follow.findOneAndDelete({
      follower: followerId,
      following: userId,
    });

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: "Not following this user",
      });
    }

    // Update user stats only if was accepted
    if (follow.status === "accepted") {
      await User.findByIdAndUpdate(followerId, {
        $inc: { "socialStats.followingCount": -1 },
      });

      await User.findByIdAndUpdate(userId, {
        $inc: { "socialStats.followersCount": -1 },
      });
    }

    res.json({
      success: true,
      message: "Successfully unfollowed user",
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({
      success: false,
      message: "Error unfollowing user",
    });
  }
};

// Get followers list
const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const followers = await Follow.find({
      following: userId,
      status: "accepted",
    })
      .populate("follower", "name username profilePicture bio socialStats")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const currentUserId = req.user ? req.user._id : null;

    // Add follow status for current user
    const followersWithStatus = await Promise.all(
      followers.map(async (follow) => {
        const followerObj = follow.toObject();
        if (currentUserId && currentUserId !== follow.follower._id.toString()) {
          const isFollowing = await Follow.findOne({
            follower: currentUserId,
            following: follow.follower._id,
            status: "accepted",
          });
          followerObj.follower.isFollowedByCurrentUser = !!isFollowing;
        }
        return followerObj.follower;
      })
    );

    const totalFollowers = await Follow.countDocuments({
      following: userId,
      status: "accepted",
    });

    res.json({
      success: true,
      data: {
        followers: followersWithStatus,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalFollowers / limit),
          totalFollowers,
          hasNext: page < Math.ceil(totalFollowers / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching followers",
    });
  }
};

// Get following list
const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const following = await Follow.find({
      follower: userId,
      status: "accepted",
    })
      .populate("following", "name username profilePicture bio socialStats")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const currentUserId = req.user ? req.user._id : null;

    // Add follow status for current user
    const followingWithStatus = await Promise.all(
      following.map(async (follow) => {
        const followingObj = follow.toObject();
        if (
          currentUserId &&
          currentUserId !== follow.following._id.toString()
        ) {
          const isFollowing = await Follow.findOne({
            follower: currentUserId,
            following: follow.following._id,
            status: "accepted",
          });
          followingObj.following.isFollowedByCurrentUser = !!isFollowing;
        }
        return followingObj.following;
      })
    );

    const totalFollowing = await Follow.countDocuments({
      follower: userId,
      status: "accepted",
    });

    res.json({
      success: true,
      data: {
        following: followingWithStatus,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalFollowing / limit),
          totalFollowing,
          hasNext: page < Math.ceil(totalFollowing / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching following",
    });
  }
};

// Accept follow request
const acceptFollowRequest = async (req, res) => {
  try {
    const { followId } = req.params;
    const userId = req.user._id;

    const follow = await Follow.findById(followId).populate("follower", "name");

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: "Follow request not found",
      });
    }

    if (follow.following.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (follow.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Follow request is not pending",
      });
    }

    follow.status = "accepted";
    await follow.save();

    // Update user stats
    await User.findByIdAndUpdate(follow.follower._id, {
      $inc: { "socialStats.followingCount": 1 },
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { "socialStats.followersCount": 1 },
    });

    // Create activity
    await createActivity({
      user: follow.follower._id,
      type: "user_followed",
      title: `Started following ${req.user.name}`,
      description: `${follow.follower.name} is now following ${req.user.name}`,
      relatedUser: userId,
      metadata: {
        userName: req.user.name,
      },
    });

    res.json({
      success: true,
      message: "Follow request accepted",
    });
  } catch (error) {
    console.error("Error accepting follow request:", error);
    res.status(500).json({
      success: false,
      message: "Error accepting follow request",
    });
  }
};

// Decline follow request
const declineFollowRequest = async (req, res) => {
  try {
    const { followId } = req.params;
    const userId = req.user._id;

    const follow = await Follow.findById(followId);

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: "Follow request not found",
      });
    }

    if (follow.following.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (follow.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Follow request is not pending",
      });
    }

    follow.status = "declined";
    await follow.save();

    res.json({
      success: true,
      message: "Follow request declined",
    });
  } catch (error) {
    console.error("Error declining follow request:", error);
    res.status(500).json({
      success: false,
      message: "Error declining follow request",
    });
  }
};

// Get pending follow requests
const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const pendingRequests = await Follow.find({
      following: userId,
      status: "pending",
    })
      .populate("follower", "name username profilePicture bio socialStats")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        requests: pendingRequests,
      },
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pending requests",
    });
  }
};

// Check follow status
const getFollowStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId) {
      return res.json({
        success: true,
        data: {
          status: "self",
          isFollowing: false,
          isPending: false,
        },
      });
    }

    const [currentUserFollowsTarget, targetUserFollowsCurrent] =
      await Promise.all([
        Follow.findOne({
          follower: currentUserId,
          following: userId,
        }),
        Follow.findOne({
          follower: userId,
          following: currentUserId,
        }),
      ]);

    res.json({
      success: true,
      data: {
        status: currentUserFollowsTarget
          ? currentUserFollowsTarget.status
          : "none",
        isFollowing:
          currentUserFollowsTarget &&
          currentUserFollowsTarget.status === "accepted",
        isPending:
          currentUserFollowsTarget &&
          currentUserFollowsTarget.status === "pending",
        isFollowingBack:
          targetUserFollowsCurrent &&
          targetUserFollowsCurrent.status === "accepted",
        isMutual:
          currentUserFollowsTarget?.status === "accepted" &&
          targetUserFollowsCurrent?.status === "accepted",
        pendingRequestId:
          targetUserFollowsCurrent &&
          targetUserFollowsCurrent.status === "pending"
            ? targetUserFollowsCurrent._id
            : null,
      },
    });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({
      success: false,
      message: "Error checking follow status",
    });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  acceptFollowRequest,
  declineFollowRequest,
  getPendingRequests,
  getFollowStatus,
};

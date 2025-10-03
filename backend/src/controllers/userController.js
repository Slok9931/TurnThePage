const User = require("../models/User");
const Follow = require("../models/Follow");
const Book = require("../models/Book");
const Review = require("../models/Review");
const {
  uploadProfilePicture,
  uploadCoverPicture,
  deleteFromCloudinary,
} = require("../config/cloudinary");
const { createActivity } = require("./activityController");

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user ? req.user._id : null;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get follow status if current user is logged in
    let followStatus = null;
    if (currentUserId && currentUserId !== userId) {
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

      followStatus = {
        isFollowing:
          currentUserFollowsTarget &&
          currentUserFollowsTarget.status === "accepted",
        isPending:
          currentUserFollowsTarget &&
          currentUserFollowsTarget.status === "pending",
        status: currentUserFollowsTarget
          ? currentUserFollowsTarget.status
          : "none",
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
      };
    }

    // Get user's recent books and reviews
    const recentBooks = await Book.find({ addedBy: userId })
      .select("title author coverImage createdAt averageRating")
      .sort({ createdAt: -1 })
      .limit(6);

    const recentReviews = await Review.find({ user: userId })
      .populate("book", "title author coverImage")
      .select("rating comment createdAt")
      .sort({ createdAt: -1 })
      .limit(6);

    // Calculate additional stats
    const totalBooksAdded = await Book.countDocuments({ addedBy: userId });
    const totalReviews = await Review.countDocuments({ user: userId });

    // Average rating given by user
    const avgRatingResult = await Review.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const avgRatingGiven =
      avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;

    const userProfile = {
      ...user.toObject(),
      followStatus,
      recentBooks,
      recentReviews,
      stats: {
        ...user.socialStats,
        booksAddedCount: totalBooksAdded,
        reviewsCount: totalReviews,
        avgRatingGiven: Math.round(avgRatingGiven * 10) / 10,
      },
    };

    res.json({
      success: true,
      data: {
        user: userProfile,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };

    // Remove sensitive fields that shouldn't be updated here
    delete updateData.password;
    delete updateData.email;
    delete updateData.socialStats;
    delete updateData._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create activity for profile update
    await createActivity({
      user: userId,
      type: "profile_updated",
      title: "Updated profile",
      description: `${user.name} updated their profile`,
      metadata: {},
    });

    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message:
        error.code === 11000
          ? "Username already taken"
          : "Error updating profile",
    });
  }
};

// Upload profile picture
const uploadProfilePic = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old profile picture if exists
    if (user.profilePicture && user.profilePicture.publicId) {
      await deleteFromCloudinary(user.profilePicture.publicId);
    }

    // Upload new profile picture
    const uploadResult = await uploadProfilePicture(req.file.buffer);

    // Update user with new profile picture
    user.profilePicture = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    };
    await user.save();

    res.json({
      success: true,
      data: {
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading profile picture",
    });
  }
};

// Upload cover picture
const uploadCoverPic = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old cover picture if exists
    if (user.coverPicture && user.coverPicture.publicId) {
      await deleteFromCloudinary(user.coverPicture.publicId);
    }

    // Upload new cover picture
    const uploadResult = await uploadCoverPicture(req.file.buffer);

    // Update user with new cover picture
    user.coverPicture = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    };
    await user.save();

    res.json({
      success: true,
      data: {
        coverPicture: user.coverPicture,
      },
    });
  } catch (error) {
    console.error("Error uploading cover picture:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading cover picture",
    });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchQuery = q.trim();
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { username: { $regex: searchQuery, $options: "i" } },
        { bio: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .select("name username profilePicture bio socialStats location")
      .sort({ "socialStats.followersCount": -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const currentUserId = req.user ? req.user._id : null;

    // Add follow status for current user if logged in
    const usersWithFollowStatus = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toObject();
        if (currentUserId && currentUserId !== user._id.toString()) {
          const follow = await Follow.findOne({
            follower: currentUserId,
            following: user._id,
          });
          userObj.isFollowedByCurrentUser =
            follow && follow.status === "accepted";
          userObj.followStatus = {
            status: follow ? follow.status : "none",
            isFollowing: follow && follow.status === "accepted",
            isPending: follow && follow.status === "pending",
          };
        }
        return userObj;
      })
    );

    const totalUsers = await User.countDocuments({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { username: { $regex: searchQuery, $options: "i" } },
        { bio: { $regex: searchQuery, $options: "i" } },
      ],
    });

    res.json({
      success: true,
      data: {
        users: usersWithFollowStatus,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / parseInt(limit)),
          totalUsers,
          hasNext: parseInt(page) < Math.ceil(totalUsers / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "Error searching users",
    });
  }
};

// Get suggested users to follow
const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    // Get users that current user is already following
    const following = await Follow.find({
      follower: userId,
      status: "accepted",
    }).select("following");

    const followingIds = following.map((f) => f.following);
    followingIds.push(userId); // Exclude self

    // Find users not being followed, sorted by followers count
    const users = await User.find({
      _id: { $nin: followingIds },
    })
      .select("name username profilePicture bio socialStats location")
      .sort({
        "socialStats.followersCount": -1,
        "socialStats.booksAddedCount": -1,
        createdAt: -1,
      })
      .limit(limit);

    // Add follow status for each suggested user
    const suggestedUsersWithStatus = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toObject();
        const follow = await Follow.findOne({
          follower: userId,
          following: user._id,
        });
        userObj.isFollowedByCurrentUser =
          follow && follow.status === "accepted";
        userObj.followStatus = {
          status: follow ? follow.status : "none",
          isFollowing: follow && follow.status === "accepted",
          isPending: follow && follow.status === "pending",
        };
        return userObj;
      })
    );

    res.json({
      success: true,
      data: {
        users: suggestedUsersWithStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching suggested users",
    });
  }
};

// Get user dashboard stats
const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get follow stats
    const followersCount = await Follow.countDocuments({
      following: userId,
      status: "accepted",
    });

    const followingCount = await Follow.countDocuments({
      follower: userId,
      status: "accepted",
    });

    // Get content stats
    const booksCount = await Book.countDocuments({ addedBy: userId });
    const reviewsCount = await Review.countDocuments({ user: userId });

    // Get recent activity count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivityCount = await Review.countDocuments({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Update user stats in database
    await User.findByIdAndUpdate(userId, {
      $set: {
        "socialStats.followersCount": followersCount,
        "socialStats.followingCount": followingCount,
        "socialStats.booksAddedCount": booksCount,
        "socialStats.reviewsCount": reviewsCount,
      },
    });

    res.json({
      success: true,
      data: {
        stats: {
          followers: followersCount,
          following: followingCount,
          booksAdded: booksCount,
          reviews: reviewsCount,
          recentActivity: recentActivityCount,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadProfilePic,
  uploadCoverPic,
  searchUsers,
  getSuggestedUsers,
  getUserDashboardStats,
};

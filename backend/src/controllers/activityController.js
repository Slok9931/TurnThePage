const Activity = require("../models/Activity");
const User = require("../models/User");
const Book = require("../models/Book");
const Review = require("../models/Review");
const Follow = require("../models/Follow");

// Create activity helper function
const createActivity = async (activityData) => {
  try {
    const activity = new Activity(activityData);
    await activity.save();
    return activity;
  } catch (error) {
    console.error("Error creating activity:", error);
  }
};

// Get feed activities for dashboard
const getFeedActivities = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get users that the current user is following
    const following = await Follow.find({
      follower: userId,
      status: "accepted",
    }).select("following");

    const followingIds = following.map((f) => f.following);
    followingIds.push(userId); // Include user's own activities

    // Get activities from followed users
    const activities = await Activity.find({
      user: { $in: followingIds },
      isVisible: true,
    })
      .populate("user", "name username profilePicture")
      .populate("relatedBook", "title author coverImage")
      .populate("relatedUser", "name username profilePicture")
      .populate({
        path: "comments.user",
        select: "name username profilePicture",
      })
      .populate({
        path: "likes.user",
        select: "name username",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out activities where user is null (deleted users)
    const validActivities = activities.filter(
      (activity) => activity.user !== null
    );

    // Add like status for current user
    const activitiesWithLikeStatus = validActivities.map((activity) => {
      const activityObj = activity.toObject();
      activityObj.isLikedByUser = activity.likes.some(
        (like) => like.user._id.toString() === userId
      );
      activityObj.likesCount = activity.likes.length;
      activityObj.commentsCount = activity.comments.length;
      return activityObj;
    });

    const totalActivities = await Activity.countDocuments({
      user: { $in: followingIds },
      isVisible: true,
    });

    res.json({
      success: true,
      data: {
        activities: activitiesWithLikeStatus,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalActivities / limit),
          totalActivities,
          hasNext: page < Math.ceil(totalActivities / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching feed activities:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching feed activities",
    });
  }
};

// Get all activities (public feed)
const getPublicActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    let filter = { isVisible: true };
    if (type) {
      filter.type = type;
    }

    const activities = await Activity.find(filter)
      .populate("user", "name email profilePicture")
      .populate("relatedBook", "title author coverImage")
      .populate("relatedUser", "name email profilePicture")
      .populate({
        path: "comments.user",
        select: "name email profilePicture",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out activities where user is null (deleted users)
    const validActivities = activities.filter(
      (activity) => activity.user !== null
    );

    const userId = req.user ? req.user._id : null;

    // Add like status for current user if logged in
    const activitiesWithLikeStatus = validActivities.map((activity) => {
      const activityObj = activity.toObject();
      if (userId) {
        activityObj.isLikedByUser = activity.likes.some(
          (like) => like.user.toString() === userId
        );
      }
      activityObj.likesCount = activity.likes.length;
      activityObj.commentsCount = activity.comments.length;
      return activityObj;
    });

    const totalActivities = await Activity.countDocuments(filter);

    res.json({
      success: true,
      data: {
        activities: activitiesWithLikeStatus,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalActivities / limit),
          totalActivities,
          hasNext: page < Math.ceil(totalActivities / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching public activities:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching activities",
    });
  }
};

// Like/Unlike activity
const toggleActivityLike = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user._id;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    const existingLike = activity.likes.find(
      (like) => like.user.toString() === userId
    );

    if (existingLike) {
      // Unlike
      activity.likes = activity.likes.filter(
        (like) => like.user.toString() !== userId
      );
    } else {
      // Like
      activity.likes.push({ user: userId });
    }

    await activity.save();

    res.json({
      success: true,
      data: {
        isLiked: !existingLike,
        likesCount: activity.likes.length,
      },
    });
  } catch (error) {
    console.error("Error toggling activity like:", error);
    res.status(500).json({
      success: false,
      message: "Error updating like status",
    });
  }
};

// Add comment to activity
const addActivityComment = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    const comment = {
      user: userId,
      content: content.trim(),
    };

    activity.comments.push(comment);
    await activity.save();

    // Populate the new comment
    await activity.populate({
      path: "comments.user",
      select: "name username profilePicture",
    });

    const newComment = activity.comments[activity.comments.length - 1];

    res.json({
      success: true,
      data: {
        comment: newComment,
        commentsCount: activity.comments.length,
      },
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Error adding comment",
    });
  }
};

// Delete comment from activity
const deleteActivityComment = async (req, res) => {
  try {
    const { activityId, commentId } = req.params;
    const userId = req.user._id;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    const comment = activity.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user owns the comment or the activity
    if (
      comment.user.toString() !== userId &&
      activity.user.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    activity.comments.pull(commentId);
    await activity.save();

    res.json({
      success: true,
      data: {
        commentsCount: activity.comments.length,
      },
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting comment",
    });
  }
};

// Get user's activities
const getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const activities = await Activity.find({
      user: userId,
      isVisible: true,
    })
      .populate("user", "name username profilePicture")
      .populate("relatedBook", "title author coverImage")
      .populate("relatedUser", "name username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const currentUserId = req.user ? req.user._id : null;

    // Add like status for current user if logged in
    const activitiesWithLikeStatus = activities.map((activity) => {
      const activityObj = activity.toObject();
      if (currentUserId) {
        activityObj.isLikedByUser = activity.likes.some(
          (like) => like.user.toString() === currentUserId
        );
      }
      activityObj.likesCount = activity.likes.length;
      activityObj.commentsCount = activity.comments.length;
      return activityObj;
    });

    const totalActivities = await Activity.countDocuments({
      user: userId,
      isVisible: true,
    });

    res.json({
      success: true,
      data: {
        activities: activitiesWithLikeStatus,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalActivities / limit),
          totalActivities,
          hasNext: page < Math.ceil(totalActivities / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user activities:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user activities",
    });
  }
};

module.exports = {
  createActivity,
  getFeedActivities,
  getPublicActivities,
  toggleActivityLike,
  addActivityComment,
  deleteActivityComment,
  getUserActivities,
};

import api from "../lib/api";

export interface Activity {
  _id: string;
  user: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: {
      url: string;
    };
  };
  type: string;
  title: string;
  description: string;
  relatedBook?: {
    _id: string;
    title: string;
    author: string;
    coverImage?: {
      url: string;
    };
  };
  relatedUser?: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: {
      url: string;
    };
  };
  metadata: any;
  likes: any[];
  comments: any[];
  isLikedByUser: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface ActivityResponse {
  success: boolean;
  data: {
    activities: Activity[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalActivities: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// Get feed activities (from followed users)
export const getFeedActivities = async (
  page = 1,
  limit = 10
): Promise<ActivityResponse> => {
  const response = await api.get(
    `/activities/feed?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Get public activities (all activities)
export const getPublicActivities = async (
  page = 1,
  limit = 10,
  type?: string
): Promise<ActivityResponse> => {
  let url = `/activities/public?page=${page}&limit=${limit}`;
  if (type) url += `&type=${type}`;
  const response = await api.get(url);
  return response.data;
};

// Get user's activities
export const getUserActivities = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<ActivityResponse> => {
  const response = await api.get(
    `/activities/user/${userId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Like/Unlike activity
export const toggleActivityLike = async (activityId: string) => {
  const response = await api.post(`/activities/${activityId}/like`);
  return response.data;
};

// Add comment to activity
export const addActivityComment = async (
  activityId: string,
  content: string
) => {
  const response = await api.post(`/activities/${activityId}/comments`, {
    content,
  });
  return response.data;
};

// Delete comment from activity
export const deleteActivityComment = async (
  activityId: string,
  commentId: string
) => {
  const response = await api.delete(
    `/activities/${activityId}/comments/${commentId}`
  );
  return response.data;
};

import api from "../lib/api";

export interface FollowStatus {
  status: "none" | "pending" | "accepted" | "self";
  isFollowing: boolean;
  isPending: boolean;
  isFollowingBack?: boolean;
  isMutual?: boolean;
  pendingRequestId?: string | null;
}

export interface UserProfile {
  _id: string;
  name: string;
  username?: string;
  email: string;
  bio?: string;
  profilePicture?: {
    url: string;
    publicId: string;
  };
  coverPicture?: {
    url: string;
    publicId: string;
  };
  location?: string;
  website?: string;
  joinDate: string;
  isPrivate: boolean;
  favoriteGenres?: string[];
  socialStats: {
    followersCount: number;
    followingCount: number;
    booksAddedCount: number;
    reviewsCount: number;
  };
  followStatus?: FollowStatus;
  recentBooks?: any[];
  recentReviews?: any[];
  stats?: any;
}

// Follow a user
export const followUser = async (userId: string) => {
  const response = await api.post(`/social/follow/${userId}`);
  return response.data;
};

// Unfollow a user
export const unfollowUser = async (userId: string) => {
  const response = await api.delete(`/social/unfollow/${userId}`);
  return response.data;
};

// Get followers list
export const getFollowers = async (userId: string, page = 1, limit = 20) => {
  const response = await api.get(
    `/social/followers/${userId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Get following list
export const getFollowing = async (userId: string, page = 1, limit = 20) => {
  const response = await api.get(
    `/social/following/${userId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Get pending follow requests
export const getPendingRequests = async () => {
  const response = await api.get("/social/requests/pending");
  return response.data;
};

// Accept follow request
export const acceptFollowRequest = async (followId: string) => {
  const response = await api.post(`/social/requests/${followId}/accept`);
  return response.data;
};

// Decline follow request
export const declineFollowRequest = async (followId: string) => {
  const response = await api.post(`/social/requests/${followId}/decline`);
  return response.data;
};

// Check follow status
export const getFollowStatus = async (
  userId: string
): Promise<{ success: boolean; data: FollowStatus }> => {
  const response = await api.get(`/social/status/${userId}`);
  return response.data;
};

import api from "../lib/api";
import type { UserProfile } from "./social";

// Get user profile
export const getUserProfile = async (
  userId: string
): Promise<{ success: boolean; data: { user: UserProfile } }> => {
  const response = await api.get(`/users/profile/${userId}`);
  return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData: Partial<UserProfile>) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};

// Upload profile picture
export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await api.post("/users/profile/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Upload cover picture
export const uploadCoverPicture = async (file: File) => {
  const formData = new FormData();
  formData.append("coverPicture", file);

  const response = await api.post("/users/profile/cover", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Search users
export const searchUsers = async (query: string, page = 1, limit = 20) => {
  const response = await api.get(
    `/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
  );
  return response.data;
};

// Get suggested users to follow
export const getSuggestedUsers = async (limit = 10) => {
  const response = await api.get(`/users/suggestions?limit=${limit}`);
  return response.data;
};

// Get user dashboard stats
export const getUserDashboardStats = async () => {
  const response = await api.get("/users/dashboard/stats");
  return response.data;
};

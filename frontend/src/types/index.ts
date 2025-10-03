export interface FollowStatus {
  status: "none" | "pending" | "accepted" | "self";
  isFollowing: boolean;
  isPending: boolean;
  isFollowingBack?: boolean;
  isMutual?: boolean;
  pendingRequestId?: string | null;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  username?: string;
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
  joinDate?: string;
  isPrivate?: boolean;
  favoriteGenres?: string[];
  socialStats?: {
    followersCount: number;
    followingCount: number;
    booksAddedCount: number;
    reviewsCount: number;
  };
  followStatus?: FollowStatus;
  preferences?: {
    notifications: {
      email: boolean;
      push: boolean;
      follows: boolean;
      reviews: boolean;
    };
    privacy: {
      showEmail: boolean;
      showReadingActivity: boolean;
    };
  };
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  publishedYear: number;
  isbn?: string;
  pages?: number;
  language?: string;
  publisher?: string;
  coverImage?: {
    url: string;
    publicId: string;
  };
  tags?: string[];
  addedBy: User | string;
  likes?: any[];
  likesCount?: number;
  averageRating?: number;
  totalReviews?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  bookId: Book | string;
  userId: User | string;
  rating: number;
  reviewText: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedBooks {
  books: Book[];
  total: number;
  page: number;
  limit: number;
}

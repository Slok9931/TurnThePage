export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  publishedYear: number;
  addedBy: User | string;
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

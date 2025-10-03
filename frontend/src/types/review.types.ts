export interface Review {
  _id: string;
  rating: number;
  reviewText: string;
  userId: {
    _id: string;
    name: string;
  };
  bookId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFormData {
  rating: number;
  reviewText: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}
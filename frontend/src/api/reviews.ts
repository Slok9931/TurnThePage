import api from '@/lib/api';
import type { Review, ReviewStats } from '@/types';

interface ReviewFormData {
  rating: number;
  reviewText: string;
}

export const reviewsApi = {
  addReview: async (bookId: string, reviewData: ReviewFormData): Promise<Review> => {
    const { data } = await api.post<Review>(`/reviews/${bookId}`, reviewData);
    return data;
  },

  editReview: async (reviewId: string, reviewData: ReviewFormData): Promise<Review> => {
    const { data } = await api.put<Review>(`/reviews/${reviewId}`, reviewData);
    return data;
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },

  getReviewsForBook: async (bookId: string): Promise<Review[]> => {
    const { data } = await api.get<Review[]>(`/reviews/book/${bookId}`);
    return data;
  },

  getMyReviews: async (): Promise<Review[]> => {
    const { data } = await api.get<Review[]>('/reviews/user/my-reviews');
    return data;
  },

  getBookReviewStats: async (bookId: string): Promise<ReviewStats> => {
    const { data } = await api.get<ReviewStats>(`/reviews/book/${bookId}/stats`);
    return data;
  },
};

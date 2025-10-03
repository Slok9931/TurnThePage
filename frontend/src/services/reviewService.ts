import type { Review, ReviewFormData, ReviewStats } from '../types/review.types'
import api from './api';

export const reviewService = {
  getBookReviews: async (bookId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/book/${bookId}`);
    return response.data;
  },

  createReview: async (bookId: string, reviewData: ReviewFormData): Promise<Review> => {
    const response = await api.post(`/reviews/${bookId}`, reviewData);
    return response.data;
  },

  updateReview: async (reviewId: string, reviewData: ReviewFormData): Promise<Review> => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },

  getUserReviews: async (): Promise<Review[]> => {
    const response = await api.get('/reviews/user/my-reviews');
    return response.data;
  },

  getReviewStats: async (bookId: string): Promise<ReviewStats> => {
    const response = await api.get(`/reviews/book/${bookId}/stats`);
    return response.data;
  },
};
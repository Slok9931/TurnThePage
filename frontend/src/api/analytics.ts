import api from "../lib/api";

export interface BookAnalytics {
  overview: {
    totalReviews: number;
    averageRating: number;
    highestRated: number;
    lowestRated: number;
    reviewsThisWeek: number;
  };
  ratingDistribution: Array<{
    rating: string;
    count: number;
    percentage: string;
  }>;
  reviewsOverTime: Array<{
    month: string;
    count: number;
  }>;
  ratingOverTime: Array<{
    date: string;
    averageRating: number;
    reviewCount: number;
  }>;
  dailyActivity: Array<{
    date: string;
    day: string;
    reviews: number;
    averageRating: number;
  }>;
  topReviewers: Array<{
    name: string;
    reviewCount: number;
    averageRating: number;
  }>;
}

export interface GeneralAnalytics {
  totalBooks: number;
  totalReviews: number;
  booksWithMostReviews: Array<{
    title: string;
    author: string;
    reviewCount: number;
    averageRating: number;
  }>;
}

export const analyticsApi = {
  async getBookAnalytics(bookId: string): Promise<BookAnalytics> {
    const { data } = await api.get(`/analytics/book/${bookId}`);
    return data.analytics;
  },

  async getGeneralAnalytics(): Promise<GeneralAnalytics> {
    const { data } = await api.get("/analytics/general");
    return data.analytics;
  },
};

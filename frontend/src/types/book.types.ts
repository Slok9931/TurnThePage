export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  publishedYear: number;
  addedBy: {
    _id: string;
    name: string;
  };
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  genre: string;
  publishedYear: number;
}

export interface BookFilters {
  search?: string;
  genre?: string;
  sortBy?: 'title' | 'author' | 'publishedYear' | 'averageRating';
  sortOrder?: 'asc' | 'desc';
}

export interface BooksResponse {
  books: Book[];
  totalPages: number;
  currentPage: number;
  totalBooks: number;
}
import api from '@/lib/api';
import type { Book, PaginatedBooks } from '@/types';

interface BookFormData {
  title: string;
  author: string;
  description: string;
  genre: string;
  publishedYear: number;
}

export const booksApi = {
  getBooks: async (page = 1, limit = 12): Promise<PaginatedBooks> => {
    const { data } = await api.get<PaginatedBooks>('/books', {
      params: { page, limit },
    });
    return data;
  },

  getBookById: async (id: string): Promise<Book> => {
    const { data } = await api.get<Book>(`/books/${id}`);
    return data;
  },

  addBook: async (bookData: BookFormData): Promise<Book> => {
    const { data } = await api.post<Book>('/books', bookData);
    return data;
  },

  updateBook: async (id: string, bookData: Partial<BookFormData>): Promise<Book> => {
    const { data } = await api.put<Book>(`/books/${id}`, bookData);
    return data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  getMyBooks: async (): Promise<Book[]> => {
    const { data } = await api.get<Book[]>('/books/user/my-books');
    return data;
  },
};

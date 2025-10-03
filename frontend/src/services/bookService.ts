import type { Book, BookFilters, BookFormData, BooksResponse } from '../types/book.types'
import api from './api';

export const bookService = {
  getBooks: async (page: number = 1, filters: BookFilters = {}): Promise<BooksResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null)),
    });
    
    const response = await api.get(`/books?${params}`);
    return response.data;
  },

  getBookById: async (id: string): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (bookData: BookFormData): Promise<Book> => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  updateBook: async (id: string, bookData: BookFormData): Promise<Book> => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  getUserBooks: async (): Promise<Book[]> => {
    const response = await api.get('/books/user/my-books');
    return response.data;
  },
};
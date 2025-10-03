import api from "../lib/api";
import type { Book } from "../types/index";

interface BookFormData {
  title: string;
  author: string;
  description: string;
  genre: string;
  publishedYear: number;
}

export const booksApi = {
  async getBooks(
    page = 1,
    limit = 10,
    search?: string,
    genre?: string,
    skip?: number,
    sortBy?: string,
    sortOrder?: string
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append("search", search);
    if (genre) params.append("genre", genre);
    if (skip !== undefined) params.append("skip", skip.toString());
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    const response = await api.get(`/books?${params}`);
    return response.data;
  },

  getBookById: async (id: string): Promise<Book> => {
    const { data } = await api.get<Book>(`/books/${id}`);
    return data;
  },

  addBook: async (bookData: BookFormData): Promise<Book> => {
    const { data } = await api.post<Book>("/books", bookData);
    return data;
  },

  updateBook: async (
    id: string,
    bookData: Partial<BookFormData>
  ): Promise<Book> => {
    const { data } = await api.put<Book>(`/books/${id}`, bookData);
    return data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  getMyBooks: async (): Promise<Book[]> => {
    const { data } = await api.get<Book[]>("/books/user/my-books");
    return data;
  },
};

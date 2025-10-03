import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';
import type { Book, BookFilters, BooksResponse } from '../types/book.types'

export const useBooks = (page: number = 1, filters: BookFilters = {}) => {
  const [booksData, setBooksData] = useState<BooksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await bookService.getBooks(page, filters);
        setBooksData(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [page, JSON.stringify(filters)]);

  return { booksData, isLoading, error, refetch: () => setBooksData(null) };
};

export const useBook = (id: string | undefined) => {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await bookService.getBookById(id);
        setBook(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch book');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, isLoading, error };
};
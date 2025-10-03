export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  BOOK_DETAILS: '/book/:id',
  ADD_BOOK: '/add-book',
  EDIT_BOOK: '/edit-book/:id',
  PROFILE: '/profile',
} as const;

export const GENRES = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Romance',
  'Thriller',
  'Biography',
  'History',
  'Self-Help',
] as const;

export const ITEMS_PER_PAGE = 5;

export const STORAGE_KEYS = {
  TOKEN: 'turnthepage_token',
  THEME: 'turnthepage_theme',
} as const;
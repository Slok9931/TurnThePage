import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const signupSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const bookSchema = yup.object({
  title: yup
    .string()
    .min(1, 'Title is required')
    .required('Title is required'),
  author: yup
    .string()
    .min(1, 'Author is required')
    .required('Author is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  genre: yup
    .string()
    .required('Genre is required'),
  publishedYear: yup
    .number()
    .min(1000, 'Invalid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .required('Published year is required'),
});

export const reviewSchema = yup.object({
  rating: yup
    .number()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5')
    .required('Rating is required'),
  reviewText: yup
    .string()
    .min(10, 'Review must be at least 10 characters')
    .required('Review text is required'),
});
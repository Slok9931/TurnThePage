import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '../hooks/useBooks';
import BookForm from '../components/books/BookForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { bookService } from '../services/bookService';
import type { BookFormData } from '../types/book.types'

const AddEditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { book, isLoading, error } = useBook(id);

  const isEditing = Boolean(id);

  const handleSubmit = async (data: BookFormData) => {
    if (isEditing && id) {
      await bookService.updateBook(id, data);
    } else {
      await bookService.createBook(data);
    }
    navigate('/');
  };

  if (isEditing && isLoading) return <Loading message="Loading book details..." />;
  if (isEditing && error) return <ErrorMessage message={error} />;
  if (isEditing && !book) return <ErrorMessage message="Book not found" />;

  return (
    <Box className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Box className="container mx-auto px-4">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:bg-blue-50"
        >
          Back to Books
        </Button>

        <BookForm
          initialData={book ? {
            title: book.title,
            author: book.author,
            description: book.description,
            genre: book.genre,
            publishedYear: book.publishedYear,
          } : undefined}
          onSubmit={handleSubmit}
          title={isEditing ? 'Edit Book' : 'Add New Book'}
        />
      </Box>
    </Box>
  );
};

export default AddEditBook;
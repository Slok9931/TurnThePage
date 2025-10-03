import React, { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';
import SearchFilter from './SearchFilter';
import Pagination from './Pagination';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';
import { useBooks } from '../../hooks/useBooks';
import { bookService } from '../../services/bookService';
import { ITEMS_PER_PAGE } from '../../utils/constants';
import type { Book, BookFilters } from '../../types/book.types'

const BookList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BookFilters>({});
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    bookId: string;
    bookTitle: string;
  }>({
    open: false,
    bookId: '',
    bookTitle: '',
  });

  const { booksData, isLoading, error, refetch } = useBooks(currentPage, filters);

  const handleFiltersChange = (newFilters: BookFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleEdit = (book: Book) => {
    navigate(`/edit-book/${book._id}`);
  };

  const handleDeleteClick = (bookId: string, bookTitle: string) => {
    setDeleteDialog({
      open: true,
      bookId,
      bookTitle,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await bookService.deleteBook(deleteDialog.bookId);
      setDeleteDialog({ open: false, bookId: '', bookTitle: '' });
      refetch(); // Refresh the book list
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, bookId: '', bookTitle: '' });
  };

  if (isLoading) return <Loading message="Loading books..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <Box className="container mx-auto px-4 py-8">
      <Typography variant="h4" className="mb-8 font-bold text-center">
        Book Collection
      </Typography>

      <SearchFilter filters={filters} onFiltersChange={handleFiltersChange} />

      {booksData?.books.length === 0 ? (
        <Box className="text-center py-12">
          <Typography variant="h6" className="text-gray-500 mb-4">
            No books found
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            {Object.keys(filters).length > 0
              ? 'Try adjusting your search filters'
              : 'Be the first to add a book to the collection!'}
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={4}>
            {booksData?.books.map((book) => (
              <Grid item xs={12} sm={6} lg={4} key={book._id}>
                <BookCard
                  book={book}
                  onEdit={handleEdit}
                  onDelete={(bookId) => handleDeleteClick(bookId, book.title)}
                />
              </Grid>
            ))}
          </Grid>

          {booksData && (
            <Pagination
              currentPage={currentPage}
              totalPages={booksData.totalPages}
              totalItems={booksData.totalBooks}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Book"
        message={`Are you sure you want to delete "${deleteDialog.bookTitle}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Box>
  );
};

export default BookList;
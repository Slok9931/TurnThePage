import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Rating,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Edit, Delete, MoreVert, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '../hooks/useBooks';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ReviewList from '../components/reviews/ReviewList';
import RatingChart from '../components/reviews/RatingChart';
import { bookService } from '../services/bookService';
import { formatDate } from '../utils/helpers';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { book, isLoading, error } = useBook(id);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  if (isLoading) return <Loading message="Loading book details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!book) return <ErrorMessage message="Book not found" />;

  const isOwner = user?.id === book.addedBy._id;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/edit-book/${book._id}`);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await bookService.deleteBook(book._id);
      setDeleteDialog(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

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

        <Grid container spacing={6}>
          <Grid item xs={12} lg={8}>
            <Paper className="p-6 mb-6">
              <Box className="flex justify-between items-start mb-4">
                <Box className="flex-1">
                  <Typography variant="h4" className="font-bold mb-2">
                    {book.title}
                  </Typography>
                  <Typography variant="h6" className="text-gray-600 dark:text-gray-400 mb-4">
                    by {book.author}
                  </Typography>
                </Box>

                {isOwner && (
                  <>
                    <IconButton onClick={handleMenuOpen}>
                      <MoreVert />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleEdit}>
                        <Edit className="mr-2" fontSize="small" />
                        Edit Book
                      </MenuItem>
                      <MenuItem onClick={() => { setDeleteDialog(true); handleMenuClose(); }}>
                        <Delete className="mr-2" fontSize="small" />
                        Delete Book
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </Box>

              <Box className="flex flex-wrap items-center gap-4 mb-6">
                <Chip
                  label={book.genre}
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                />
                <Typography variant="body2" className="text-gray-500">
                  Published: {book.publishedYear}
                </Typography>
                <Box className="flex items-center space-x-2">
                  <Rating
                    value={book.averageRating || 0}
                    readOnly
                    precision={0.1}
                  />
                  <Typography variant="body2" className="text-gray-500">
                    ({book.reviewCount || 0} reviews)
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {book.description}
              </Typography>

              <Box className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Typography variant="body2" className="text-gray-500">
                  Added by {book.addedBy.name} • {formatDate(book.createdAt)}
                </Typography>
              </Box>
            </Paper>

            <ReviewList bookId={book._id} />
          </Grid>

          <Grid item xs={12} lg={4}>
            <RatingChart bookId={book._id} />
          </Grid>
        </Grid>

        <ConfirmDialog
          open={deleteDialog}
          title="Delete Book"
          message={`Are you sure you want to delete "${book.title}"? This will also delete all reviews for this book. This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialog(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </Box>
    </Box>
  );
};

export default BookDetailsPage;
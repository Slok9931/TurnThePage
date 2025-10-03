import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import type { Review, ReviewFormData } from '../../types/review.types'

interface ReviewListProps {
  bookId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ bookId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    reviewId: string;
  }>({
    open: false,
    reviewId: '',
  });

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reviewService.getBookReviews(bookId);
      setReviews(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const userHasReviewed = reviews.some(review => review.userId._id === user?.id);

  const handleSubmitReview = async (data: ReviewFormData) => {
    if (editingReview) {
      await reviewService.updateReview(editingReview._id, data);
      setEditingReview(null);
    } else {
      await reviewService.createReview(bookId, data);
      setShowForm(false);
    }
    fetchReviews();
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDeleteClick = (reviewId: string) => {
    setDeleteDialog({ open: true, reviewId });
  };

  const handleDeleteConfirm = async () => {
    try {
      await reviewService.deleteReview(deleteDialog.reviewId);
      setDeleteDialog({ open: false, reviewId: '' });
      fetchReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  if (isLoading) return <Loading message="Loading reviews..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReviews} />;

  return (
    <Box>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" className="font-semibold">
          Reviews ({reviews.length})
        </Typography>
        {user && !userHasReviewed && !showForm && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Write Review
          </Button>
        )}
      </Box>

      {(showForm || editingReview) && (
        <Box className="mb-6">
          <ReviewForm
            initialData={editingReview ? {
              rating: editingReview.rating,
              reviewText: editingReview.reviewText,
            } : undefined}
            onSubmit={handleSubmitReview}
            onCancel={handleCancelForm}
            title={editingReview ? 'Edit Review' : 'Write a Review'}
          />
        </Box>
      )}

      {reviews.length === 0 ? (
        <Box className="text-center py-8">
          <Typography variant="body1" className="text-gray-500 mb-2">
            No reviews yet
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            Be the first to review this book!
          </Typography>
        </Box>
      ) : (
        <Box>
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onEdit={handleEditReview}
              onDelete={handleDeleteClick}
            />
          ))}
        </Box>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ open: false, reviewId: '' })}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Box>
  );
};

export default ReviewList;
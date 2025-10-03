import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Rating,
  Paper,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { reviewSchema } from '../../utils/validation';
import type { ReviewFormData } from '../../types/review.types'

interface ReviewFormProps {
  initialData?: ReviewFormData;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  title?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  title = 'Write a Review',
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ReviewFormData>({
    resolver: yupResolver(reviewSchema),
    defaultValues: initialData || {
      rating: 0,
      reviewText: '',
    },
  });

  const handleFormSubmit = async (data: ReviewFormData) => {
    try {
      await onSubmit(data);
      if (!initialData) {
        reset(); // Reset form only for new reviews
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save review';
      setError('root', { message });
    }
  };

  return (
    <Paper className="p-6">
      <Typography variant="h6" className="mb-4 font-semibold">
        {title}
      </Typography>

      {errors.root && (
        <Alert severity="error" className="mb-4">
          {errors.root.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Box>
          <Typography variant="body2" className="mb-2 font-medium">
            Rating *
          </Typography>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <Box>
                <Rating
                  {...field}
                  size="large"
                  onChange={(_, value) => field.onChange(value || 0)}
                />
                {errors.rating && (
                  <Typography variant="caption" color="error" className="block mt-1">
                    {errors.rating.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        </Box>

        <Controller
          name="reviewText"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              placeholder="Share your thoughts about this book..."
              error={!!errors.reviewText}
              helperText={errors.reviewText?.message}
            />
          )}
        />

        <Box className="flex justify-end space-x-3">
          {onCancel && (
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Review' : 'Submit Review'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ReviewForm;
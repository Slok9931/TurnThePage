import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { MoreVert, Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getInitials } from '../../utils/helpers';
import type { Review } from '../../types/review.types'

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isOwner = user?.id === review.userId._id;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(review);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(review._id);
    handleMenuClose();
  };

  return (
    <Card className="mb-4">
      <CardContent>
        <Box className="flex justify-between items-start mb-3">
          <Box className="flex items-center space-x-3">
            <Avatar className="bg-blue-600 text-white w-10 h-10">
              {getInitials(review.userId.name)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" className="font-semibold">
                {review.userId.name}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {formatDate(review.createdAt)}
              </Typography>
            </Box>
          </Box>

          {isOwner && (
            <>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEdit}>
                  <Edit className="mr-2" fontSize="small" />
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <Delete className="mr-2" fontSize="small" />
                  Delete
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        <Box className="flex items-center mb-3">
          <Rating value={review.rating} readOnly size="small" />
          <Typography variant="body2" className="ml-2 text-gray-600">
            {review.rating}/5
          </Typography>
        </Box>

        <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
          {review.reviewText}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
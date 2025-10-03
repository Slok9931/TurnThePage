import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  IconButton,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { truncateText } from '../../utils/helpers';
import type { Book } from '../../types/book.types'

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isOwner = user?.id === book.addedBy._id;

  const handleViewDetails = () => {
    navigate(`/book/${book._id}`);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardContent className="flex-grow">
        <Box className="flex justify-between items-start mb-3">
          <Typography variant="h6" className="font-semibold line-clamp-2">
            {book.title}
          </Typography>
          {isOwner && (
            <Box className="flex space-x-1 ml-2">
              <IconButton
                size="small"
                onClick={() => onEdit?.(book)}
                className="text-blue-600 hover:bg-blue-50"
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete?.(book._id)}
                className="text-red-600 hover:bg-red-50"
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-2">
          by {book.author}
        </Typography>

        <Chip
          label={book.genre}
          size="small"
          className="mb-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        />

        <Typography variant="body2" className="text-gray-700 dark:text-gray-300 mb-3">
          {truncateText(book.description, 120)}
        </Typography>

        <Box className="flex items-center space-x-2 mb-2">
          <Rating
            value={book.averageRating || 0}
            readOnly
            size="small"
            precision={0.1}
          />
          <Typography variant="caption" className="text-gray-500">
            ({book.reviewCount || 0} reviews)
          </Typography>
        </Box>

        <Typography variant="caption" className="text-gray-500">
          Published: {book.publishedYear} • Added by {book.addedBy.name}
        </Typography>
      </CardContent>

      <CardActions className="p-4 pt-0">
        <Button
          fullWidth
          variant="outlined"
          onClick={handleViewDetails}
          startIcon={<Visibility />}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default BookCard;
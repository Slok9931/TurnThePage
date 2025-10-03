import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BookList from '../components/books/BookList';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Box className="container mx-auto px-4 py-8">
        <Box className="flex justify-between items-center mb-8">
          <Box>
            <Typography variant="h3" className="font-bold text-gray-900 dark:text-white mb-2">
              Discover Great Books
            </Typography>
            <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
              Explore our collection of books and share your thoughts with the community
            </Typography>
          </Box>
          
          {user && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate(ROUTES.ADD_BOOK)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Book
            </Button>
          )}
        </Box>

        <BookList />
      </Box>
    </Box>
  );
};

export default Home;
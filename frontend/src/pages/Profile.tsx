import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Avatar,
  Card,
  CardContent,
  Rating,
} from '@mui/material';
import { Book, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/books/BookCard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { bookService } from '../services/bookService';
import { reviewService } from '../services/reviewService';
import { getInitials, formatDate } from '../utils/helpers';
import type { Review } from '../types/review.types'
import type { Book as BookType } from '../types/book.types'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [userBooks, setUserBooks] = useState<BookType[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [books, reviews] = await Promise.all([
          bookService.getUserBooks(),
          reviewService.getUserReviews(),
        ]);
        setUserBooks(books);
        setUserReviews(reviews);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!user) {
    return <ErrorMessage message="Please log in to view your profile" />;
  }

  if (isLoading) return <Loading message="Loading profile..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Box className="container mx-auto px-4">
        <Paper className="p-6 mb-6">
          <Box className="flex items-center space-x-6">
            <Avatar className="bg-blue-600 text-white w-20 h-20 text-2xl">
              {getInitials(user.name)}
            </Avatar>
            <Box>
              <Typography variant="h4" className="font-bold mb-2">
                {user.name}
              </Typography>
              <Typography variant="body1" className="text-gray-600 dark:text-gray-400 mb-4">
                {user.email}
              </Typography>
              <Box className="flex space-x-6">
                <Box className="text-center">
                  <Typography variant="h6" className="font-semibold">
                    {userBooks.length}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Books Added
                  </Typography>
                </Box>
                <Box className="text-center">
                  <Typography variant="h6" className="font-semibold">
                    {userReviews.length}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Reviews Written
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper className="p-6">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
            className="mb-4"
          >
            <Tab
              icon={<Book />}
              label="My Books"
              id="profile-tab-0"
              aria-controls="profile-tabpanel-0"
            />
            <Tab
              icon={<Person />}
              label="My Reviews"
              id="profile-tab-1"
              aria-controls="profile-tabpanel-1"
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {userBooks.length === 0 ? (
              <Box className="text-center py-12">
                <Typography variant="h6" className="text-gray-500 mb-2">
                  No books added yet
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  Start building your collection by adding your first book!
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {userBooks.map((book) => (
                  <Grid item xs={12} sm={6} lg={4} key={book._id}>
                    <BookCard book={book} />
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {userReviews.length === 0 ? (
              <Box className="text-center py-12">
                <Typography variant="h6" className="text-gray-500 mb-2">
                  No reviews written yet
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  Share your thoughts by reviewing books in our collection!
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {userReviews.map((review) => (
                  <Grid item xs={12} key={review._id}>
                    <Card>
                      <CardContent>
                        <Box className="flex justify-between items-start mb-3">
                          <Typography variant="h6" className="font-semibold">
                            Review for Book
                          </Typography>
                          <Typography variant="caption" className="text-gray-500">
                            {formatDate(review.createdAt)}
                          </Typography>
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
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
};

export default Profile;
import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import { reviewService } from '../../services/reviewService';
import type { ReviewStats } from '../../types/review.types'
import { Star } from '@mui/icons-material'

interface RatingChartProps {
  bookId: string;
}

const RatingChart: React.FC<RatingChartProps> = ({ bookId }) => {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await reviewService.getReviewStats(bookId);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch review stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [bookId]);

  if (isLoading || !stats) return null;

  const maxCount = Math.max(...Object.values(stats.ratingDistribution));

  return (
    <Paper className="p-6 mb-6">
      <Box className="flex items-center justify-between mb-6">
        <Typography variant="h6" className="font-semibold">
          Rating Distribution
        </Typography>
        <Box className="flex items-center space-x-2">
          <Star className="text-yellow-400" />
          <Typography variant="h6" className="font-bold">
            {stats.averageRating.toFixed(1)}
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            ({stats.totalReviews} reviews)
          </Typography>
        </Box>
      </Box>

      <Box className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution[rating] || 0;
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <Box key={rating} className="flex items-center space-x-3">
              <Box className="flex items-center space-x-1 min-w-[60px]">
                <Typography variant="body2">{rating}</Typography>
                <Star className="text-yellow-400 text-sm" />
              </Box>
              
              <Box className="flex-1">
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  className="h-2 rounded"
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#fbbf24',
                    },
                  }}
                />
              </Box>
              
              <Typography variant="caption" className="min-w-[40px] text-right">
                {count}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default RatingChart;
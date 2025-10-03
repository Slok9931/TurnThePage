import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingProps {
  message?: string;
  size?: number;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', size = 40 }) => {
  return (
    <Box className="flex flex-col items-center justify-center py-12 space-y-4">
      <CircularProgress size={size} className="text-blue-600" />
      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
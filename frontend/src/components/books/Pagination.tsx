import React from 'react';
import { Pagination as MuiPagination, Box, Typography } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <Box className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 py-6">
      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
        Showing {startItem}-{endItem} of {totalItems} results
      </Typography>
      
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default Pagination;
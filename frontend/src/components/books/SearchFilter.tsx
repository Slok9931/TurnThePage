import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import { Search, FilterList, Clear } from '@mui/icons-material';
import { GENRES } from '../../utils/constants';
import type { BookFilters } from '../../types/book.types'

interface SearchFilterProps {
  filters: BookFilters;
  onFiltersChange: (filters: BookFilters) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ filters, onFiltersChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<BookFilters>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleInputChange = (field: keyof BookFilters, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  return (
    <Paper className="p-4 mb-6">
      <Box className="flex items-center space-x-2 mb-4">
        <TextField
          fullWidth
          placeholder="Search by title or author..."
          value={localFilters.search || ''}
          onChange={(e) => handleInputChange('search', e.target.value)}
          InputProps={{
            startAdornment: <Search className="mr-2 text-gray-400" />,
          }}
          className="flex-1"
        />
        <Button
          variant="contained"
          onClick={handleApplyFilters}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Search
        </Button>
        <IconButton onClick={() => setShowFilters(!showFilters)}>
          <FilterList />
        </IconButton>
      </Box>

      <Collapse in={showFilters}>
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <FormControl fullWidth>
            <InputLabel>Genre</InputLabel>
            <Select
              value={localFilters.genre || ''}
              onChange={(e) => handleInputChange('genre', e.target.value)}
              label="Genre"
            >
              <MenuItem value="">All Genres</MenuItem>
              {GENRES.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={localFilters.sortBy || ''}
              onChange={(e) => handleInputChange('sortBy', e.target.value)}
              label="Sort By"
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="author">Author</MenuItem>
              <MenuItem value="publishedYear">Published Year</MenuItem>
              <MenuItem value="averageRating">Rating</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Order</InputLabel>
            <Select
              value={localFilters.sortOrder || ''}
              onChange={(e) => handleInputChange('sortOrder', e.target.value)}
              label="Order"
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>

          <Box className="md:col-span-3 flex justify-end space-x-2">
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<Clear />}
            >
              Clear Filters
            </Button>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default SearchFilter;
import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { bookSchema } from '../../utils/validation';
import { GENRES } from '../../utils/constants';
import type { BookFormData } from '../../types/book.types'

interface BookFormProps {
  initialData?: BookFormData;
  onSubmit: (data: BookFormData) => Promise<void>;
  isLoading?: boolean;
  title: string;
}

const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  title,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<BookFormData>({
    resolver: yupResolver(bookSchema),
    defaultValues: initialData || {
      title: '',
      author: '',
      description: '',
      genre: '',
      publishedYear: new Date().getFullYear(),
    },
  });

  const handleFormSubmit = async (data: BookFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred';
      setError('root', { message });
    }
  };

  return (
    <Paper className="p-6 max-w-2xl mx-auto">
      <Typography variant="h5" className="mb-6 font-semibold">
        {title}
      </Typography>

      {errors.root && (
        <Alert severity="error" className="mb-4">
          {errors.root.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Book Title"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />

        <Controller
          name="author"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Author"
              error={!!errors.author}
              helperText={errors.author?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="genre"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.genre}>
                <InputLabel>Genre</InputLabel>
                <Select {...field} label="Genre">
                  {GENRES.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.genre && (
                  <Typography variant="caption" color="error" className="mt-1 ml-3">
                    {errors.genre.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="publishedYear"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                fullWidth
                label="Published Year"
                error={!!errors.publishedYear}
                helperText={errors.publishedYear?.message}
                inputProps={{
                  min: 1000,
                  max: new Date().getFullYear(),
                }}
              />
            )}
          />
        </Box>

        <Box className="flex justify-end space-x-4">
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Book' : 'Add Book'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default BookForm;
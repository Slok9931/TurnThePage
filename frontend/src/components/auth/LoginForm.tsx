import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import type { LoginCredentials } from '../../types/auth.types'

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      navigate(ROUTES.HOME);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      setError('root', { message });
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Paper className="max-w-md w-full p-8 space-y-6">
        <Box className="text-center">
          <Typography variant="h4" className="font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </Typography>
        </Box>

        {errors.root && (
          <Alert severity="error">
            {errors.root.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email Address"
                type="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 py-3"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <Box className="text-center">
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link component={RouterLink} to={ROUTES.SIGNUP} className="text-blue-600 hover:text-blue-700">
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;